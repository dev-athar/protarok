import { useState, useEffect } from "react";
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
            "scamProfileName, platform, scamAmount, dateOfScam, bankDetails, paymentPlatform"
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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Search Results</h1>
      </header>
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
      <div className="mt-4">
        {/* Table Heading */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_1fr] font-bold  p-4 rounded-t gap-4">
          <span className="text-left">Scammer Name</span>
          <span className="text-left">Platform</span>
          <span className="text-left">Scam Amount</span>
          <span className="text-left">Date of Scam</span>
          <span className="text-left">Bank Details</span>
          <span className="text-left">Payment Platform</span>
        </div>

        {/* Results as Cards */}
        <div className="flex flex-col gap-4 mt-2">
          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-center p-4">No results found.</p>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={index}
                className="border rounded p-4 bg-white shadow-md hover:shadow-lg"
              >
                <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_1fr] gap-4">
                  <div className="text-left">
                    <p>{result.scamProfileName}</p>
                  </div>
                  <div className="text-left">
                    <p>{result.platform}</p>
                  </div>
                  <div className="text-left">
                    <p>Tk {result.scamAmount}</p>
                  </div>
                  <div className="text-left">
                    <p>{formatDate(result.dateOfScam)}</p>
                  </div>
                  <div className="text-left">
                    <p>{result.bankDetails}</p>
                  </div>
                  <div className="text-left">
                    <p>{result.paymentPlatform}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
