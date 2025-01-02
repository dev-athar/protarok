// src/components/SearchBar.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ initialQuery = "", onSearch }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      if (onSearch) onSearch(searchTerm);
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-8">
      <input
        type="text"
        className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by phone number, Facebook page, website, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
