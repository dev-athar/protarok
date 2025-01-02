import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const timestamp = Math.floor(new Date().getTime() / 1000);
const uploadPreset = "ml_default";

const signature = cloudinary.utils.api_sign_request(
  { timestamp, upload_preset: uploadPreset },
  cloudinary.config().api_secret
);

console.log("Generated Signature:", signature);
