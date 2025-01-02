// AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import AdminScamDetailPage from "./AdminScamDetailPage";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";

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
      .order("submittedAt", { ascending: true });

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
      // Insert into public_reports without victimContactInfo
      const { error: insertError } = await supabase
        .from("public_reports")
        .insert([
          {
            id: report.id,
            scamProfileName: report.scamProfileName,
            platform: report.platform,
            bankDetails: report.bankDetails,
            paymentPlatform: report.paymentPlatform,
            scamAmount: report.scamAmount,
            dateOfScam: report.dateOfScam,
            description: report.description,
            proof: report.proof,
            additionalEvidence: report.additionalEvidence,
            scamProfileUrl: report.scamProfileUrl,
            submittedAt: report.submittedAt,
            approvedAt: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      // Update the status field in pending_reports
      const { error: updateError } = await supabase
        .from("pending_reports")
        .update({ status: "approved" })
        .eq("id", reportId);

      if (updateError) {
        throw updateError;
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
      // Show loading toast
      toast.loading("Processing request...");
      // Retrieve the report to get the file URLs
      const { data: report, error: fetchError } = await supabase
        .from("pending_reports")
        .select("proof, additionalEvidence")
        .eq("id", reportId)
        .single();

      if (fetchError || !report) {
        toast.error("Error fetching report details.");
        console.error(fetchError);
        return;
      }

      // Extract file URLs
      const fileUrls = [...report.proof, ...report.additionalEvidence];

      // Delete files from Cloudinary
      if (fileUrls.length > 0) {
        try {
          // Extract public IDs from URLs
          const publicIds = fileUrls.map((url) => {
            const parts = url.split("/");
            const publicIdWithExtension = parts[parts.length - 1];
            return publicIdWithExtension.split(".")[0]; // Remove the file extension
          });

          // Call your backend or Cloudinary API to delete the files
          const response = await axios.post("/api/delete-files", { publicIds });

          if (response.status !== 200) {
            throw new Error("Cloudinary file deletion failed.");
          }
        } catch (cloudinaryError) {
          console.error("Error deleting Cloudinary files:", cloudinaryError);
          toast.error("Error deleting files from Cloudinary.");
          return;
        }
      }

      // Delete the report from the database
      const { error } = await supabase
        .from("pending_reports")
        .delete()
        .eq("id", reportId);

      if (error) {
        throw error;
      }
      toast.dismiss(); // Dismiss the loading toast
      toast.success("Report rejected and removed.");
      fetchPendingReports();
      closeModal();
    } catch (error) {
      toast.error("Error rejecting report.");
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

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: "scamProfileName",
      headerName: "Profile Name",
      flex: 1,
      minWidth: 150,
    },
    { field: "platform", headerName: "Platform", flex: 1, minWidth: 120 },
    {
      field: "scamAmount",
      headerName: "Amount (TK)",
      type: "number",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              params.value === "approved"
                ? "#d4edda"
                : params.value === "false"
                ? "#f8d7da"
                : "#fff3cd",
            color:
              params.value === "approved"
                ? "#155724"
                : params.value === "false"
                ? "#721c24"
                : "#856404",
          }}
        >
          {params.value || "Pending"}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
      minWidth: 300,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex space-x-2">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => openModal(params.row as Report)}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => approveReport(params.row.id)}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => rejectReport(params.row.id)}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
        <p className="text-lg text-gray-700 mt-2">
          Review and approve scam reports
        </p>
      </header>

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
        {reports.length === 0 ? (
          <p className="text-gray-700">No pending reports.</p>
        ) : (
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={reports}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              loading={loading}
              getRowId={(row) => row.id}
              autoHeight
              disableSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": {
                  outline: "none",
                },
              }}
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
