import { useState } from "react";

const ImageSection = ({ images, type }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  console.log("Type of images:", typeof images);
  console.log("Content of images:", images);

  if (!images || images.length === 0) return null;

  return ({
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-sm font-medium text-gray-500">{type} Images</h2>
      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Proof ${index + 1}`}
            className="w-24 h-24 object-cover cursor-pointer border rounded-md"
            onClick={() => setSelectedImage(imageUrl)}
          />
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Selected Proof"
            className="max-w-full max-h-full rounded-md"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
