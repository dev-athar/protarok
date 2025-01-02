import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { supabase } from "../supabase"; // Ensure you have the supabase client setup

const AdvancedSearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
            "scamProfileName, platform, bankDetails, paymentPlatform, scamAmount, dateOfScam, description, proof, additionalEvidence, victimContactInfo, scamProfileUrl, reportStatus"
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

  const columns = [
    { field: "scamProfileName", headerName: "Scammer Name", width: 200 },
    { field: "platform", headerName: "Platform", width: 150 },
    { field: "bankDetails", headerName: "Bank Details", width: 200 },
    { field: "paymentPlatform", headerName: "Payment Platform", width: 200 },
    { field: "scamAmount", headerName: "Scam Amount", width: 150 },
    { field: "dateOfScam", headerName: "Date of Scam", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "proof", headerName: "Proof", width: 200 },
    {
      field: "additionalEvidence",
      headerName: "Additional Evidence",
      width: 200,
    },
    {
      field: "victimContactInfo",
      headerName: "Victim Contact Info",
      width: 200,
    },
    { field: "scamProfileUrl", headerName: "Scammer Profile URL", width: 250 },
    { field: "reportStatus", headerName: "Report Status", width: 150 },
  ];

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Search Results</h1>
      </header>
      <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />
      <div style={{ height: 600, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={searchResults}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          getRowId={(row) => row.scamProfileName}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
