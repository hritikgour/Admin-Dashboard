// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Common imports
import TopNavbar from "./components/TopNavbar";
import UserManagement from "./pages/UserManagement/UserManagement";
import ComplaintsLayout from "./pages/Complaints&Support/components/ComplaintsLayout";

// ✅ From khush_Dashboard branch
import HorizontalNav from "./Components/HorizontalNav";
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";
import SplashScreen from "./Components/SplashScreen";
import Card from "./Components/Card";

// ✅ Placeholder pages
function KYC() { return <h1>KYC Page</h1>; }
function Transactions() { return <h1>Transactions Page</h1>; }
function Loans() { return <h1>Loans Page</h1>; }
function DepositManagement() { return <h1>Deposit Management</h1>; }
function Settings() { return <h1>Settings Page</h1>; }
function Support() { return <h1>Support Page</h1>; }
function Reports() { return <h1>Reports Page</h1>; }

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <TopNavbar />
      <HorizontalNav />
      
      <div style={{ padding: "20px", marginTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/DepositManagement" element={<DepositManagement />} />
          <Route path="/complaints" element={<ComplaintsLayout />} />
          <Route path="/card" element={<Card />} />
          <Route path="/support" element={<Support />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}
