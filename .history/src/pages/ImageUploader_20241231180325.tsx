import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image to upload!');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', '<YOUR_UNSIGNED_UPLOAD_PRESET>'); // Replace with your upload preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setUrl(data.secure_url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image to Cloudinary</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {url && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={url} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
