import React, { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ensure you have Supabase initialized here
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from "@mui/material";

const ScamList = () => {
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScams = async () => {
    try {
      const { data, error } = await supabase
        .from("scamReports")
        .select("*")
        .order("dateOfScam", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching scams:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadScams = async () => {
      const scamData = await fetchScams();
      setScams(scamData);
      setLoading(false);
    };

    loadScams();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Scam Reports
      </Typography>

      {scams.map((scam) => (
        <Card
          key={scam.id}
          sx={{ display: "flex", marginBottom: 2, boxShadow: 3 }}
        >
          <Box
            sx={{
              flex: 2,
              padding: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {scam.scamProfileName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Platform: {scam.platform}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Amount Scammed: <b>{scam.scamAmount}</b>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginTop: 1 }}
            >
              Date of Scam: {new Date(scam.dateOfScam).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Report Status: {scam.reportStatus}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box
            sx={{
              flex: 1,
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() =>
                alert(`Report submitted for scam: ${scam.scamProfileName}`)
              }
            >
              Report Scam
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default ScamList;
