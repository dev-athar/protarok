// src/pages/HomePage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecentScamsList from "./RecentScamsList";
import SearchBar from "./SearchBar";
import Counter from "./Counter";
import { supabase } from "../supabase";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScammers: 0,
    totalSearchesToday: 0,
    totalReportsToday: 0,
  });

  const handleSearch = (newSearchTerm) => {
    if (newSearchTerm.trim() !== "") {
      setSearchTerm(newSearchTerm); // Update searchTerm state
      navigate(`/search?query=${encodeURIComponent(newSearchTerm)}`);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total scammers count
        const { data: scammersData, error: scammersError } = await supabase
          .from("public_reports")
          .select("id", { count: "exact" }); // Assuming 'id' is the primary key

        if (scammersError) {
          throw scammersError;
        }

        // Fetch total reports today
        const todayStart = new Date().setHours(0, 0, 0, 0); // Midnight of today
        const tomorrowStart = new Date().setHours(24, 0, 0, 0); // Midnight of tomorrow

        const { data: reportsData, error: reportsError } = await supabase
          .from("public_reports")
          .select("id")
          .gte("approvedAt", new Date(todayStart).toISOString()) // Start of today
          .lt("approvedAt", new Date(tomorrowStart).toISOString()); // Start of tomorrow

        if (reportsError) {
          throw reportsError;
        }

        // Fetch total search count
        // const { data: searchesData, error: searchedError } = await supabase
        //   .from("edge_logs")
        //   .select("*") // Select only 'method' from 'request' in 'metadata'
        //   .eq("metadata.request.method", "GET");

        // console.log(searchesData);
        // if (searchedError) {
        //   throw searchedError;
        // }

        // log explorer query
        // select count(*) as fetch_request_count
        // from edge_logs as t
        // cross join unnest(t.metadata) as m
        // cross join unnest(m.request) as r
        // where r.method = 'GET';

        setStats({
          totalScammers: scammersData.length, // Or you can use scammersData.count if needed
          totalReportsToday: reportsData.length,
          totalSearchesToday: 112, // You will need to implement logic for this if needed
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
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

      {/* Pass searchTerm to SearchBar */}
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />

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
          {/* Use the Counter component */}
          <Counter label="Total Scammers" value={stats.totalScammers} />
          <Counter label="Searches Today" value={stats.totalSearchesToday} />
          <Counter label="Reports Today" value={stats.totalReportsToday} />
        </div>
      </section>
      {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
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
      </section> */}

      {/* Recent Scams List */}
      <RecentScamsList />

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
