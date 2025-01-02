// src/components/SearchBar.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-8">
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
    </div>
  );
}

export default SearchBar;



// import { useState } from "react";
// import { supabase } from "../supabase"; // Ensure you have the supabase client setup

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (searchTerm.trim() === "") {
//       setSearchResults([]);
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data, error } = await supabase
//         .from("scamReports")
//         .select("*")
//         .ilike("scamProfileName", `%${searchTerm}%`); // Case-insensitive search

//       if (error) throw error;

//       setSearchResults(data);
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mb-8">
//       {/* Search Input */}
//       <input
//         type="text"
//         className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="Search by scam profile name..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//       />
//       <button
//         onClick={handleSearch}
//         className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//       >
//         Search
//       </button>

//       {/* Search Results */}
//       {loading ? (
//         <p className="text-gray-600 mt-4">Loading...</p>
//       ) : searchResults.length > 0 ? (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Search Results
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {searchResults.map((result) => (
//               <div
//                 key={result.id}
//                 className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
//               >
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   {result.scamProfileName}
//                 </h3>
//                 <p className="text-red-600 font-bold mt-2">
//                   Tk {result.scamAmount}
//                 </p>
//                 <p className="text-gray-600 mt-2">{result.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : searchTerm.trim() && (
//         <p className="text-gray-600 mt-4">No results found.</p>
//       )}
//     </div>
//   );
// };

// export default SearchBar;
