import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS file!
import ReCAPTCHA from "react-google-recaptcha";

interface FormData {
  scamProfileName: string;
  platform: string;
  bankDetails: string;
  paymentPlatform: string;
  scamAmount: string;
  dateOfScam: string;
  description: string;
  proof: File[];
  additionalEvidence: File[];
  victimContactInfo: string;
  scamProfileUrl: string;
  reportStatus: string;
}

const SubmitScamPage: React.FC = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
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

  const onRecaptchaChange = (value: string | null) => {
    setRecaptchaToken(value);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFiles = (
    files: File[],
    maxFiles: number,
    maxSizeKB: number
  ): File[] => {
    let validFiles: File[] = [];
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    const maxFiles = name === "proof" ? 5 : 2; // Proof allows 5 files, Additional Evidence allows 2
    const maxSizeKB = 1000; // Max file size is 500KB

    const currentFilesCount = formData[name as keyof FormData].length as number;
    const remainingCapacity = maxFiles - currentFilesCount;

    if (remainingCapacity <= 0) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return; // Don't add any more files if limit is reached
    }

    const filesToAdd = Array.from(files).slice(0, remainingCapacity);
    const validFiles = validateFiles(filesToAdd, remainingCapacity, maxSizeKB);

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...(prev[name as keyof FormData] as File[]), ...validFiles],
      }));
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    name: keyof FormData
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const maxFiles = name === "proof" ? 5 : 2;
    const maxSizeKB = 500;

    const currentFilesCount = formData[name].length as number;
    const remainingCapacity = maxFiles - currentFilesCount;

    if (remainingCapacity <= 0) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    const filesToAdd = files.slice(0, remainingCapacity);
    const validFiles = validateFiles(filesToAdd, remainingCapacity, maxSizeKB);

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...(prev[name] as File[]), ...validFiles],
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileDelete = (name: keyof FormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: (prev[name] as File[]).filter((_, i) => i !== index),
    }));
  };

  const getCloudinarySignature = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signature");
      return response.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
      alert("Unable to get signature from the server.");
    }
  };

  const uploadFilesToCloudinary = async (files: File[]) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }

    try {
      const captchaResponse = await axios.post("/api/verifycaptcha", {
        recaptchaToken,
      });

      if (captchaResponse.data.success) {
        try {
          toast.loading("Submitting your report...");

          const normalizedUrl = formData.scamProfileUrl.trim()
            ? formData.scamProfileUrl.trim().startsWith("http")
              ? formData.scamProfileUrl.trim()
              : `https://${formData.scamProfileUrl.trim()}`
            : "";

          const additionalEvidenceUrls = await uploadFilesToCloudinary(
            formData.additionalEvidence
          );
          const proofUrls = await uploadFilesToCloudinary(formData.proof);

          const { error } = await supabase.from("pending_reports").insert([
            {
              ...formData,
              scamProfileUrl: normalizedUrl,
              proof: proofUrls,
              additionalEvidence: additionalEvidenceUrls,
              submittedAt: new Date().toISOString(),
            },
          ]);

          if (error) throw error;

          toast.dismiss();
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
        } catch (error) {
          toast.dismiss();
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
        <form onSubmit={handleSubmit}>{/* Add your form fields here */}</form>
      </div>
    </div>
  );
};

export default SubmitScamPage;
