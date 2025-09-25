import React, { useState } from "react";

const EarlyWithdrawalsTable = () => {
  const [rows, setRows] = useState([
    { id: 201, user: "Eve", type: "FD", amount: 20000, penalty: 500, status: "Pending" },
    { id: 202, user: "Frank", type: "RD", amount: 8000, penalty: 200, status: "Pending" },
  ]);
  const [notification, setNotification] = useState("");

  const showMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleApprove = (id) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: "Approved" } : row))
    );
    showMessage("✅ Early withdrawal approved");
  };

  const handleReject = (id) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: "Rejected" } : row))
    );
    showMessage("❌ Early withdrawal rejected");
  };

  return (
    <div>
      {/* <h2>Early Withdrawal Requests</h2> */}
      {notification && <div className="notification">{notification}</div>}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Penalty</th>
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
              <td>{row.penalty}</td>
              <td>{row.status}</td>
              <td className="action-buttons">
                <button className="approve" onClick={() => handleApprove(row.id)}>Approve</button>
                <button className="reject" onClick={() => handleReject(row.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarlyWithdrawalsTable;
