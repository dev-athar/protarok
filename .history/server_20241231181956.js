const express = require("express");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

// Endpoint to generate signature
app.post("/api/signature", (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000); // Current time in seconds
  const uploadPreset = "your_signed_preset";

  // Generate the signature
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: uploadPreset,
    },
    cloudinary.config().api_secret
  );

  // Return the signature and other required data
  res.json({
    timestamp,
    signature,
    uploadPreset,
    cloudName: cloudinary.config().cloud_name,
  });
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
