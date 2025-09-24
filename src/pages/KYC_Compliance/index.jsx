import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ReviewKYC from "./ReviewKYC";
import ReviewTransactions from "./ReviewTransactions";
import ViewAlerts from "./ViewAlerts";
import Transactions from "./Transactions";

export default function KYCComplianceRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="review-kyc" element={<ReviewKYC />} />
      <Route path="review-transactions" element={<ReviewTransactions />} />
      <Route path="view-alerts" element={<ViewAlerts />} />
      <Route path="transactions" element={<Transactions />} />
    </Routes>
  );
}
