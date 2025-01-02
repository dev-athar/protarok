import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client

const ReportFalsePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("pending_reports").insert([
        {
          scamProfileName: id, // Add ID to scamProfileName
          victimContactInfo: contact, // Add contact to victimContactInfo
          description: description, // Add description to description field
          status: "false",
          scamProfileUrl: "", // Keep others empty
          platform: "",
          bankDetails: "",
          paymentPlatform: "",
          scamAmount: 0,
          dateOfScam: "2000-01-01 00:00:00",
          proof: [],
          additionalEvidence: [],
          reportStatus: "",
        },
      ]);

      if (error) throw error;

      alert("False report submitted successfully!");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error submitting false report:", error);
      alert("Failed to submit the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-600">Report as False</h1>
      </header>

      <div className="bg-gray-50 p-4 rounded-md shadow-md">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500">Scam ID</h2>
          <p className="text-lg text-gray-800">{id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Your Contact Information
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email or phone number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Explain why you believe this report is false"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="p-2 bg-red-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFalsePage;
