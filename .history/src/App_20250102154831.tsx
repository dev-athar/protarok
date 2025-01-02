// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SubmitScamPage from "./pages/SubmitScamPage";
import ImageUploader from "./pages/ImageUploader";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import SearchPage from "./pages/SearchPage";
import ScamDetailPage from "./pages/ScamDetailPage";
import Navbar from "./pages/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import ReportFalsePage from "./pages/ReportFalsePage";

function App() {
  return (
    <Router>
      <Navbar /> {/* Add Navbar component here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/advanced-search" element={<AdvancedSearchPage />} />
        <Route path="/submit-scam" element={<SubmitScamPage />} />
        <Route path="/test" element={<ImageUploader />} />
        <Route path="/scam-detail/:id" element={<ScamDetailPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/report-false/:id" element={<ReportFalsePage />} />
      </Routes>
    </Router>
  );
}

export default App;
