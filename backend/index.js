//node.js
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json("API works!!"):
})
// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.VITE_BASE_URL, // Replace with your frontend's actual URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

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
app.post("/api/verifycaptcha", async (req, res) => {
  console.log("Request received:", req.body);

  const { recaptchaToken } = req.body;
  if (!recaptchaToken) {
    console.error("Missing reCAPTCHA token.");
    return res.status(400).json({ error: "reCAPTCHA token is missing" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
