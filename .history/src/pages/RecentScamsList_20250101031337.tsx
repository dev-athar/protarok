{
  /* <section className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Scams</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {recentScams.map((scam) => (
      <div
        key={scam.id}
        className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200"
      >
        <h3 className="text-xl font-semibold text-gray-900">{scam.title}</h3>
        <p className="text-gray-600 mt-2">{scam.description}</p>
      </div>
    ))}
  </div>
</section>; */
}

const fetchRecentScams = async () => {
  try {
    const { data, error } = await supabase
      .from("scamReports")
      .select("*")
      .order("dateOfScam", { ascending: false }) // Order by most recent scams
      .limit(10); // Adjust the number as needed

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching recent scams:", error);
    return [];
  }
};
