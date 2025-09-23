// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HorizontalNav from "./Components/HorizontalNav";
import TopNavbar from "./Components/TopNavbar";
import KYCComplianceRoutes from "./pages/KYC_Compliance";
import Investment from "./pages/Investment_products/components/InvestmentPanel";
import InvestmentPanel from "./pages/Investment_products/components/InvestmentPanel";


function Dashboard() { return <h1>Dashboard Content</h1>; }
function Users() { return <h1>Users Page</h1>; }
function Transactions() { return <h1>Transactions Page</h1>; }
function Loans() { return <h1>Loans Page</h1>; }
function Support() { return <h1>Support Page</h1>; }
function Reports() { return <h1>Reports Page</h1>; }
function Settings() { return <h1>Settings Page</h1>; }

export default function App() {
  return (
    <Router>
       <TopNavbar />
      <HorizontalNav />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/kyc/*" element={<KYCComplianceRoutes />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/support" element={<Support />} z/>
           <Route path="/investment_products" element={<InvestmentPanel />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}
