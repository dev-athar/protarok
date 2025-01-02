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

  const handleAdvancedSearch = () => {
    navigate("/advanced-search");
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mr-2"
        >
          Search
        </button>
        <button
          onClick={handleAdvancedSearch}
          className="bg-gray-200 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-300 transition duration-300 text-sm"
        >
          Advanced Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
