import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { supabase } from "../supabase";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResultClick = (id) => {
    navigate(`/scam-detail/${id}`);
  };

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
            "id, scamProfileName, platform, scamAmount, dateOfScam, bankDetails, paymentPlatform, scamProfileUrl"
          )
          .or(
            `scamProfileName.ilike.%${searchTerm}%,bankDetails.ilike.%${searchTerm}%,scamProfileUrl.ilike.%${searchTerm}%`
          );

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

  return (    <div className="min-h-screen bg-gray-100 p-6">
    {/* Header */}
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to Scam Archive
      </h1>
    <div className="p-4">
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
              onClick={() => handleResultClick(result.id)}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {result.scamProfileName}
              </h3>
              <p className="text-sm text-gray-600">{result.platform}</p>
              <p className="text-sm text-red-500 font-bold">
                Tk {result.scamAmount}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(result.dateOfScam)}
              </p>
              <p className="text-sm text-gray-600">
                {result.paymentPlatform}: {result.bankDetails}
              </p>
              <a
                href={result.scamProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm mt-2 inline-block"
              >
                {result.scamProfileUrl}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
