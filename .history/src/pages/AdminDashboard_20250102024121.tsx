// AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import AdminScamDetailPage from "./AdminScamDetailPage";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";

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
    const report = reports.find((r) => r.id === reportId);
    if (!report) {
      toast.error("Report not found");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("public_reports")
        .insert([
          {
            ...report,
            approvedBy: supabase.auth.user()?.id,
            approvedAt: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

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

  const columns: GridColDef[] = [
    { field: "scamProfileName", headerName: "Profile Name", width: 180 },
    { field: "platform", headerName: "Platform", width: 150 },
    {
      field: "scamAmount",
      headerName: "Amount",
      width: 120,
      valueFormatter: (params: GridRenderCellParams) => `${params.value} TK`,
    },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      width: 180,
      valueFormatter: (params: GridRenderCellParams) =>
        new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params: GridRenderCellParams) => {
        const reportId = params.row.id;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => openModal(params.row)}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => approveReport(reportId)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => rejectReport(reportId)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

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

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {reports.length === 0 ? (
          <p className="text-gray-700">No pending reports.</p>
        ) : (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={reports}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
            />
          </div>
        )}
      </div>

      {/* Modal for Detailed View */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Report Details"
        className="w-[90vw] md:w-[80vw] max-w-5xl mx-auto my-8 bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        {selectedReport && (
          <AdminScamDetailPage
            report={selectedReport}
            closeModal={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
