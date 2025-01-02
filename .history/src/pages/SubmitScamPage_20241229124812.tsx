// src/pages/SubmitScamPage.js
import { useState } from "react";

const SubmitScamPage = () => {
  const [formData, setFormData] = useState({
    scamType: "",
    description: "",
    proof: null,
    contactInfo: "",
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
    setFormData((prev) => ({
      ...prev,
      proof: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission logic; replace with your Firebase or backend logic
    console.log("Form Submitted", formData);

    // Reset form and show confirmation message
    setFormData({
      scamType: "",
      description: "",
      proof: null,
      contactInfo: "",
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
          {/* Scam Type */}
          <div className="mb-4">
            <label
              htmlFor="scamType"
              className="block text-lg font-semibold text-gray-800"
            >
              Scam Type
            </label>
            <select
              id="scamType"
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Scam Type</option>
              <option value="Phone">Phone</option>
              <option value="Website">Website</option>
              <option value="Facebook">Facebook</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-gray-800"
            >
              Description
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

          {/* Proof Upload */}
          <div className="mb-4">
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800"
            >
              Upload Proof
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

          {/* Contact Information */}
          <div className="mb-4">
            <label
              htmlFor="contactInfo"
              className="block text-lg font-semibold text-gray-800"
            >
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone (optional)"
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
