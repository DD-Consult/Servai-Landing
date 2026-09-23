import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ServAIHome from "@/components/ServAIHome";
import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";
import TermsOfServicePage from "@/components/TermsOfServicePage";
import DataDeletionPage from "@/components/DataDeletionPage";

// Shared nav links used by SiteHeader / SiteFooter
export const navLinks = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'features',     label: 'Features' },
  { id: 'impact',       label: 'Impact' },
];

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServAIHome />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsOfServicePage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
