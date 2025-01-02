import { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission logic; replace with your Firebase or backend logic
    console.log("Form Submitted", formData);

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

          {/* Other fields... */}

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
