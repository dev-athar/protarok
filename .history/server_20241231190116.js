import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

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

// console.log("Cloudinary Config:", cloudinary.config()); // Log to verify

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate Cloudinary signature
app.post("/api/signature", (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000); // Current time in seconds
  const uploadPreset = "ml_default"; // Replace with your signed upload preset
  console.log("Signature:", { timestamp, signature, uploadPreset }); // Log to verify

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
