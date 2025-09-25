// src/components/TopNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Bell, LayoutDashboard, Users, FileText, CreditCard,
  Wallet, DollarSign, HelpCircle, Settings, User,BarChart
} from "lucide-react";
import logo from "../assets/logo.png";




const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "KYC", url: "/kyc", icon: FileText },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Deposit Management", url: "/DepositManagement", icon: Wallet },
  { title: "Loans", url: "/loans", icon: DollarSign },
 { title: "Investment products", url: "/investment_products", icon: BarChart },

  { title: "Complaints & Support", url: "/complaints", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function TopNavbar() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef();

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm fixed-top" style={{ zIndex: 1050 }}>
        <div className="container-fluid">
          {/* ✅ Logo + Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src={logo} alt="NeoBank Logo" style={{ height: "32px" }} />
            <span className="fw-bold fs-4 text-uppercase" style={{ color: "#950606" }}>
              NeoBank Admin
            </span>
          </Link>

          {/* Search */}
          <form className="d-none d-md-flex flex-grow-1 mx-md-3">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "500px", marginLeft: "30px" }}
              placeholder="Search users, transactions..."
            />
          </form>

          {/* Right side */}
          <div className="d-flex align-items-center ms-auto gap-3">
            {/* Notifications */}
            <button className="btn position-relative">
              <Bell size={22} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="d-flex align-items-center position-relative" ref={profileRef}>
              <button
                className="btn border-0 bg-transparent"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <User size={22} className="text-secondary" />
              </button>

              {profileMenuOpen && (
                <div
                  className="position-absolute end-0 mt-2 py-2 bg-white shadow rounded"
                  style={{ minWidth: "150px", zIndex: 10000 }}
                >
                  <Link to="/profile" className="dropdown-item px-3 py-2 text-dark hover-effect">
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item px-3 py-2 text-dark hover-effect">
                    Settings
                  </Link>
                  <Link to="/logout" className="dropdown-item px-3 py-2 text-dark hover-effect">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Horizontal Menu (same for mobile + desktop) */}
      <div
        className="bg-light shadow-sm border-bottom"
        style={{ marginTop: "70px" }}
      >
        <div
          className="container-fluid d-flex flex-nowrap gap-2 py-2 overflow-x-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-1 px-3 py-2 rounded fw-semibold text-decoration-none nav-hover ${
                    isActive ? "bg-danger text-white" : "text-dark"
                  }`
                }
              >
                <Icon size={18} />
                <span className="d-none d-sm-inline">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Hover effect */}
      <style>
        {`
          .nav-hover:hover, .hover-effect:hover {
            background-color: #900603 !important;
            color: white !important;
            transition: all 0.3s ease;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
          }
          .container-fluid::-webkit-scrollbar {
            height: 6px;
          }
          .container-fluid::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  );
}
