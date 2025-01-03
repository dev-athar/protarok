import { useState, useEffect, useCallback } from "react";

interface ImageSectionProps {
  images: string[]; // Array of image URLs
  type: string; // Type of images (e.g., "Proof" or "Additional Evidence")
}

const ImageSection: React.FC<ImageSectionProps> = ({ images, type }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const handleNext = useCallback((): void => {
    setSelectedImageIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev
    );
  }, [images.length]);

  const handlePrev = useCallback((): void => {
    setSelectedImageIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : prev
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev] // Dependencies of handleKeyDown
  );

  useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImageIndex, handleKeyDown]); // Include handleKeyDown in the dependency array

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

          <div className="absolute bottom-4 flex gap-4">
            <button
              className={`text-2xl w-12 h-12 flex items-center justify-center rounded-full ${
                selectedImageIndex > 0
                  ? "text-white bg-gray-800"
                  : "text-gray-500 bg-gray-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={selectedImageIndex <= 0}
            >
              &#706;
            </button>

            <button
              className={`text-2xl w-12 h-12 flex items-center justify-center rounded-full ${
                selectedImageIndex < images.length - 1
                  ? "text-white bg-gray-800"
                  : "text-gray-500 bg-gray-800"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={selectedImageIndex >= images.length - 1}
            >
              &#707;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
