import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { supabase } from "../supabase"; // Ensure you have the supabase client setup

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("scamReports")
          .select(
            "scamProfileName, platform, scamAmount, dateOfScam, reportStatus"
          )
          .ilike("scamProfileName", `%${searchTerm}%`);

        if (error) throw error;

        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Search Results</h1>
      </header>
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
      <div className="mt-4">
        {/* Column Names */}
        <div className="grid grid-cols-5 font-bold bg-gray-200 p-2 rounded-t">
          <span>Scammer Name</span>
          <span>Platform</span>
          <span>Scam Amount</span>
          <span>Date of Scam</span>
          <span>Report Status</span>
        </div>

        {/* List of Cards */}
        <div className="flex flex-col border rounded-b">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-center p-4">No results found.</p>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={index}
                className="grid grid-cols-5 border-b p-2 items-center hover:bg-gray-100"
              >
                <span>{result.scamProfileName}</span>
                <span>{result.platform}</span>
                <span>{result.scamAmount}</span>
                <span>{result.dateOfScam}</span>
                <span>{result.reportStatus}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
