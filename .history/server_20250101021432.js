//server.js
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

// Middleware to parse JSON requests
app.use(express.json());

// reCAPTCHA verification endpoint
app.post("/api/verifycaptcha", async (req, res) => {
  const { recaptchaToken } = req.body;

  // Ensure the reCAPTCHA token is provided
  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token is missing" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Get the secret key from environment variable
    const url = `https://www.google.com/recaptcha/api/siteverify`;

    // Request body to verify reCAPTCHA with Google
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    // If reCAPTCHA verification is successful
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

// Route to generate Cloudinary signature
app.post("/api/signature", (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const uploadPreset = "ml_default";
  const apiKey = cloudinary.config().api_key;
  const api_secret = cloudinary.config().api_secret;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
