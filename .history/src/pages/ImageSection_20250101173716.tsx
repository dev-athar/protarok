import { useState, useEffect } from "react";

const ImageSection = ({ images, type }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const handleNext = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageIndex]);

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-sm font-medium text-gray-500">{type} Images</h2>
      <div className="flex flex-wrap gap-4 mt-4">
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Proof ${index + 1}`}
            className="w-24 h-24 object-cover cursor-pointer border rounded-md"
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImageIndex(null)}
          tabIndex={0}
        >
          <img
            src={images[selectedImageIndex]}
            alt={`Selected Proof ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full rounded-md"
          />

          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedImageIndex(null)}
          >
            &times;
          </button>

          {selectedImageIndex > 0 && (
            <button
              className="absolute bottom-4 left-1/3 text-gray-500 text-2xl bg-gray-800 p-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              &#8592;
            </button>
          )}

          {selectedImageIndex < images.length - 1 && (
            <button
              className="absolute bottom-4 right-1/3 text-gray-500 text-2xl bg-gray-800 p-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSection;
