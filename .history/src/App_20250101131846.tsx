// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SubmitScamPage from "./pages/SubmitScamPage";
import ImageUploader from "./pages/ImageUploader";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search" element={<AdvancedSearchPage />} />
        <Route path="/submit-scam" element={<SubmitScamPage />} />
        <Route path="/test" element={<ImageUploader />} />
      </Routes>
    </Router>
  );
}

export default App;
