import React, { useState } from "react";
import "./AdminDeposits.css";

const AdminDeposits = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [notification, setNotification] = useState("");
  const [modalData, setModalData] = useState(null); // For interest modal

  const [applications, setApplications] = useState([
    { id: 1, user: "Alice", type: "FD", amount: 50000, status: "Pending", startDate: "2025-01-01", dueDate: "2025-12-31", interest: "-" },
    { id: 2, user: "Bob", type: "RD", amount: 10000, status: "Pending", startDate: "2025-02-01", dueDate: "2026-02-01", interest: "-" },
  ]);

  const [maturities, setMaturities] = useState([
    { id: 3, user: "Charlie", type: "FD", amount: 70000, status: "Pending", startDate: "2024-01-01", dueDate: "2025-01-01", interest: "-" },
  ]);

  const [earlyWithdrawals, setEarlyWithdrawals] = useState([
    { id: 4, user: "Diana", type: "RD", amount: 30000, status: "Pending", startDate: "2025-03-01", dueDate: "2026-03-01", interest: "-" },
  ]);

  const showMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const calculateInterest = (amount, startDate, dueDate) => {
    const start = new Date(startDate);
    const end = new Date(dueDate);
    const durationYears = (end - start) / (1000 * 60 * 60 * 24 * 365);
    const rate = 6;
    return ((amount * rate * durationYears) / 100).toFixed(2);
  };

  // Open modal to adjust interest before approval
  const openInterestModal = (row, setRows, action) => {
    const interest = calculateInterest(row.amount, row.startDate, row.dueDate);
    setModalData({ row, setRows, action, interest });
  };

  const handleModalSave = () => {
    const { row, setRows, action, interest } = modalData;
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? { ...r, status: action, interest: interest }
          : r
      )
    );
    showMessage(`✅ Request ${action} successfully`);
    setModalData(null);
  };

  const handleGenerateInstrument = (row) => {
    showMessage(`📄 Instrument generated for ${row.user}`);
    // Here you can call backend or generate PDF using jsPDF
  };

  const renderTable = (rows, setRows, title) => (
    <section className="table-card">
      <h2>{title}</h2>
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
            <th>Interest</th>
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
              <td>
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </td>
              <td>{row.interest}</td>
              <td className="action-buttons">
                <button
                  className="approve"
                  onClick={() => openInterestModal(row, setRows, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="reject"
                  onClick={() => openInterestModal(row, setRows, "Rejected")}
                >
                  Reject
                </button>
                {row.status === "Approved" && (
                  <button
                    className="interest"
                    onClick={() => handleGenerateInstrument(row)}
                  >
                    Generate Instrument
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <div className="admin-deposits">
      <h1>Deposits Management</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "applications" ? "active" : ""}
          onClick={() => setActiveTab("applications")}
        >
          Deposit Applications
        </button>
        <button
          className={activeTab === "maturities" ? "active" : ""}
          onClick={() => setActiveTab("maturities")}
        >
          Maturities
        </button>
        <button
          className={activeTab === "withdrawals" ? "active" : ""}
          onClick={() => setActiveTab("withdrawals")}
        >
          Early Withdrawal Requests
        </button>
      </div>

      {/* Table Content */}
      {activeTab === "applications" &&
        renderTable(applications, setApplications, "Deposit Applications")}
      {activeTab === "maturities" &&
        renderTable(maturities, setMaturities, "Maturities")}
      {activeTab === "withdrawals" &&
        renderTable(earlyWithdrawals, setEarlyWithdrawals, "Early Withdrawal Requests")}

      {/* Modal for Adjust Interest */}
      {modalData && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Adjust Interest for {modalData.row.user}</h3>
            <input
              type="number"
              value={modalData.interest}
              onChange={(e) =>
                setModalData({ ...modalData, interest: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={() => setModalData(null)}>Cancel</button>
              <button onClick={handleModalSave}>Save & {modalData.action}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposits;
