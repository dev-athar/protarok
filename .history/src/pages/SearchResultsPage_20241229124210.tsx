import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("query") || "");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Mock search results for demonstration
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch search results from the database (Firebase or other source)
    const fetchSearchResults = async () => {
      const mockResults: ScamProfile[] = [
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
        {
          id: "13",
          phoneNumber: "123-456-7812",
          website: "https://www.example12.com",
          facebookPage: "https://facebook.com/example12",
          proof: "https://path-to-proof12.jpg",
          description: "Scam involving fake e-commerce website #12.",
          associatedProfiles: [
            "https://facebook.com/associated-example12",
            "https://www.fakeexample12.com",
          ],
        },
        {
          id: "14",
          phoneNumber: "123-456-7813",
          website: "https://www.example13.com",
          facebookPage: "https://facebook.com/example13",
          proof: "https://path-to-proof13.jpg",
          description: "Scam involving fake e-commerce website #13.",
          associatedProfiles: [
            "https://facebook.com/associated-example13",
            "https://www.fakeexample13.com",
          ],
        },
        {
          id: "15",
          phoneNumber: "123-456-7814",
          website: "https://www.example14.com",
          facebookPage: "https://facebook.com/example14",
          proof: "https://path-to-proof14.jpg",
          description: "Scam involving fake e-commerce website #14.",
          associatedProfiles: [
            "https://facebook.com/associated-example14",
            "https://www.fakeexample14.com",
          ],
        },
        {
          id: "16",
          phoneNumber: "123-456-7815",
          website: "https://www.example15.com",
          facebookPage: "https://facebook.com/example15",
          proof: "https://path-to-proof15.jpg",
          description: "Scam involving fake e-commerce website #15.",
          associatedProfiles: [
            "https://facebook.com/associated-example15",
            "https://www.fakeexample15.com",
          ],
        },
        {
          id: "17",
          phoneNumber: "123-456-7816",
          website: "https://www.example16.com",
          facebookPage: "https://facebook.com/example16",
          proof: "https://path-to-proof16.jpg",
          description: "Scam involving fake e-commerce website #16.",
          associatedProfiles: [
            "https://facebook.com/associated-example16",
            "https://www.fakeexample16.com",
          ],
        },
        {
          id: "18",
          phoneNumber: "123-456-7817",
          website: "https://www.example17.com",
          facebookPage: "https://facebook.com/example17",
          proof: "https://path-to-proof17.jpg",
          description: "Scam involving fake e-commerce website #17.",
          associatedProfiles: [
            "https://facebook.com/associated-example17",
            "https://www.fakeexample17.com",
          ],
        },
        {
          id: "19",
          phoneNumber: "123-456-7818",
          website: "https://www.example18.com",
          facebookPage: "https://facebook.com/example18",
          proof: "https://path-to-proof18.jpg",
          description: "Scam involving fake e-commerce website #18.",
          associatedProfiles: [
            "https://facebook.com/associated-example18",
            "https://www.fakeexample18.com",
          ],
        },
        {
          id: "20",
          phoneNumber: "123-456-7819",
          website: "https://www.example19.com",
          facebookPage: "https://facebook.com/example19",
          proof: "https://path-to-proof19.jpg",
          description: "Scam involving fake e-commerce website #19.",
          associatedProfiles: [
            "https://facebook.com/associated-example19",
            "https://www.fakeexample19.com",
          ],
        },
        {
          id: "21",
          phoneNumber: "123-456-7820",
          website: "https://www.example20.com",
          facebookPage: "https://facebook.com/example20",
          proof: "https://path-to-proof20.jpg",
          description: "Scam involving fake e-commerce website #20.",
          associatedProfiles: [
            "https://facebook.com/associated-example20",
            "https://www.fakeexample20.com",
          ],
        },
        {
          id: "22",
          phoneNumber: "123-456-7821",
          website: "https://www.example21.com",
          facebookPage: "https://facebook.com/example21",
          proof: "https://path-to-proof21.jpg",
          description: "Scam involving fake e-commerce website #21.",
          associatedProfiles: [
            "https://facebook.com/associated-example21",
            "https://www.fakeexample21.com",
          ],
        },
        {
          id: "23",
          phoneNumber: "123-456-7822",
          website: "https://www.example22.com",
          facebookPage: "https://facebook.com/example22",
          proof: "https://path-to-proof22.jpg",
          description: "Scam involving fake e-commerce website #22.",
          associatedProfiles: [
            "https://facebook.com/associated-example22",
            "https://www.fakeexample22.com",
          ],
        },
        {
          id: "24",
          phoneNumber: "123-456-7823",
          website: "https://www.example23.com",
          facebookPage: "https://facebook.com/example23",
          proof: "https://path-to-proof23.jpg",
          description: "Scam involving fake e-commerce website #23.",
          associatedProfiles: [
            "https://facebook.com/associated-example23",
            "https://www.fakeexample23.com",
          ],
        },
        {
          id: "25",
          phoneNumber: "123-456-7824",
          website: "https://www.example24.com",
          facebookPage: "https://facebook.com/example24",
          proof: "https://path-to-proof24.jpg",
          description: "Scam involving fake e-commerce website #24.",
          associatedProfiles: [
            "https://facebook.com/associated-example24",
            "https://www.fakeexample24.com",
          ],
        },
        {
          id: "26",
          phoneNumber: "123-456-7825",
          website: "https://www.example25.com",
          facebookPage: "https://facebook.com/example25",
          proof: "https://path-to-proof25.jpg",
          description: "Scam involving fake e-commerce website #25.",
          associatedProfiles: [
            "https://facebook.com/associated-example25",
            "https://www.fakeexample25.com",
          ],
        },
        {
          id: "27",
          phoneNumber: "123-456-7826",
          website: "https://www.example26.com",
          facebookPage: "https://facebook.com/example26",
          proof: "https://path-to-proof26.jpg",
          description: "Scam involving fake e-commerce website #26.",
          associatedProfiles: [
            "https://facebook.com/associated-example26",
            "https://www.fakeexample26.com",
          ],
        },
        {
          id: "28",
          phoneNumber: "123-456-7827",
          website: "https://www.example27.com",
          facebookPage: "https://facebook.com/example27",
          proof: "https://path-to-proof27.jpg",
          description: "Scam involving fake e-commerce website #27.",
          associatedProfiles: [
            "https://facebook.com/associated-example27",
            "https://www.fakeexample27.com",
          ],
        },
        {
          id: "29",
          phoneNumber: "123-456-7828",
          website: "https://www.example28.com",
          facebookPage: "https://facebook.com/example28",
          proof: "https://path-to-proof28.jpg",
          description: "Scam involving fake e-commerce website #28.",
          associatedProfiles: [
            "https://facebook.com/associated-example28",
            "https://www.fakeexample28.com",
          ],
        },
        {
          id: "30",
          phoneNumber: "123-456-7829",
          website: "https://www.example29.com",
          facebookPage: "https://facebook.com/example29",
          proof: "https://path-to-proof29.jpg",
          description: "Scam involving fake e-commerce website #29.",
          associatedProfiles: [
            "https://facebook.com/associated-example29",
            "https://www.fakeexample29.com",
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
