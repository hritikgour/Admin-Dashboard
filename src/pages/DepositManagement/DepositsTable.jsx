import React, { useState } from "react";

const DepositsTable = () => {
  const [rows, setRows] = useState([
    { 
      id: 1, 
      user: "Alice", 
      type: "FD", 
      amount: 50000, 
      status: "Pending", 
      startDate: "2025-01-01", 
      dueDate: "2025-12-31" 
    },
    { 
      id: 2, 
      user: "Bob", 
      type: "RD", 
      amount: 10000, 
      status: "Pending", 
      startDate: "2025-02-01", 
      dueDate: "2026-02-01" 
    },
  ]);

  const [notification, setNotification] = useState("");

  const showMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const handleApprove = (id) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "Approved" } : row
      )
    );
    showMessage("✅ Request approved successfully");
  };

  const handleReject = (id) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "Rejected" } : row
      )
    );
    showMessage("❌ Request rejected");
  };

  const handleInterest = (id) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    // Calculate duration in years
    const start = new Date(row.startDate);
    const end = new Date(row.dueDate);
    const durationYears = (end - start) / (1000 * 60 * 60 * 24 * 365);

    // Simple Interest formula: (P × R × T) / 100
    const rate = 6; // 6% annual
    const interest = ((row.amount * rate * durationYears) / 100).toFixed(2);

    showMessage(`💰 Interest for ${row.user}: ₹${interest}`);
  };

  return (
    <div>
      <h2>Deposit Applications</h2>
      {notification && <div className="notification">{notification}</div>}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.user}</td>
              <td>{row.type}</td>
              <td>{row.amount}</td>
              <td>{row.startDate}</td>
              <td>{row.dueDate}</td>
              <td>{row.status}</td>
              <td className="action-buttons">
                {row.status === "Pending" && (
                  <>
                    <button className="approve" onClick={() => handleApprove(row.id)}>Approve</button>
                    <button className="reject" onClick={() => handleReject(row.id)}>Reject</button>
                  </>
                )}
                {row.status === "Approved" && (
                  <>
                    <button className="interest" onClick={() => handleInterest(row.id)}>Interest</button>
                    <button className="reject" onClick={() => handleReject(row.id)}>Reject</button>
                  </>
                )}
                {row.status === "Rejected" && (
                  <button className="interest" onClick={() => handleInterest(row.id)}>Interest</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepositsTable;
