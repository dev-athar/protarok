import { useState } from "react";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client
import CloudinaryUploadWidget from "./ImageUploader";

const SubmitScamPage = () => {
  const [formData, setFormData] = useState({
    scamProfileName: "",
    platform: "",
    scamContactInfo: "",
    dateOfScam: "",
    description: "",
    proof: [],
    paymentMethod: "",
    additionalEvidence: [],
    victimContactInfo: "",
    bankDetails: "",
    paymentPlatform: "",
    scamProfileUrl: "",
    reportStatus: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ...Array.from(files)],
    }));
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ...files],
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileDelete = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  // Upload multiple files to Supabase Storage
  // const uploadFilesToSupabase = async (files, folder) => {
  //   if (!files || files.length === 0) {
  //     return [];
  //   }

  //   const uploadPromises = files.map(async (file) => {
  //     const filePath = `${folder}/${Date.now()}-${file.name}`;
  //     const { data, error } = await supabase.storage
  //       .from("uploads") // Ensure the bucket name matches
  //       .upload(filePath, file);

  //     if (error) {
  //       console.error("File upload error:", error.message);
  //       return null;
  //     }

  //     const { data: publicData, error: publicError } = supabase.storage
  //       .from("uploads")
  //       .getPublicUrl(filePath);

  //     if (publicError) {
  //       console.error("Error generating public URL:", publicError.message);
  //       return null;
  //     }

  //     return publicData.publicUrl;
  //   });

  //   return Promise.all(uploadPromises);
  // };

  // Upload multiple files to Cloudinary
  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    const uploadUrl = `https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload`;

    // Fetch signature and timestamp from backend
    const signatureResponse = await fetch("/api/signature");
    const { signature, timestamp } = await signatureResponse.json();

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "scam-archive");
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", "<your-api-key>"); // Replace with your Cloudinary API key

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        return data.secure_url; // Return the uploaded image URL
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const normalizedUrl = formData.scamProfileUrl.trim()
        ? formData.scamProfileUrl.trim().startsWith("http")
          ? formData.scamProfileUrl.trim()
          : `https://${formData.scamProfileUrl.trim()}`
        : "";

      const formDataWithUrl = {
        ...formData,
        scamProfileUrl: normalizedUrl,
      };

      // Upload files to Supabase Storage
      // const proofUrls = await uploadFilesToSupabase(formData.proof, "proofs");
      // const additionalEvidenceUrls = await uploadFilesToSupabase(
      //   formData.additionalEvidence,
      //   "additionalEvidence"
      // );

      // Upload files to Cloudinary
      const proofUrls = await uploadImagesToCloudinary(formData.proof);
      const additionalEvidenceUrls = await uploadImagesToCloudinary(
        formData.additionalEvidence
      );

      // Insert data into Supabase database
      const { error } = await supabase.from("scamReports").insert([
        {
          ...formDataWithUrl,
          proof: proofUrls.length > 0 ? proofUrls : null,
          additionalEvidence:
            additionalEvidenceUrls.length > 0 ? additionalEvidenceUrls : null,
          submittedAt: new Date(),
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setFormData({
        scamProfileName: "",
        platform: "",
        scamContactInfo: "",
        dateOfScam: "",
        description: "",
        proof: [],
        paymentMethod: "",
        additionalEvidence: [],
        victimContactInfo: "",
        bankDetails: "",
        paymentPlatform: "",
        scamProfileUrl: "",
        reportStatus: "",
      });
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "An error occurred while submitting your report. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Submit a Scam Report
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Help others stay safe by reporting your scam experience.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {isSubmitted && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
            Thank you! Your report has been submitted and is pending admin
            approval.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUploader />
          {/* Scam Profile Name */}
          <div className="mb-4">
            <label
              htmlFor="scamProfileName"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Profile Name or Business Name
            </label>
            <input
              type="text"
              id="scamProfileName"
              name="scamProfileName"
              value={formData.scamProfileName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter profile or business name"
              required
            />
          </div>

          {/* Platform Used */}
          <div className="mb-4">
            <label
              htmlFor="platform"
              className="block text-lg font-semibold text-gray-800"
            >
              Platform Used
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Website">Website</option>
              <option value="Phone">Phone</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Scammer’s Bank Details */}
          <div className="mb-4">
            <label
              htmlFor="bankDetails"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Bank Details
            </label>
            <input
              type="text"
              id="bankDetails"
              name="bankDetails"
              value={formData.bankDetails}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., bKash/Nagad account or bank details"
              required
            />
          </div>

          {/* Payment Platform */}
          <div className="mb-4">
            <label
              htmlFor="paymentPlatform"
              className="block text-lg font-semibold text-gray-800"
            >
              Payment Platform Used
            </label>
            <input
              type="text"
              id="paymentPlatform"
              name="paymentPlatform"
              value={formData.paymentPlatform}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., bKash, Nagad, etc."
            />
          </div>

          {/* Date and Time of Scam */}
          <div className="mb-4">
            <label
              htmlFor="dateOfScam"
              className="block text-lg font-semibold text-gray-800"
            >
              Date and Time of Scam
            </label>
            <input
              type="datetime-local"
              id="dateOfScam"
              name="dateOfScam"
              value={formData.dateOfScam}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-gray-800"
            >
              Summary of the Incident
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Describe the scam in detail"
              required
            ></textarea>
          </div>

          {/* Supporting Evidence */}
          <div
            className="mb-4 border-dashed border-2 border-gray-300 p-4 rounded-lg"
            onDrop={(e) => handleDrop(e, "proof")}
            onDragOver={handleDragOver}
          >
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Supporting Evidence (Drag & Drop or Click)
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 mt-2">
              Drag & drop files here, or click to select files.
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
              {formData.proof.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  {file.name}
                  <button
                    type="button"
                    className="text-red-500 ml-4 hover:underline"
                    onClick={() => handleFileDelete("proof", index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Evidence */}
          <div
            className="mb-4 border-dashed border-2 border-gray-300 p-4 rounded-lg"
            onDrop={(e) => handleDrop(e, "additionalEvidence")}
            onDragOver={handleDragOver}
          >
            <label
              htmlFor="additionalEvidence"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Additional Evidence (Optional, Drag & Drop or Click)
            </label>
            <input
              type="file"
              id="additionalEvidence"
              name="additionalEvidence"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-500 mt-2">
              Drag & drop files here, or click to select files.
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
              {formData.additionalEvidence.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  {file.name}
                  <button
                    type="button"
                    className="text-red-500 ml-4 hover:underline"
                    onClick={() =>
                      handleFileDelete("additionalEvidence", index)
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Victim Contact Info */}
          <div className="mb-4">
            <label
              htmlFor="victimContactInfo"
              className="block text-lg font-semibold text-gray-800"
            >
              Your Contact Info (Optional)
            </label>
            <input
              type="text"
              id="victimContactInfo"
              name="victimContactInfo"
              value={formData.victimContactInfo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone (optional)"
            />
          </div>

          {/* Scammer Profile URL */}
          <div className="mb-4">
            <label
              htmlFor="scamProfileUrl"
              className="block text-lg font-semibold text-gray-800"
            >
              Scammer’s Profile URL (Optional)
            </label>
            <input
              type="text"
              id="scamProfileUrl"
              name="scamProfileUrl"
              value={formData.scamProfileUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scammer's profile URL (Optional)"
            />
          </div>

          {/* Report Status */}
          <div className="mb-4">
            <label
              htmlFor="reportStatus"
              className="block text-lg font-semibold text-gray-800"
            >
              Report Status (Optional)
            </label>
            <input
              type="text"
              id="reportStatus"
              name="reportStatus"
              value={formData.reportStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Status of report, like Information about complaints made to authorities"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Scam Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitScamPage;
