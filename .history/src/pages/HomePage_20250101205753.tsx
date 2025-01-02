// src/pages/HomePage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecentScamsList from "./RecentScamsList";
import SearchBar from "./SearchBar";

function HomePage() {
  const initialSearchTerm = queryParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScammers: 0,
    totalSearchesToday: 0,
    totalReportsToday: 0,
  });

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };
  useEffect(() => {
    // Example: Fetch stats from Firebase (pseudo-code, replace with your DB logic)
    const fetchStats = async () => {
      // Replace the following logic with actual Firebase fetching
      const mockStats = {
        totalScammers: 1250, // Replace with a query like: await db.collection('scams').count()
        totalSearchesToday: 78, // Replace with your actual search count logic
        totalReportsToday: 15, // Replace with your actual report count logic
      };
      setStats(mockStats);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome to Scam Archive
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Protect yourself from online scams by browsing through reported
          frauds.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      {/* Search Bar */}
      {/* <div className="max-w-xl mx-auto mb-8">
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
      </div> */}

      {/* Counters Section */}
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-around items-center text-center">
          <div className="flex-1 p-4 mx-2 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalScammers}
            </h3>
            <p className="text-gray-600">Total Scammers</p>
          </div>
          <div className="flex-1 p-4 mx-2 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalSearchesToday}
            </h3>
            <p className="text-gray-600">Searches Today</p>
          </div>
          <div className="flex-1 p-4 mx-2 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalReportsToday}
            </h3>
            <p className="text-gray-600">Reports Today</p>
          </div>
        </div>
      </section>

      {/* Recent Scams List */}
      <RecentScamsList />
      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Scams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentScams.map((scam) => (
            <div
              key={scam.id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {scam.title}
              </h3>
              <p className="text-gray-600 mt-2">{scam.description}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Report Scam Button */}
      <div className="text-center mb-8">
        <a
          href="/submit-scam"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
        >
          Report a Scam
        </a>
      </div>

      {/* Login Button */}
      {/* <div className="text-center">
        <a
          href="/login"
          className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition duration-300"
        >
          Log In
        </a>
      </div> */}
    </div>
  );
}

export default HomePage;
