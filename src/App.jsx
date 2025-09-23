// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HorizontalNav from "./Components/HorizontalNav";
import TopNavbar from "./Components/TopNavbar";
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";
import SplashScreen from "./Components/SplashScreen"; 
import Card from "./Components/Card";   // ✅ Import the real Card component

// placeholder pages
function Users() { return <h1>Users Page</h1>; }
function KYC() { return <h1>KYC Page</h1>; }
function Transactions() { return <h1>Transactions Page</h1>; }
function Loans() { return <h1>Loans Page</h1>; }
function Support() { return <h1>Support Page</h1>; }
function Reports() { return <h1>Reports Page</h1>; }
function Settings() { return <h1>Settings Page</h1>; }

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <TopNavbar />
      <HorizontalNav />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/card" element={<Card />} />   {/* ✅ Shows card form */}
          <Route path="/support" element={<Support />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
