import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const ReportFalsePage = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onRecaptchaChange = (value) => {
    // console.log("Captcha value:", value);
    setRecaptchaToken(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return; // Stop form submission if reCAPTCHA is not validated
    }
    try {
      // Send the reCAPTCHA token to the backend for verification
      const captchaResponse = await axios.post("/api/verifycaptcha", {
        recaptchaToken,
      });

      if (captchaResponse.data.success) {
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
              submittedAt: new Date().toISOString(),
            },
          ]);

          if (error) throw error;

          toast.success("False report submitted successfully!");
          navigate(-1); // Go back to the previous page
        } catch (error) {
          console.error("Error submitting false report:", error);
          toast.error("Failed to submit the report. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("reCAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error during reCAPTCHA verification.");
      console.error("Error during reCAPTCHA verification:", error);
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
          {/* Add to the end of the form (before the submit button) */}
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LcB06oqAAAAAPg28adZ7vgDkS_TLXR2ax2Dp9E3" // Replace with your actual site key
              onChange={onRecaptchaChange}
            />
          </div>
          <div className="flex justify-end">
            {/* Add to the end of the form (before the submit button) */}
            <div className="mb-4">
              <ReCAPTCHA
                sitekey="6LcB06oqAAAAAPg28adZ7vgDkS_TLXR2ax2Dp9E3" // Replace with your actual site key
                onChange={onRecaptchaChange}
              />
            </div>
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

      <ToastContainer />
    </div>
  );
};

export default ReportFalsePage;
