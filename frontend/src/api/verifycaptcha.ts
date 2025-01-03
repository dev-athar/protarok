// src/api/verifycaptcha.ts

import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

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
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      }
    );

    const data = response.data;
    console.log("reCAPTCHA response:", data);

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }
  } catch (error: unknown) {
    console.error("Error verifying reCAPTCHA:", error);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA" });
  }
};
