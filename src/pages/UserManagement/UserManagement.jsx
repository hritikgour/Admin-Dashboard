// src/pages/UserManagement.jsx
import React, { useState } from "react";
import "./UserManagement.css";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy users data
  const users = [
    {
      id: 1,
      name: "Rohit Sharma",
      email: "rohit@example.com",
      phone: "9876543210",
      account: "AC12345678",
      kyc: "Verified",
      lastLogin: "2025-09-10",
    },
    {
      id: 2,
      name: "Anjali Mehta",
      email: "anjali@example.com",
      phone: "9123456780",
      account: "AC87654321",
      kyc: "Pending",
      lastLogin: "2025-09-12",
    },
  ];

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.account.includes(search) ||
      u.kyc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, phone, account, KYC..."
        className="user-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="user-container">
        {/* User Directory */}
        <div className="user-directory">
          <h3>User Directory</h3>
          <ul>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className={`user-item ${
                    selectedUser?.id === user.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="user-name">{user.name}</span>
                  <span className="user-kyc">{user.kyc}</span>
                </li>
              ))
            ) : (
              <p className="no-user">No users found</p>
            )}
          </ul>
        </div>

        {/* User Profile View */}
        <div className="user-profile">
          {selectedUser ? (
            <>
              <h3>User Profile</h3>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Account:</strong> {selectedUser.account}</p>
              <p><strong>KYC Status:</strong> {selectedUser.kyc}</p>
              <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>

              {/* Actions */}
              <div className="user-actions">
                <button className="btn danger">Deactivate</button>
                <button className="btn warning">Freeze Account</button>
                <button className="btn">Impersonate</button>
                <button className="btn">Reset Password</button>
                <button className="btn success">Export Data</button>
              </div>
            </>
          ) : (
            <p className="no-user">Select a user to view profile</p>
          )}
        </div>
      </div>
    </div>
  );
}
