// src/components/SearchBar.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (newSearchTerm: string) => void;
  initialValue?: string; // Optional if it's not always provided
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      if (onSearch) onSearch(searchTerm);
    }
  };

  const handleAdvancedSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/advanced-search?query=${encodeURIComponent(searchTerm)}`);
      if (onSearch) onSearch(searchTerm);
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-8">
      <input
        type="text"
        className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by phone number, Facebook page, website, names, etc."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleSearch}
          className="w-2/3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mr-2"
        >
          Search
        </button>
        <button
          onClick={handleAdvancedSearch}
          className="w-1/3 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Advanced Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
