import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";

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

  useEffect(() => {
    // Fetch search results from the database (Firebase or other source)
    const fetchSearchResults = async () => {
      const mockResults: ScamProfile[] = [
        {
          id: "1",
          phoneNumber: "123-456-7890",
          website: "https://www.example.com",
          facebookPage: "https://facebook.com/example",
          proof: "https://path-to-proof.jpg",
          description: "Scam involving fake e-commerce website.",
          associatedProfiles: [
            "https://facebook.com/another-example",
            "https://www.fakeexample.com",
          ],
        },
        // Add more mock profiles
      ];
      setSearchResults(mockResults);
    };

    fetchSearchResults();
  }, []);

  // Define columns for MUI DataGrid
  const columns: GridColDef[] = [
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    {
      field: "website",
      headerName: "Website",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "facebookPage",
      headerName: "Facebook Page",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "proof",
      headerName: "Proof",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <a
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Preview
        </a>
      ),
    },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="error"
          onClick={() =>
            alert(`Reported false claim for profile ${params.row.id}`)
          }
        >
          Report
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%", backgroundColor: "white" }}>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Search Results</h1>
        <p className="text-gray-700 mt-2">
          Explore the profiles based on your search query.
        </p>
      </header>
      <DataGrid
        rows={searchResults}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default SearchResultsPage;
