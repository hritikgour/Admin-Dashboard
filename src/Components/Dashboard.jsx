// src/Components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
{/* Header */}
      <div
        className="py-4 text-center shadow-sm"
        style={{ backgroundColor: "#960603" }}
      >
        <h1 className="fw-bold fs-2 text-white"> Welcome, Khushavant Wagh! Let’s make today amazing.</h1>
        
      </div>


      <div className="dashboard">
      
        <p className="dashboard-sub">
          Welcome back! Here's an overview of your{" "}
          <span className="highlight">Neo-Bank</span> operations.
        </p>

        {/* Top Stats */}
        <div className="stats-grid">
          <div
            className="stat-card clickable"
            onClick={() => navigate("/users")}
          >
            <h3>Active Users</h3>
            <p className="stat-value">24,531</p>
            <span className="stat-change">+12% from last month</span>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => navigate("/kyc")}
          >
            <h3>Pending KYCs</h3>
            <p className="stat-value">147</p>
            <span className="stat-change">+5 since yesterday</span>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => navigate("/transactions")}
          >
            <h3>Daily Transactions</h3>
            <p className="stat-value">$2.4M</p>
            <span className="stat-change">+8.2% from yesterday</span>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-header">
              <h3>KYC Approvals</h3>
              <span className="badge">147 pending</span>
            </div>
            <p>Review and approve pending user verifications</p>
            <button
              className="action-btn"
              onClick={() => navigate("/kyc")}
            >
              Review KYCs
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <h3>Transaction Reviews</h3>
              <span className="badge">23 pending</span>
            </div>
            <p>Check flagged high-value transactions</p>
            <button
              className="action-btn"
              onClick={() => navigate("/transactions")}
            >
              Review Transactions
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <h3>Loan Applications</h3>
              <span className="badge">56 pending</span>
            </div>
            <p>Process new loan requests and approvals</p>
            <button
              className="action-btn"
              onClick={() => navigate("/loans")}
            >
              Review Loans
            </button>
          </div>
        </div>

        {/* Transactions + Alerts */}
        <div className="bottom-grid">
          <div className="recent-transactions">
            <h2 className="section-title">Recent Transactions</h2>
            <p className="section-sub">
              Latest high-value transactions requiring attention
            </p>
            <ul className="transaction-list">
              <li>
                <strong>TXN001</strong>{" "}
                <span className="tag pending">pending</span>
                <p>Alice Johnson</p>
                <span className="amount">$50,000</span>
                <span className="time">2 min ago</span>
              </li>
              <li>
                <strong>TXN002</strong>{" "}
                <span className="tag flagged">flagged</span>
                <p>Bob Smith</p>
                <span className="amount">$25,000</span>
                <span className="time">5 min ago</span>
              </li>
              <li>
                <strong>TXN003</strong>{" "}
                <span className="tag approved">approved</span>
                <p>Carol Davis</p>
                <span className="amount">$15,000</span>
                <span className="time">12 min ago</span>
              </li>
            </ul>
            <button
              className="view-all"
              onClick={() => navigate("/transactions")}
            >
              View All Transactions
            </button>
          </div>

          <div className="system-alerts">
            <h2 className="section-title">System Alerts</h2>
            <p className="section-sub">Critical notifications and system status</p>
            <ul className="alert-list">
              <li>
                <span className="dot red"></span>
                AML compliance check failed for <strong>3 users</strong>
                <span className="time">10 min ago</span>
                <button
                  className="alert-btn"
                  onClick={() => navigate("/users")}
                >
                  Review Now
                </button>
              </li>
              <li>
                <span className="dot orange"></span>
                High transaction volume detected
                <span className="time">25 min ago</span>
                <button
                  className="alert-btn"
                  onClick={() => navigate("/transactions")}
                >
                  Monitor
                </button>
              </li>
              <li>
                <span className="dot green"></span>
                Daily backup completed successfully
                <span className="time">1 hour ago</span>
                <button
                  className="alert-btn"
                  onClick={() => navigate("/reports")}
                >
                  View Report
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}