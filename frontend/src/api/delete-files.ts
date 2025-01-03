// src/api/delete-files.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { publicIds } = req.body;

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({ error: "No public IDs provided." });
    }

    const deletePromises = publicIds.map((id: string) =>
      cloudinary.uploader.destroy(id)
    );

    const results = await Promise.all(deletePromises);

    res.status(200).json({ message: "Files deleted successfully.", results });
  } catch (error: unknown) {
    console.error("Error deleting files:", error);
    res.status(500).json({ error: "Failed to delete files." });
  }
};
