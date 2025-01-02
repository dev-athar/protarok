//server.js
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = import.meta.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to generate Cloudinary signature
app.post("/api/signature", (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const uploadPreset = "ml_default";

  try {
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: uploadPreset },
      cloudinary.config().api_secret
    );

    res.status(200).json({
      timestamp,
      signature,
      uploadPreset,
      cloudName: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key, // Include the api_key in the response
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res
      .status(500)
      .json({ error: "Failed to generate signature", details: error.message });
  }
});

// reCAPTCHA verification endpoint
aapp.post("/api/verifycaptcha", async (req, res) => {
  console.log("Request received:", req.body);

  const { recaptchaToken } = req.body;
  if (!recaptchaToken) {
    console.error("Missing reCAPTCHA token.");
    return res.status(400).json({ error: "reCAPTCHA token is missing" });
  }

  try {
    const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;
    console.log("Verifying with secret:", secretKey);

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );

    const data = response.data;
    console.log("reCAPTCHA response:", data);

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA" });
  }
});

// Route to delete Cloudinary files
app.post("/api/delete-files", async (req, res) => {
  try {
    const { publicIds } = req.body;

    if (!publicIds || publicIds.length === 0) {
      return res.status(400).json({ error: "No public IDs provided." });
    }

    const deletePromises = publicIds.map((id) =>
      cloudinary.uploader.destroy(id)
    );

    const results = await Promise.all(deletePromises);

    res.status(200).json({ message: "Files deleted successfully.", results });
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).json({ error: "Failed to delete files." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
