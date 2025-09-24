import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import UserManagement from "./pages/UserManagement/UserManagement";
import ComplaintsLayout from "./pages/Complaints&Support/components/ComplaintsLayout";

function Dashboard() { return <h1>Dashboard Content</h1>; }
function KYC() { return <h1>KYC Page</h1>; }
function Transactions() { return <h1>Transactions Page</h1>; }
function Loans() { return <h1>Loans Page</h1>; }
function DepositManagement() { return <h1>Deposit Management</h1>; }
function Settings() { return <h1>Settings Page</h1>; }

export default function App() {
  return (
    <Router>
      <TopNavbar />
      <div style={{  }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/DepositManagement" element={<DepositManagement />} />
          <Route path="/complaints" element={<ComplaintsLayout />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}
