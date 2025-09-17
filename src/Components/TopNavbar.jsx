// src/Components/TopNavbar.jsx
import React from "react";
import { Bell, User } from "lucide-react";
import "./TopNavbar.css";

export default function TopNavbar() {
  return (
    <div className="top-navbar">
      {/* Left: Logo + Search */}
      <div className="top-left">
        <h1 className="logo">NeoBank Admin</h1>
        <input
          type="text"
          placeholder="Search User or Transaction..."
          className="top-search"
        />
      </div>

      {/* Right: Notification + Profile */}
      <div className="top-right">
        <Bell className="top-icon" />
        <div className="admin-profile">
          <User className="profile-icon" />
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
}
