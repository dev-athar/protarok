// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
// import SubmitScamPage from "./pages/SubmitScamPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element/>={<SearchResultsPage />} />
        {/* <Route path="/submit-scam" element={<SubmitScamPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
