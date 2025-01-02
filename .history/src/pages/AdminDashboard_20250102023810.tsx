// AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminScamDetailPage from "./AdminScamDetailPage";
import Modal from "react-modal";

// MUI Imports
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
  makeStyles,
} from "@mui/material";

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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    marginBottom: "20px",
  },
  actions: {
    "& > *": {
      margin: "0 4px",
    },
  },
});

const AdminDashboard: React.FC = () => {
  const classes = useStyles();
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
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
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

      <Paper className="max-w-6xl mx-auto p-6 rounded-lg shadow-lg">
        <Toolbar>
          <Typography variant="h6" component="div" className={classes.header}>
            Pending Scam Reports
          </Typography>
        </Toolbar>
        {reports.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No pending reports.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="admin dashboard table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Profile Name</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Amount (TK)</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>{report.scamProfileName}</TableCell>
                    <TableCell>{report.platform}</TableCell>
                    <TableCell>{report.scamAmount}</TableCell>
                    <TableCell>
                      {new Date(report.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.actions}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => openModal(report)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => approveReport(report.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => rejectReport(report.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

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
