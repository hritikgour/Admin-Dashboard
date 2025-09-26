// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Common imports
import TopNavbar from "./Components/TopNavbar";


// ✅ From sanket_Accounts_Wallets
import AccountsDashboard from "./pages/AccountsDashboard/AccountsDashboard.jsx";

// ✅ From main branch
import UserManagement from "./pages/UserManagement/UserManagement";
import ComplaintsLayout from "./pages/Complaints&Support/components/ComplaintsLayout";
import InvestmentPanel from "./pages/Investment_products/components/InvestmentPanel";
import KYCComplianceRoutes from "./pages/KYC_Compliance";
import DepositManagement from "./pages/DepositManagement/AdminDeposits";
import Loans from "./pages/Loan/Loans.jsx";
import MoneyTransferRequest from "./pages/MoneyTransferRequests/MoneyTransferRequests"
import Reports from "./pages/Reports/Reports.jsx";

// ✅ From khush_Dashboard branch
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";
import SplashScreen from "./Components/SplashScreen";
import Card from "./Components/Card";

// ✅ Temporary placeholder components (so app won’t crash)
function KYC() {
  return <h1>KYC Page</h1>;
}
function Transactions() {
  return <h1>Transactions Page</h1>;
}

function Support() {
  return <h1>Support Page</h1>;
}
function Settings() {
  return <h1>Settings Page</h1>;
}



export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <TopNavbar />

      {/* Push content below navbar */}
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/kyc/*" element={<KYCComplianceRoutes />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/DepositManagement" element={<DepositManagement />} />
          <Route path="/complaints" element={<ComplaintsLayout />} />
          <Route path="cards" element={<Card />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/AccountsDashboard" element={<AccountsDashboard />} />
          <Route path="/investment_products" element={<InvestmentPanel />} />
          <Route path="/moneyrequest" element={<MoneyTransferRequest />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>

      
    </Router>
  );
}
