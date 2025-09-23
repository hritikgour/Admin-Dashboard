// src/components/TopNavbar.jsx
import React from "react";
import { Bell, User } from "lucide-react";
import logo from "../assets/logo.png";
import "./TopNavbar.css";

export default function TopNavbar() {
  return (
    <div className="top-navbar">
      {/* Left: logo + search */}
      <div className="top-left">
        <img src={logo} alt="NeoBank Logo" className="top-logo" />
        <h1 className="logo-text">NeoBank Admin</h1>
        <input
          type="text"
          placeholder="Search User or Transaction..."
          className="top-search"
        />
      </div>

      {/* Right: notifications + profile */}
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
