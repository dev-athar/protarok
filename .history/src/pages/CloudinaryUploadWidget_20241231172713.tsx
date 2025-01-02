import { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

const CloudinaryUploadWidget = () => {
  // Configuration
  const cloudName = "<your-cloud-name>"; // Replace with your Cloudinary cloud name
  const uploadPreset = "<your-upload-preset>"; // Replace with your upload preset

  // State
  const [imageUrl, setImageUrl] = useState("");

  // Cloudinary configuration
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  // Handle multiple image uploads
  const uploadImagesToCloudinary = async (files) => {
    if (!files || files.length === 0) return [];

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Fetch signature and timestamp from backend
    const signatureResponse = await fetch("/api/signature");
    const { signature, timestamp } = await signatureResponse.json();

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
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

    const uploadedUrls = await Promise.all(uploadPromises);
    setImageUrl(uploadedUrls[0]); // Update state with the first uploaded image URL (example)
    return uploadedUrls;
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const files = event.target.files;
    uploadImagesToCloudinary(files);
  };

  return (
    <div className="App">
      <h3>Cloudinary Image Upload Example</h3>

      <input type="file" multiple onChange={handleFileChange} />

      <div className="documentation-links">
        <p>
          <a
            href="https://cloudinary.com/documentation/upload_widget"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upload Widget User Guide
          </a>
        </p>
        <p>
          <a
            href="https://cloudinary.com/documentation/upload_widget_reference"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upload Widget Reference
          </a>
        </p>
      </div>

      {imageUrl && (
        <div
          className="image-preview"
          style={{ width: "800px", margin: "20px auto" }}
        >
          <AdvancedImage
            style={{ maxWidth: "100%" }}
            cldImg={cld.image(imageUrl)}
            plugins={[responsive(), placeholder()]}
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;
