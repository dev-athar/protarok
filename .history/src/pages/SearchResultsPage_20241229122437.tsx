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
        const dummyData = [
          {
            id: "1",
            phoneNumber: "123-456-7800",
            website: "https://www.example0.com",
            facebookPage: "https://facebook.com/example0",
            proof: "https://path-to-proof0.jpg",
            description: "Scam involving fake e-commerce website #0.",
            associatedProfiles: [
              "https://facebook.com/associated-example0",
              "https://www.fakeexample0.com",
            ],
          },
          {
            id: "2",
            phoneNumber: "123-456-7801",
            website: "https://www.example1.com",
            facebookPage: "https://facebook.com/example1",
            proof: "https://path-to-proof1.jpg",
            description: "Scam involving fake e-commerce website #1.",
            associatedProfiles: [
              "https://facebook.com/associated-example1",
              "https://www.fakeexample1.com",
            ],
          },
          {
            id: "3",
            phoneNumber: "123-456-7802",
            website: "https://www.example2.com",
            facebookPage: "https://facebook.com/example2",
            proof: "https://path-to-proof2.jpg",
            description: "Scam involving fake e-commerce website #2.",
            associatedProfiles: [
              "https://facebook.com/associated-example2",
              "https://www.fakeexample2.com",
            ],
          },
          {
            id: "4",
            phoneNumber: "123-456-7803",
            website: "https://www.example3.com",
            facebookPage: "https://facebook.com/example3",
            proof: "https://path-to-proof3.jpg",
            description: "Scam involving fake e-commerce website #3.",
            associatedProfiles: [
              "https://facebook.com/associated-example3",
              "https://www.fakeexample3.com",
            ],
          },
          {
            id: "5",
            phoneNumber: "123-456-7804",
            website: "https://www.example4.com",
            facebookPage: "https://facebook.com/example4",
            proof: "https://path-to-proof4.jpg",
            description: "Scam involving fake e-commerce website #4.",
            associatedProfiles: [
              "https://facebook.com/associated-example4",
              "https://www.fakeexample4.com",
            ],
          },
          {
            id: "6",
            phoneNumber: "123-456-7805",
            website: "https://www.example5.com",
            facebookPage: "https://facebook.com/example5",
            proof: "https://path-to-proof5.jpg",
            description: "Scam involving fake e-commerce website #5.",
            associatedProfiles: [
              "https://facebook.com/associated-example5",
              "https://www.fakeexample5.com",
            ],
          },
          {
            id: "7",
            phoneNumber: "123-456-7806",
            website: "https://www.example6.com",
            facebookPage: "https://facebook.com/example6",
            proof: "https://path-to-proof6.jpg",
            description: "Scam involving fake e-commerce website #6.",
            associatedProfiles: [
              "https://facebook.com/associated-example6",
              "https://www.fakeexample6.com",
            ],
          },
          {
            id: "8",
            phoneNumber: "123-456-7807",
            website: "https://www.example7.com",
            facebookPage: "https://facebook.com/example7",
            proof: "https://path-to-proof7.jpg",
            description: "Scam involving fake e-commerce website #7.",
            associatedProfiles: [
              "https://facebook.com/associated-example7",
              "https://www.fakeexample7.com",
            ],
          },
          {
            id: "9",
            phoneNumber: "123-456-7808",
            website: "https://www.example8.com",
            facebookPage: "https://facebook.com/example8",
            proof: "https://path-to-proof8.jpg",
            description: "Scam involving fake e-commerce website #8.",
            associatedProfiles: [
              "https://facebook.com/associated-example8",
              "https://www.fakeexample8.com",
            ],
          },
          {
            id: "10",
            phoneNumber: "123-456-7809",
            website: "https://www.example9.com",
            facebookPage: "https://facebook.com/example9",
            proof: "https://path-to-proof9.jpg",
            description: "Scam involving fake e-commerce website #9.",
            associatedProfiles: [
              "https://facebook.com/associated-example9",
              "https://www.fakeexample9.com",
            ],
          },
          {
            id: "11",
            phoneNumber: "123-456-7810",
            website: "https://www.example10.com",
            facebookPage: "https://facebook.com/example10",
            proof: "https://path-to-proof10.jpg",
            description: "Scam involving fake e-commerce website #10.",
            associatedProfiles: [
              "https://facebook.com/associated-example10",
              "https://www.fakeexample10.com",
            ],
          },
          {
            id: "12",
            phoneNumber: "123-456-7811",
            website: "https://www.example11.com",
            facebookPage: "https://facebook.com/example11",
            proof: "https://path-to-proof11.jpg",
            description: "Scam involving fake e-commerce website #11.",
            associatedProfiles: [
              "https://facebook.com/associated-example11",
              "https://www.fakeexample11.com",
            ],
          },
          //... Add remaining 18 entries
        ];
        
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
