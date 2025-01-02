// AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import ScamDetailPage from "./ScamDetailPage"; // Importing the ScamDetailPage component

// Set the root element for the modal
Modal.setAppElement("#root");

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
}

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pending_reports")
      .select("*")
      .order("submittedAt", { ascending: false });

    if (error) {
      toast.error("Error fetching reports");
      console.error(error);
    } else {
      setReports(data as Report[]);
    }
    setLoading(false);
  };

  const approveReport = async (reportId: string) => {
    // Fetch the report data
    const report = reports.find((r) => r.id === reportId);
    if (!report) {
      toast.error("Report not found");
      return;
    }

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
        .eq("id", reportId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Report approved and published");
      fetchPendingReports();
      closeModal();
    } catch (error) {
      toast.error("Error approving report");
      console.error(error);
    }
  };

  const rejectReport = async (reportId: string) => {
    try {
      // Delete from pending_reports
      const { error } = await supabase
        .from("pending_reports")
        .delete()
        .eq("id", reportId);

      if (error) {
        throw error;
      }

      toast.success("Report rejected and removed");
      fetchPendingReports();
      closeModal();
    } catch (error) {
      toast.error("Error rejecting report");
      console.error(error);
    }
  };

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setModalIsOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <p className="text-lg text-gray-700 mt-2">
          Review and approve scam reports
        </p>
      </header>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        {reports.length === 0 ? (
          <p className="text-gray-700">No pending reports.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Profile Name</th>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Submitted At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="px-4 py-2">{report.scamProfileName}</td>
                  <td className="px-4 py-2">{report.platform}</td>
                  <td className="px-4 py-2">{report.scamAmount} TK</td>
                  <td className="px-4 py-2">
                    {new Date(report.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => openModal(report)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => approveReport(report.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectReport(report.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Detailed View */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Report Details"
        className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {selectedReport && (
          <ScamDetailPage report={selectedReport} closeModal={closeModal} />
        )}
        {/* Passing report and closeModal to ScamDetailPage */}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
