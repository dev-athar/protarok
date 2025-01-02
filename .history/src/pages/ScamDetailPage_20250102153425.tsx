import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import ImageSection from "./ImageSection";

const ScamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scamDetails, setScamDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const fetchScamDetails = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("public_reports")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (
          typeof data.additionalEvidence === "string" ||
          typeof data.proof === "string"
        ) {
          try {
            data.proof = JSON.parse(data.proof);
            data.additionalEvidence = JSON.parse(data.additionalEvidence);
          } catch (parseError) {
            console.error("Error parsing additionalEvidence:", parseError);
            data.proof = [];
            data.additionalEvidence = [];
          }
        }

        setScamDetails(data);
      } catch (error) {
        console.error("Error fetching scam details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScamDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!scamDetails)
    return <p className="text-center mt-6">Scam report not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Scam details</h1>
      </header>

      <div className="grid gap-6 bg-gray-50 p-4 rounded-md shadow-md">
        {/* Scam Details Sections */}
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Scammer Profile Name
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.scamProfileName}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Platform</h2>
          <p className="text-lg text-gray-800">{scamDetails.platform}</p>
        </div>
        {/* Other Sections Here */}

        <ImageSection images={scamDetails.proof} type="Proof" />
        <ImageSection
          images={scamDetails.additionalEvidence}
          type="Additional Evidence"
        />
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Back to Search
        </button>
        <button
          onClick={() => navigate(`/report-false/${id}`)}
          className="p-2 bg-red-500 text-white rounded"
        >
          Report as False
        </button>
      </div>
    </div>
  );
};

export default ScamDetailPage;
