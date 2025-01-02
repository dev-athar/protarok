// Recaptcha.js
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = () => {
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Handle the successful verification
  const onChange = (value) => {
    console.log("Captcha value:", value);
    setRecaptchaValue(value);
    if (value) {
      setIsVerified(true);
    }
  };

  // Handle form submission (you can add your form logic here)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isVerified) {
      alert("Form submitted successfully!");
    } else {
      alert("Please complete the reCAPTCHA");
    }
  };

  return (
    <div>
      <h2>reCAPTCHA v2 Test</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <ReCAPTCHA
            sitekey="6LcB06oqAAAAAPg28adZ7vgDkS_TLXR2ax2Dp9E3" // Replace with your actual reCAPTCHA site key
            onChange={onChange}
          />
        </div>
        <button type="submit" disabled={!isVerified}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Recaptcha;
