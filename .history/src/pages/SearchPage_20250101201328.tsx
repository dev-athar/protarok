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

  return (
    <div>
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="results-container">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="result-card"
              onClick={() => handleResultClick(result.id)}
            >
              <h3>{result.scamProfileName}</h3>
              <p>
                <strong>Platform:</strong> {result.platform}
              </p>
              <p>
                <strong>Scam Amount:</strong> ${result.scamAmount}
              </p>
              <p>
                <strong>Date of Scam:</strong> {formatDate(result.dateOfScam)}
              </p>
              <p>
                <strong>Bank Details:</strong> {result.bankDetails}
              </p>
              <p>
                <strong>Payment Platform:</strong> {result.paymentPlatform}
              </p>
              <a
                href={result.scamProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Scam Profile
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
