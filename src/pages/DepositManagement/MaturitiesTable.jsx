import React, { useState } from "react";

const MaturitiesTable = () => {
  const [rows, setRows] = useState([
    { id: 101, user: "Charlie", type: "FD", amount: 75000, maturityDate: "2025-10-01", status: "Pending" },
    { id: 102, user: "Daisy", type: "RD", amount: 15000, maturityDate: "2025-10-05", status: "Pending" },
  ]);
  const [notification, setNotification] = useState("");

  const showMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleClose = (id) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: "Closed" } : row))
    );
    showMessage("📌 Deposit closed successfully");
  };

  const handleRenew = (id) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: "Renewed" } : row))
    );
    showMessage("🔄 Deposit renewed");
  };

  return (
    <div>
      <h2>Maturities</h2>
      {notification && <div className="notification">{notification}</div>}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Maturity Date</th>
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
              <td>{row.maturityDate}</td>
              <td>{row.status}</td>
              <td className="action-buttons">
                <button className="approve" onClick={() => handleRenew(row.id)}>Renew</button>
                <button className="reject" onClick={() => handleClose(row.id)}>Close</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaturitiesTable;
