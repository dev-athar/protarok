import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFilesChange = (files) => {
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFilesChange(e.dataTransfer.files);
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
    if (images.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setUploadStatus("Uploading...");

    try {
      const { timestamp, signature, uploadPreset, cloudName, apiKey } =
        await getSignature();

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", uploadPreset);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
      }

      setUploadStatus("Upload successful!");
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error uploading the images:", error);
    }
  };

  return (
    <div>
      <h1>Upload Images to Cloudinary</h1>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        Drag & drop files here or click below to select
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFilesChange(e.target.files)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              margin: "5px",
            }}
          >
            <button
              onClick={() => handleDelete(index)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <br />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImageUploader;
