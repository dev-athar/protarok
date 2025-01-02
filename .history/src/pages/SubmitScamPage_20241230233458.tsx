import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Import the Supabase client
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client

const SubmitScamPage = () => {
  const [formData, setFormData] = useState({
    scamProfileName: "",
    platform: "",
    scamContactInfo: "",
    dateOfScam: "",
    description: "",
    proof: null,
    paymentMethod: "",
    additionalEvidence: null,
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
      [name]: files[0],
    }));
  };

  // Upload file to Supabase Storage
  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;

    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads") // Ensure you have a bucket named 'uploads'
      .upload(filePath, file);

    if (error) {
      console.error("File upload error:", error.message);
      return null;
    }

    const { publicURL } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);
    return publicURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload files to Supabase Storage
      const proofUrl = await uploadFileToSupabase(formData.proof, "proofs");
      const additionalEvidenceUrl = await uploadFileToSupabase(
        formData.additionalEvidence,
        "additionalEvidence"
      );

      // Insert data into Supabase database
      const { error } = await supabase.from("scamReports").insert([
        {
          scamProfileName: formData.scamProfileName,
          platform: formData.platform,
          scamContactInfo: formData.scamContactInfo,
          dateOfScam: formData.dateOfScam,
          description: formData.description,
          proofUrl: proofUrl || null,
          additionalEvidenceUrl: additionalEvidenceUrl || null,
          paymentMethod: formData.paymentMethod,
          victimContactInfo: formData.victimContactInfo,
          bankDetails: formData.bankDetails,
          paymentPlatform: formData.paymentPlatform,
          scamProfileUrl: formData.scamProfileUrl,
          reportStatus: formData.reportStatus,
          submittedAt: new Date(), // Add timestamp
        },
      ]);

      // Reset form and show confirmation message
      setFormData({
        scamProfileName: "",
        platform: "",
        scamContactInfo: "",
        dateOfScam: "",
        description: "",
        proof: null,
        paymentMethod: "",
        additionalEvidence: null,
        victimContactInfo: "",
        bankDetails: "",
        paymentPlatform: "",
        scamProfileUrl: "",
        reportStatus: "",
      });
      setIsSubmitted(true);

      // Hide confirmation message after a timeout
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form: ", error);
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
          <div className="mb-4">
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Supporting Evidence
            </label>
            <input
              type="file"
              id="proof"
              name="proof"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Additional Evidence */}
          <div className="mb-4">
            <label
              htmlFor="additionalEvidence"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Additional Evidence (Optional)
            </label>
            <input
              type="file"
              id="additionalEvidence"
              name="additionalEvidence"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              type="url"
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

          {/* Submit Button */}
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
