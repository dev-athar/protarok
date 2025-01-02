import React, { useState } from "react";
import axios from "axios";

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default"); // Replace with your unsigned preset

    try {
      setUploadStatus("Uploading...");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dr8qmcnf0/image/upload",
        formData
      );
      // Replace <YOUR_CLOUD_NAME> with your Cloudinary cloud name

      setUploadStatus("Upload successful!");
      console.log("Uploaded image URL:", response.data.secure_url);
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error uploading the image:", error);
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

export default CloudinaryUpload;
