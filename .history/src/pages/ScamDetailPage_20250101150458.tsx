import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

const ScamDetailPage = () => {
  const { id } = useParams();
  const [scamDetails, setScamDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScamDetails = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("scamReports")
          .select("*")
          .eq("id", id)
          .single(); // Fetch the specific report

        if (error) throw error;

        setScamDetails(data);
      } catch (error) {
        console.error("Error fetching scam details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScamDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!scamDetails) return <p>Scam report not found.</p>;

  return (
    <div className="p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          {scamDetails.scamProfileName}
        </h1>
      </header>
      <div className="grid gap-4">
        <p>
          <strong>Platform:</strong> {scamDetails.platform}
        </p>
        <p>
          <strong>Bank Details:</strong> {scamDetails.bankDetails}
        </p>
        <p>
          <strong>Payment Platform:</strong> {scamDetails.paymentPlatform}
        </p>
        <p>
          <strong>Scam Amount:</strong> Tk {scamDetails.scamAmount}
        </p>
        <p>
          <strong>Date of Scam:</strong>{" "}
          {new Date(scamDetails.dateOfScam).toLocaleDateString()}
        </p>
        <p>
          <strong>Description:</strong> {scamDetails.description}
        </p>
        <p>
          <strong>Proof:</strong> {scamDetails.proof.join(", ")}
        </p>
        <p>
          <strong>Additional Evidence:</strong>{" "}
          {scamDetails.additionalEvidence.join(", ")}
        </p>
        <p>
          <strong>Victim Contact Info:</strong> {scamDetails.victimContactInfo}
        </p>
        <p>
          <strong>Scam Profile URL:</strong>{" "}
          <a
            href={scamDetails.scamProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Profile
          </a>
        </p>
        <p>
          <strong>Report Status:</strong> {scamDetails.reportStatus}
        </p>
      </div>{" "}
      <button
        onClick={() => window.history.back()}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Back to Search
      </button>
    </div>
  );
};

export default ScamDetailPage;
