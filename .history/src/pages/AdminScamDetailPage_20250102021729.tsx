// ScamDetailPage.tsx
import React, { useState } from "react";
import ImageSection from "./ImageSection";
import { supabase } from "../supabase";
import { toast } from "react-toastify";

interface Report {
  id: string;
  scamProfileName: string;
  platform: string;
  bankDetails: string;
  paymentPlatform?: string;
  scamAmount: number;
  dateOfScam: string;
  description: string;
  proof: string[];
  additionalEvidence: string[];
  victimContactInfo?: string;
  scamProfileUrl?: string;
  reportStatus?: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface ScamDetailPageProps {
  report: Report;
  closeModal: () => void;
}

const AdminScamDetailPage: React.FC<ScamDetailPageProps> = ({
  report,
  closeModal,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    } as const;
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const approveReport = async () => {
    setIsProcessing(true);
    try {
      // Insert into public_reports
      const { error: insertError } = await supabase
        .from("public_reports")
        .insert([
          {
            ...report,
            approvedBy: supabase.auth.user()?.id, // Assuming admin is authenticated
            approvedAt: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      // Delete from pending_reports
      const { error: deleteError } = await supabase
        .from("pending_reports")
        .delete()
        .eq("id", report.id);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Report approved and published");
      closeModal();
    } catch (error) {
      toast.error("Error approving report");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectReport = async () => {
    setIsProcessing(true);
    try {
      // Delete from pending_reports
      const { error } = await supabase
        .from("pending_reports")
        .delete()
        .eq("id", report.id);

      if (error) {
        throw error;
      }

      toast.success("Report rejected and removed");
      closeModal();
    } catch (error) {
      toast.error("Error rejecting report");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-h-[80vh] max-w-6xl mx-auto overflow-y-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Report Details</h1>
      </header>

      <div className="grid gap-6 bg-gray-50 p-4 rounded-md shadow-md">
        {/* Repeat the existing report detail sections */}
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
          <p className="text-lg text-gray-800">{report.scamProfileName}</p>
        </div>
        {/* Repeat similar sections for all other fields */}
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
          <p className="text-lg text-gray-800">{report.platform}</p>
        </div>
        {/* Add other sections similarly */}
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
          <p className="text-lg text-gray-800">{report.bankDetails}</p>
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
          <p className="text-lg text-gray-800">{report.paymentPlatform}</p>
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
          <p className="text-lg text-gray-800">Tk {report.scamAmount}</p>
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
            {formatDate(report.dateOfScam)}
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
          <p className="text-lg text-gray-800">{report.description}</p>
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
          <p className="text-lg text-gray-800">{report.victimContactInfo}</p>
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
            href={report.scamProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {report.scamProfileUrl}
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
          <p className="text-lg text-gray-800">{report.reportStatus}</p>
        </div>
        <ImageSection images={report.proof} type="Proof" />
        <ImageSection
          images={report.additionalEvidence}
          type="Additional Evidence"
        />
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={rejectReport}
          disabled={isProcessing}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Reject Report"}
        </button>
        <button
          onClick={approveReport}
          disabled={isProcessing}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Approve Report"}
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminScamDetailPage;
