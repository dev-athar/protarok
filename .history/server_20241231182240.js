// server.js
const express = require("express");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate Cloudinary signature
app.post("/api/signature", (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000); // Current time in seconds
  const uploadPreset = "your_signed_preset"; // Replace with your signed upload preset

  try {
    // Generate the signature
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: uploadPreset },
      cloudinary.config().api_secret
    );

    // Send the signature and related data
    res.status(200).json({
      timestamp,
      signature,
      uploadPreset,
      cloudName: cloudinary.config().cloud_name,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate signature", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
