import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { supabase } from "../supabase"; // Ensure you have the supabase client setup

const AdvancedSearchPage = () => {
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
        {/* Heading */}
        <div className="text-center mb-4 font-bold text-lg">
          <p>Search Results for Scam Reports</p>
        </div>

        {/* List of Cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-center p-4">No results found.</p>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={index}
                className="border rounded p-4 shadow hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold mb-2 text-blue-600">
                  {result.scamProfileName}
                </h2>
                <p>
                  <strong>Platform:</strong> {result.platform}
                </p>
                <p>
                  <strong>Scam Amount:</strong> {result.scamAmount}
                </p>
                <p>
                  <strong>Date of Scam:</strong> {result.dateOfScam}
                </p>
                <p>
                  <strong>Report Status:</strong> {result.reportStatus}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
