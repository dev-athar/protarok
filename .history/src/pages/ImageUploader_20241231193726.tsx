//ImageUploader.tsx
import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getSignature = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signature");
      return response.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
      alert("Unable to get signature from the server.");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const { timestamp, signature, uploadPreset, cloudName, apiKey } =
        await getSignature();

      console.log({ timestamp, signature, uploadPreset, cloudName, apiKey });

      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_Key", apiKey);

      // Debugging: Log the formData
      console.log("Form Data:", [...formData.entries()]);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      setUploadStatus("Upload successful!");
      console.log("Uploaded image URL:", response.data.secure_url);
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error uploading the image:", error);

      // Additional debugging
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  return (
    <div>
      <h1>Upload Image to Cloudinary</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "200px", marginTop: "10px" }}
        />
      )}
      <br />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;
