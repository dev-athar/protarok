import { useState } from "react";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client

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
      [name]: Array.from(files),
    }));
  };

  // Upload multiple files to Supabase Storage
  const uploadFilesToSupabase = async (files, folder) => {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map(async (file) => {
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("uploads") // Ensure the bucket name matches
        .upload(filePath, file);

      if (error) {
        console.error("File upload error:", error.message);
        return null;
      }

      const { data: publicData, error: publicError } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (publicError) {
        console.error("Error generating public URL:", publicError.message);
        return null;
      }

      return publicData.publicUrl;
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
      const proofUrls = await uploadFilesToSupabase(formData.proof, "proofs");
      const additionalEvidenceUrls = await uploadFilesToSupabase(
        formData.additionalEvidence,
        "additionalEvidence"
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
          {/* Other form fields */}

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
              multiple
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
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
