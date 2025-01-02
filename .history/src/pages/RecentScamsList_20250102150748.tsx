import { supabase } from "../supabase"; // Ensure you have a supabase.js file exporting the initialized client
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RecentScamsList = () => {
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  const fetchRecentScams = async () => {
    try {
      const { data, error } = await supabase
        .from("public")
        .select("*")
        .order("dateOfScam", { ascending: false }) // Order by most recent scams
        .limit(6); // Adjust the number as needed

      if (error) throw error;
      console.log("scamlist:", data);
      return data;
    } catch (error) {
      console.error("Error fetching recent scams:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadRecentScams = async () => {
      const scams = await fetchRecentScams();
      setRecentScams(scams);
      setLoading(false);
    };

    loadRecentScams();
  }, []); // Empty dependency array means this runs only once when the component is mounted.

  // Function to handle clicking on a scam item
  const handleScamClick = (id) => {
    navigate(`/scam-detail/${id}`); // Navigate to the scam detail page
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Scams
      </h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentScams.map((scam) => (
            <div
              key={scam.id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200 cursor-pointer"
              onClick={() => handleScamClick(scam.id)} // Add onClick event
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {scam.scamProfileName}
              </h3>
              <p className="text-red-600 font-bold mt-2">
                Tk {scam.scamAmount}
              </p>
              <p className="text-gray-600 mt-2">{scam.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentScamsList;
