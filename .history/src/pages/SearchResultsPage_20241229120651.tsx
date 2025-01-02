import React, { useState, useEffect } from "react";

interface ScamProfile {
  id: string;
  phoneNumber: string;
  website: string;
  facebookPage: string;
  proof: string; // URL to screenshot or proof
  description: string;
  associatedProfiles: string[];
}

const SearchResultsPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<ScamProfile[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage] = useState<number>(5); // Number of results per page
  const [sortOption, setSortOption] = useState<string>("date");

  useEffect(() => {
    // Fetch search results from the database (Firebase or other source)
    const fetchSearchResults = async () => {
      // Replace with actual fetch logic
      const mockResults: ScamProfile[] = [
        {
          id: "1",
          phoneNumber: "123-456-7890",
          website: "www.example.com",
          facebookPage: "facebook.com/example",
          proof: "/path-to-proof.jpg",
          description: "Scam involving fake e-commerce website.",
          associatedProfiles: [
            "facebook.com/another-example",
            "www.fakeexample.com",
          ],
        },
        // Add more mock profiles
      ];
      setSearchResults(mockResults);
    };

    fetchSearchResults();
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Sort logic can be added here
  };

  // Pagination logic
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Search Results</h1>
        <p className="text-gray-700 mt-2">
          Explore the profiles based on your search query.
        </p>
      </header>

      {/* Sorting and Filtering */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="severity">Sort by Severity</option>
        </select>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 gap-4">
        {currentResults.map((profile) => (
          <div key={profile.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800">
              Phone: {profile.phoneNumber}
            </h3>
            <p className="text-gray-600">
              Website:{" "}
              <a href={profile.website} className="text-blue-500 underline">
                {profile.website}
              </a>
            </p>
            <p className="text-gray-600">
              Facebook:{" "}
              <a
                href={profile.facebookPage}
                className="text-blue-500 underline"
              >
                {profile.facebookPage}
              </a>
            </p>
            <p className="text-gray-700 mt-2">{profile.description}</p>
            <div className="mt-4">
              <h4 className="text-gray-800 font-semibold">Proof:</h4>
              <img
                src={profile.proof}
                alt="Scam Proof"
                className="w-32 h-32 rounded border mt-2"
              />
            </div>
            <div className="mt-4">
              <h4 className="text-gray-800 font-semibold">
                Associated Profiles:
              </h4>
              <ul className="list-disc ml-4 text-gray-600">
                {profile.associatedProfiles.map((link, index) => (
                  <li key={index}>
                    <a href={link} className="text-blue-500 underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              onClick={() =>
                alert(`Reported false claim for profile ${profile.id}`)
              }
            >
              Report False Claim
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        {[
          ...Array(Math.ceil(searchResults.length / resultsPerPage)).keys(),
        ].map((page) => (
          <button
            key={page + 1}
            className={`mx-1 px-4 py-2 rounded-md ${
              currentPage === page + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
