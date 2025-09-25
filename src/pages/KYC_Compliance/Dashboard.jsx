import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/NeoBank_Logo_01.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [viewingAlert, setViewingAlert] = useState(null); // AML modal state

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const transactions = [
    { id: "TXN001", type: "High Value", amount: "$30,000", status: "pending" },
    { id: "TXN002", type: "Structuring", amount: "$25,000", status: "flagged" },
    { id: "TXN003", type: "Offshore", amount: "$35,000", status: "pending" },
  ];

  const alerts = [
    { id: 1, text: "AML compliance check failed for 3 users", time: "2 hours ago" },
    { id: 2, text: "High transaction volume detected", time: "4 hours ago" },
    { id: 3, text: "Daily backup completed successfully", time: "6 hours ago" },
  ];

  return (
    <div className="container-fluid p-0">


      {/* Header */}
      <div
       className="py-4 rounded text-white shadow-lg d-flex justify-content-between align-items-center flex-wrap "
        style={{ border: "2px solid #f8e4e4ff", backgroundColor: "#900603" }}
      >
        <div>
          <h5 className="mb-0">
                  
            KYC & Compliance Dashboard</h5>
          <small>Monitor and manage compliance operations</small>
          
        </div>
        <small className="px-2 py-1 rounded"
          style={{ backgroundColor: "#900603", color: "#fff" }}
        >
          ⏱ Last updated: {lastUpdated.toLocaleTimeString()}
        </small>
      </div>

      {/* Summary Cards */}
      <div className="row m-3 g-3">
        <style>
          {`
            .card-hover {
              border: 1px solid #900603 !important;
              transition: all 0.3s ease-in-out;
              background-color: #fff !important;
            }
            .card-hover:hover {
              transform: translateY(-6px) scale(1.02);
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              border-color: #900603 !important;
              background-color: #fff !important;
            }
            .card-hover h6,
            .card-hover h5,
            .card-hover p {
              color: #333 !important;
              transition: color 0.3s ease-in-out;
            }
            .card-hover:hover h6,
            .card-hover:hover h5,
            .card-hover:hover p {
              color: #111 !important;
            }
            .card-hover .btn {
              background-color: #900603 !important;
              color: white !important;
              border: none !important;
              transition: all 0.3s ease-in-out;
            }
            .card-hover .btn:hover {
              background-color: white !important;
              color: #900603 !important;
              border: 1px solid #900603 !important;
            }
          `}
        </style>

        {[
          { title: "KYC Approvals", text: "Pending Review", btn: "Review KYC", route: "review-kyc" },
          { title: "KYC History", text: "History list", btn: "Review History", route: "review-transactions" },
          { title: "System Alerts", text: "Requires Attention", btn: "View Alerts", route: "view-alerts" },
        ].map((item, i) => (
          <div className="col-md-4" key={i}>
            <div className="card shadow-sm text-center card-hover">
              <div className="card-body">
                <h6 className="text-muted">{item.title}</h6>
                <h5 className="fw-bold">0</h5>
                <p className="small text-muted">{item.text}</p>
                <button className="btn btn-sm" onClick={() => navigate(item.route)}>
                  {item.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions + System Alerts */}
      <div className="row m-3 g-3">
        {/* Transactions */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>Recent Transactions</strong>
              <button
                className="btn btn-sm"
                style={{ border: "1px solid #900603", color: "#900603" }}
                onClick={() => navigate("transactions")}
              >
                View All Transactions
              </button>
            </div>
            <div className="card-body">
              {transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 rounded text-dark"
                  style={{ backgroundColor: "#fff7f5ff" }}
                >
                  <div>
                    <strong>{txn.id}</strong> <br />
                    <small>{txn.type}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark">{txn.amount}</span>
                    {txn.status === "pending" ? (
                      <button className="btn btn-dark btn-sm">Monitor</button>
                    ) : (
                      <button className="btn btn-warning btn-sm">Review</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>System Alerts</strong>
              <button
                className="btn btn-sm"
                style={{ border: "1px solid #900603", color: "#900603" }}
                onClick={() => navigate("view-alerts")}
              >
                Review Now
              </button>
            </div>
            <div className="card-body">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                  style={{ backgroundColor: "#fff7f5ff", color: "#380092ff" }}
                >
                  <div>
                    ⚠️ {a.text} <br />
                    <small>{a.time}</small>
                  </div>
                  <button
                    className="btn text-white btn-sm"
                    style={{ backgroundColor: "#900603" }}
                    onClick={() => setViewingAlert(a)}
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AML Modal */}
      {viewingAlert && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                <h5 className="modal-title">AML Alert Details</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setViewingAlert(null)}
                ></button>
              </div>
              <div className="modal-body">
                <h6>{viewingAlert.text}</h6>
                <p><strong>Time:</strong> {viewingAlert.time}</p>
                <hr />
                <p>Here you can show full AML details, transaction list, flagged users, or compliance info.</p>
                {/* You can expand this with your AML component/panel */}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewingAlert(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Overview */}
      <div className="row m-3 g-3">
        <div className="col-md-3">
          <div className="card text-dark text-center shadow-sm"
            style={{ backgroundColor: "#fff7f5ff", border: "1px solid #8B0000" }}
          >
            <div className="card-body fw-bold">8<br />Total Submissions</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-dark text-center shadow-sm"
            style={{ backgroundColor: "#fff7f5ff" , border: "1px solid #8B0000"}}
          >
            <div className="card-body fw-bold">0%<br />Approval Rate</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center text-dark shadow-sm"
            style={{ backgroundColor: "#fff7f5ff", border: "1px solid #8B0000", color: "#fff" }}
          >
            <div className="card-body fw-bold">0<br />Pending Review</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-dark text-center shadow-sm"
            style={{ border: "1px solid #8B0000",backgroundColor: "#fff7f5ff" }}
          >
            <div className="card-body fw-bold">0<br />Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
