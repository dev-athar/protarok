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
          .single();

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

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!scamDetails)
    return <p className="text-center mt-6">Scam report not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Scam Details</h1>
      </header>

      <div className="grid gap-6 bg-gray-50 p-4 rounded-md shadow-md">
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

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Bank Details</h2>
          <p className="text-lg text-gray-800">{scamDetails.bankDetails}</p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Payment Platform
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.paymentPlatform}</p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Scam Amount</h2>
          <p className="text-lg text-gray-800">Tk {scamDetails.scamAmount}</p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Date of Scam</h2>
          <p className="text-lg text-gray-800">
            {new Date(scamDetails.dateOfScam).toLocaleDateString()}
          </p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Description</h2>
          <p className="text-lg text-gray-800">{scamDetails.description}</p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Victim Contact Info
          </h2>
          <p className="text-lg text-gray-800">
            {scamDetails.victimContactInfo}
          </p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Scam Profile URL
          </h2>
          <a
            href={scamDetails.scamProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Profile
          </a>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Report Status</h2>
          <p className="text-lg text-gray-800">{scamDetails.reportStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default ScamDetailPage;
