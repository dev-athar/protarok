import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";
import ImageSection from "./ImageSection";

const ScamDetailPage = () => {
  const { id } = useParams();
  const [scamDetails, setScamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Add this state

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
        // Parse additionalEvidence if it's a string
        if (typeof data.additionalEvidence === "string") {
          try {
            data.additionalEvidence = JSON.parse(data.additionalEvidence);
          } catch (parseError) {
            console.error("Error parsing additionalEvidence:", parseError);
            data.additionalEvidence = [];
          }
        } else if (typeof data.proof === "string") {
          try {
            data.proof = JSON.parse(data.proof);
          } catch (parseError) {
            console.error("Error parsing additionalEvidence:", parseError);
            data.proof = [];
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
        <div className="border rounded-md p-4 bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 flex items-center">
            Scammer Profile Name
            <button
              className="ml-2 text-gray text-xs"
              title="Current status of the scam report, such as 'Pending' or 'Resolved'."
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
              title="The platform where the scam occurred, such as social media or e-commerce."
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
              title="The payment platform used for the transaction, such as PayPal or mobile banking."
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
            Victim Contact Info
            <button
              className="ml-2 text-gray text-xs"
              title="Contact information of the victim who reported the scam."
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
            {scamDetails.victimContactInfo}
          </p>
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
        <ImageSection images={data.proof} type="Proof" />{" "}
        {/* Use the component */}
        <ImageSection
          images={data.additionalEvidence}
          type="Additional Evidence"
        />{" "}
        {/* Use the component */}
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => window.history.back()}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
};

export default ScamDetailPage;
