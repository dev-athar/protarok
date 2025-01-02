import { useState } from "react";
import { supabase } from "../supabase"; // Adjust path as necessary

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

  const uploadFileToSupabase = async (file, folder) => {
    if (!file) return null;

    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads") // Ensure you have a bucket named "uploads" in your Supabase project
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

      // Insert form data into Supabase database
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
          submittedAt: new Date(),
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      // Reset form and show confirmation
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
          {/* Add other form fields similarly */}
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
