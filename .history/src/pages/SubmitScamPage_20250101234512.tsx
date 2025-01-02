import { useState } from "react";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS file!
import ReCAPTCHA from "react-google-recaptcha";

const SubmitScamPage = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    scamProfileName: "",
    platform: "",
    bankDetails: "",
    paymentPlatform: "",
    scamAmount: "",
    dateOfScam: "",
    description: "",
    proof: [],
    additionalEvidence: [],
    victimContactInfo: "",
    scamProfileUrl: "",
    reportStatus: "",
  });

  // const [isSubmitted, setIsSubmitted] = useState(false);

  const onRecaptchaChange = (value) => {
    // console.log("Captcha value:", value);
    setRecaptchaToken(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFiles = (files, maxFiles, maxSizeKB) => {
    let validFiles = [];
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > maxSizeKB) {
        toast.error(`File ${file.name} exceeds the ${maxSizeKB}KB size limit.`);
        return validFiles; // Stop processing if any file is too large
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not a valid image format.`);
        return validFiles; // Stop processing if any file is not an image
      }
      totalSize += fileSizeKB;
      validFiles.push(file);
    }

    if (validFiles.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return []; // Return empty array if more files are selected than allowed
    }

    return validFiles;
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxFiles = name === "proof" ? 5 : 2; // Proof allows 5 files, Additional Evidence allows 2
    const maxSizeKB = 1000; // Max file size is 500KB

    // Calculate the remaining capacity for new files
    const currentFilesCount = formData[name].length;
    const remainingCapacity = maxFiles - currentFilesCount;

    if (remainingCapacity <= 0) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return; // Don't add any more files if limit is reached
    }

    // Limit the number of files to the remaining capacity
    const filesToAdd = Array.from(files).slice(0, remainingCapacity);

    // Validate the files (size and type)
    const validFiles = validateFiles(filesToAdd, remainingCapacity, maxSizeKB);

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...validFiles],
      }));
    }
  };

  const handleDrop = (e, name) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const maxFiles = name === "proof" ? 5 : 2;
    const maxSizeKB = 500;

    // Check how many files are already in the field and calculate the remaining capacity
    const currentFilesCount = formData[name].length;
    const remainingCapacity = maxFiles - currentFilesCount;

    if (remainingCapacity <= 0) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return; // Don't add any more files if limit is reached
    }

    // Limit the number of files to the remaining capacity
    const filesToAdd = files.slice(0, remainingCapacity);

    // Validate the files (size and type)
    const validFiles = validateFiles(filesToAdd, remainingCapacity, maxSizeKB);

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], ...validFiles],
      }));
    }
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

  //signature
  const getCloudinarySignature = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signature");
      return response.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
      alert("Unable to get signature from the server.");
    }
  };

  // Upload multiple files to Cloudinary
  const uploadFilesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    try {
      const { timestamp, signature, uploadPreset, cloudName, apiKey } =
        await getCloudinarySignature();
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload?api_key=${apiKey}&timestamp=${timestamp}&signature=${signature}`,
          formData
        );
        return response.data.secure_url;
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading files to Cloudinary:", error);
      alert("File upload failed. Please try again.");
      return [];
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        // Proceed with submitting the form data
        try {
          // Show loading toast
          toast.loading("Submitting your report...");

          // Normalize the URL
          const normalizedUrl = formData.scamProfileUrl.trim()
            ? formData.scamProfileUrl.trim().startsWith("http")
              ? formData.scamProfileUrl.trim()
              : `https://${formData.scamProfileUrl.trim()}`
            : "";

          const proofUrls = await uploadFilesToCloudinary(formData.proof);
          const additionalEvidenceUrls = await uploadFilesToCloudinary(
            formData.additionalEvidence
          );

          const { error } = await supabase.from("scamReports").insert([
            {
              ...formData,
              scamProfileUrl: normalizedUrl,
              proof: proofUrls,
              additionalEvidence: additionalEvidenceUrls,
              submittedAt: new Date().toISOString(),
            },
          ]);

          if (error) throw error;

          // Show success toast after submission
          toast.dismiss(); // Dismiss the loading toast
          toast.success("Your report has been submitted successfully!");

          setFormData({
            scamProfileName: "",
            platform: "",
            bankDetails: "",
            paymentPlatform: "",
            scamAmount: "",
            dateOfScam: "",
            description: "",
            proof: [],
            additionalEvidence: [],
            victimContactInfo: "",
            scamProfileUrl: "",
            reportStatus: "",
          });
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
          // Show error toast
          toast.dismiss(); // Dismiss the loading toast
          toast.error(
            "An error occurred while submitting your report. Please try again."
          );
          console.error("Error submitting form:", error);
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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ToastContainer will render the toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000} // 5 seconds for each toast to auto-dismiss
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Submit a Scam Report
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Help others stay safe by reporting your scam experience.
        </p>
      </header>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* {isSubmitted && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-lg">
            Thank you! Your report has been submitted and is pending admin
            approval.
          </div>
        )} */}

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
              placeholder="e.g., bKash/Nagad number or bank details"
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
              placeholder="e.g., bKash, Nagad, bank name, etc."
            />
          </div>
          {/* Scam Amount */}
          <div className="mb-4">
            <label
              htmlFor="scamAmount"
              className="block text-lg font-semibold text-gray-800"
            >
              Scam Amount (in TK)
            </label>
            <input
              type="number"
              id="scamAmount"
              name="scamAmount"
              value={formData.scamAmount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter scam amount in TK"
              required
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
            className="mb-4 border-dashed border-2 border-gray-300 p-4 rounded-lg "
            onDrop={(e) => handleDrop(e, "proof")}
            onDragOver={handleDragOver}
          >
            <label
              htmlFor="proof"
              className="block text-lg font-semibold text-gray-800 hover:cursor-pointer"
            >
              Upload Supporting Evidence (max 5 files || 1MB)
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
                    className="text-red-500 ml-4 hover:underline "
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
              className="block text-lg font-semibold text-gray-800 hover:cursor-pointer"
            >
              Upload Additional Evidence (Optional, max 2 files || 1MB)
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

          {/* Add to the end of the form (before the submit button) */}
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="6LcB06oqAAAAAPg28adZ7vgDkS_TLXR2ax2Dp9E3" // Replace with your actual site key
              onChange={onRecaptchaChange}
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
