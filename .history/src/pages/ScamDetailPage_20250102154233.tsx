import { useEffect, useState } from "react";
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
        // Parse additionalEvidence if it's a string
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
        // console.log("length", scamDetails.proof.length);
        // console.log("proof", scamDetails.proof);
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
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Scammer Profile Name
            <button
              className="ml-2 text-gray text-xs"
              title="Profile name which the scammer used. It can be facebook page name, website brand name, etc"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.scamProfileName}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Platform
            <button
              className="ml-2 text-gray text-xs"
              title="The platform where the scam occurred, such as facebook, website, etc."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.platform}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Scammer Bank Details
            <button
              className="ml-2 text-gray text-xs"
              title="The bank account details provided by the scammer for payment."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.bankDetails}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Payment Platform
            <button
              className="ml-2 text-gray text-xs"
              title="The payment platform used for the transaction, such as bkash, nagad or bank account number."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.paymentPlatform}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Scam Amount
            <button
              className="ml-2 text-gray text-xs"
              title="The total amount lost in the scam."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">Tk {scamDetails.scamAmount}</p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Date of Scam
            <button
              className="ml-2 text-gray text-xs"
              title="The date on which the scam took place."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">
            {formatDate(scamDetails.dateOfScam)}
          </p>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Description
            <button
              className="ml-2 text-gray text-xs"
              title="Detailed description of the scam incident."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.description}</p>
        </div>

        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Scammer Profile URL
            <button
              className="ml-2 text-gray text-xs"
              title="The URL to the scammer's online profile."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <a
            href={scamDetails.scamProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {scamDetails.scamProfileUrl}
          </a>
        </div>
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Report Status
            <button
              className="ml-2 text-gray text-xs"
              title="Current status of the scam report made to local authorities."
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                />
              </svg>
            </button>
          </h2>
          <p className="text-lg text-gray-800">{scamDetails.reportStatus}</p>
        </div>
        {/* Proof Images Section */}

        <ImageSection images={scamDetails.proof} type="Proof" />

        <ImageSection
          images={scamDetails.additionalEvidence}
          type="Additional Evidence"
        />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => window.history.back()}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Back to Search
        </button>{" "}
        <button
          onClick={() => navigate(`/report-false/${id}`)}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Report as False
        </button>
      </div>
    </div>
  );
};

export default ScamDetailPage;
