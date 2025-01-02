// AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { supabase } from "../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminScamDetailPage from "./AdminScamDetailPage";

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

const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      handleCloseModal();
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
      handleCloseModal();
    } catch (error) {
      toast.error("Error rejecting report");
      console.error(error);
    }
  };

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setModalOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <ToastContainer />
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Review and approve scam reports
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
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
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No pending reports.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.scamProfileName}</TableCell>
                      <TableCell>{report.platform}</TableCell>
                      <TableCell>{report.scamAmount}</TableCell>
                      <TableCell>
                        {new Date(report.submittedAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenModal(report)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => approveReport(report.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => rejectReport(report.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Modal/Dialog for Detailed View */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent dividers>
          {selectedReport && <AdminScamDetailPage report={selectedReport} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
