// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SubmitScamPage from "./pages/SubmitScamPage";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import SearchPage from "./pages/SearchPage";
import ScamDetailPage from "./pages/ScamDetailPage";
import Navbar from "./components/Navbar";
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
        <Route path="/scam-detail/:id" element={<ScamDetailPage />} />
        <Route path="/report-false/:id" element={<ReportFalsePage />} />
      </Routes>
    </Router>
  );
}

export default App;
