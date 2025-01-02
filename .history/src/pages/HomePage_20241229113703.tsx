// src/pages/HomePage.js
import { useState } from "react";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const recentScams = [
    { id: 1, title: "Scam A", description: "Scam description here." },
    { id: 2, title: "Scam B", description: "Scam description here." },
    { id: 3, title: "Scam C", description: "Scam description here." },
  ]; // Example recent scams

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

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by phone number, Facebook page, website, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Counters Section */}
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalScammers}
            </h3>
            <p className="text-gray-600">Total Scammers</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalSearchesToday}
            </h3>
            <p className="text-gray-600">Searches Today</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800">
              {stats.totalReportsToday}
            </h3>
            <p className="text-gray-600">Reports Today</p>
          </div>
        </div>
      </section>

      {/* Recent Scams List */}
      <section className="mb-8">
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
      </section>

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
      <div className="text-center">
        <a
          href="/login"
          className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition duration-300"
        >
          Log In
        </a>
      </div>
    </div>
  );
}

export default HomePage;
