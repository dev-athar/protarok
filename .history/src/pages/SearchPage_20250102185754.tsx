import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { supabase } from "../supabase";
import ResultCard from "../components/ResultCard";

interface SearchResult {
  id: number;
  scamProfileName: string;
  platform: string;
  scamAmount: number;
  dateOfScam: string;
  bankDetails: string;
  paymentPlatform: string;
  scamProfileUrl: string;
}

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10); // Adjust the number of results per page here
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
          .from("public_reports")
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
    setCurrentPage(1); // Reset to the first page on new search
  };

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Search Results</h1>
        <p className="text-lg text-gray-700 mt-2">
          Easily search through our database using phone number, Facebook page
          URL, website, or name
        </p>
      </header>
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentResults.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                onResultClick={handleResultClick}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  className={`px-4 py-2 rounded-md text-white ${
                    currentPage === page + 1
                      ? "bg-blue-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
