// src/Components/Card.jsx
import React, { useState } from "react";
import "./Card.css";

export default function Card() {
  const [activeTab, setActiveTab] = useState("requests");
  const [fraudData, setFraudData] = useState([]);
  const [newFraud, setNewFraud] = useState({
    transactionId: "",
    cardNumber: "",
    amount: "",
    user: "",
    reason: "",
  });
  const [notification, setNotification] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFraud, setEditFraud] = useState({
    transactionId: "",
    cardNumber: "",
    amount: "",
    user: "",
    reason: "",
  });

  // Handle new fraud form submit
  const handleFraudSubmit = (e) => {
    e.preventDefault();
    setFraudData([...fraudData, { ...newFraud, action: "" }]);
    setNewFraud({
      transactionId: "",
      cardNumber: "",
      amount: "",
      user: "",
      reason: "",
    });
  };

  // Handle Mark Safe / Escalate
  const handleFraudAction = (index, actionType) => {
    const updatedData = [...fraudData];
    updatedData[index].action = actionType;
    setFraudData(updatedData);

    const msg =
      actionType === "Safe"
        ? `${updatedData[index].user} is marked as SAFE ✅`
        : `${updatedData[index].user} is NOT safe ❌. Please check details!`;

    setNotification({ type: actionType.toLowerCase(), message: msg });

    setTimeout(() => setNotification(null), 2000);
  };

  // Start editing a row
  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditFraud({ ...fraudData[index] });
  };

  // Save edited row
  const handleSaveEdit = (index) => {
    const updatedData = [...fraudData];
    updatedData[index] = { ...editFraud, action: updatedData[index].action };
    setFraudData(updatedData);
    setEditingIndex(null);

    setNotification({
      type: "safe",
      message: `Record for ${editFraud.user} updated successfully ✅`,
    });
    setTimeout(() => setNotification(null), 2000);
  };

  // Cancel editing
  const handleCancelEdit = () => setEditingIndex(null);

  return (
    <div className="card-container">
      {/* ✅ Updated Card Title */}
      <h2 className="card-title">
        💳 Card Services
      </h2>

      {/* Tabs */}
      <div className="card-tabs">
        <button
          className={activeTab === "requests" ? "active" : ""}
          onClick={() => setActiveTab("requests")}
        >
          Card Requests
        </button>
        <button
          className={activeTab === "management" ? "active" : ""}
          onClick={() => setActiveTab("management")}
        >
          Card Management
        </button>
        <button
          className={activeTab === "fraud" ? "active" : ""}
          onClick={() => setActiveTab("fraud")}
        >
          Fraud Flags
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`notification ${
            notification.type === "safe" ? "safe" : "escalate"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Requests Section */}
      {activeTab === "requests" && (
        <form className="card-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Account Number</label>
            <input type="text" placeholder="Enter your account number" required />
          </div>
          <div className="form-group">
            <label>PAN Number</label>
            <input type="text" placeholder="Enter your PAN number" required />
          </div>
          <div className="form-group">
            <label>Request Type</label>
            <select required>
              <option value="new">New Card Issuance</option>
              <option value="virtual">Virtual Card Creation</option>
            </select>
          </div>
          <button type="submit" className="btn-submit">
            Submit Request
          </button>
        </form>
      )}

      {/* Management Section */}
      {activeTab === "management" && (
        <form className="card-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="Enter your card number" required />
          </div>
          <div className="form-group">
            <label>Action</label>
            <select required>
              <option value="block">Block / Unblock Card</option>
              <option value="limit">Change Transaction Limit</option>
              <option value="replace">Replace Card</option>
              <option value="setlimit">Set New Card Limit</option>
            </select>
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea placeholder="Enter additional details"></textarea>
          </div>
          <button type="submit" className="btn-submit">
            Submit Action
          </button>
        </form>
      )}

      {/* Fraud Section */}
      {activeTab === "fraud" && (
        <div className="fraud-section">
          <h3>🚨 Fraud Flags</h3>

          {/* Fraud Table */}
          <table className="fraud-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Card Number</th>
                <th>Amount</th>
                <th>User</th>
                <th>Reason</th>
                <th>Action</th>
                <th>Action Performed</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {fraudData.map((row, index) => (
                <tr key={index} className={editingIndex === index ? "editing" : ""}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editFraud.transactionId}
                        onChange={(e) =>
                          setEditFraud({ ...editFraud, transactionId: e.target.value })
                        }
                      />
                    ) : (
                      row.transactionId
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editFraud.cardNumber}
                        onChange={(e) =>
                          setEditFraud({ ...editFraud, cardNumber: e.target.value })
                        }
                      />
                    ) : (
                      row.cardNumber
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editFraud.amount}
                        onChange={(e) =>
                          setEditFraud({ ...editFraud, amount: e.target.value })
                        }
                      />
                    ) : (
                      `₹${row.amount}`
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editFraud.user}
                        onChange={(e) =>
                          setEditFraud({ ...editFraud, user: e.target.value })
                        }
                      />
                    ) : (
                      row.user
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editFraud.reason}
                        onChange={(e) =>
                          setEditFraud({ ...editFraud, reason: e.target.value })
                        }
                      />
                    ) : (
                      row.reason
                    )}
                  </td>
                  <td>
                    <button
                      className="fraud-btn safe"
                      onClick={() => handleFraudAction(index, "Safe")}
                    >
                      Mark Safe
                    </button>
                    <button
                      className="fraud-btn escalate"
                      onClick={() => handleFraudAction(index, "Escalated")}
                    >
                      Escalate
                    </button>
                  </td>
                  <td className={row.action === "Safe" ? "safe-status" : "escalate-status"}>
                    {row.action || "—"}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <>
                        <button className="fraud-btn save" onClick={() => handleSaveEdit(index)}>
                          Save
                        </button>
                        <button className="fraud-btn cancel" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="fraud-btn" onClick={() => handleEditClick(index)}>
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add New Fraud Entry */}
          <h4 className="fraud-form-title">➕ Add Suspicious Transaction</h4>
          <form className="fraud-form" onSubmit={handleFraudSubmit}>
            <input
              type="text"
              placeholder="Transaction ID"
              value={newFraud.transactionId}
              onChange={(e) => setNewFraud({ ...newFraud, transactionId: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Card Number"
              value={newFraud.cardNumber}
              onChange={(e) => setNewFraud({ ...newFraud, cardNumber: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newFraud.amount}
              onChange={(e) => setNewFraud({ ...newFraud, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="User"
              value={newFraud.user}
              onChange={(e) => setNewFraud({ ...newFraud, user: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Reason"
              value={newFraud.reason}
              onChange={(e) => setNewFraud({ ...newFraud, reason: e.target.value })}
              required
            />
            <button type="submit" className="btn-submit">
              Add Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}