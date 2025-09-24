// src/components/AppNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Bell, LayoutDashboard, Users, FileText, CreditCard,
  Wallet, DollarSign, HelpCircle, Settings, Menu, User
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "KYC", url: "/kyc", icon: FileText },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Deposit Management", url: "/DepositManagement", icon: Wallet },
  { title: "Loans", url: "/loans", icon: DollarSign },
  { title: "Complaints & Support", url: "/complaints", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function AppNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef();

  useEffect(() => {
    setMobileMenuOpen(false);
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
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <span className="fw-bold fs-4 text-uppercase" style={{ color: "#950606" }}>NeoBank</span>
          </Link>

          <form className="d-none d-md-flex flex-grow-1 mx-md-3">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "500px", marginLeft: "30px" }}
              placeholder="Search users, transactions..."
            />
          </form>

          <div className="d-flex align-items-center ms-auto gap-3">
            <button className="btn position-relative d-none d-lg-block">
              <Bell size={22} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>

            {/* Profile Icon only */}
            <div className="d-none d-lg-flex align-items-center position-relative" ref={profileRef}>
              <button
                className="btn border-0 bg-transparent"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <User size={22} className="text-secondary" />
              </button>

              {profileMenuOpen && (
                <div className="position-absolute end-0 mt-2 py-2 bg-white shadow rounded" style={{ minWidth: "150px", zIndex: 10000 }}>
                  <Link to="/profile" className="dropdown-item px-3 py-2 text-dark hover-effect">Profile</Link>
                  <Link to="/settings" className="dropdown-item px-3 py-2 text-dark hover-effect">Settings</Link>
                  <Link to="/logout" className="dropdown-item px-3 py-2 text-dark hover-effect">Logout</Link>
                </div>
              )}
            </div>

            <button className="btn d-md-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Horizontal Menu */}
      <div className="bg-light shadow-sm border-bottom d-none d-lg-block" style={{ marginTop: "70px" }}>
        <div className="container-fluid d-flex flex-wrap gap-2 py-2">
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
                <span className="d-none d-md-inline">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-lg border-top d-lg-none" style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          zIndex: 9999,
          borderRadius: "0 0 10px 10px",
          overflow: "hidden",
          animation: "slideDown 0.3s ease"
        }}>
          <div className="container-fluid py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-2 px-3 py-2 mb-2 rounded fw-semibold text-decoration-none ${
                      isActive ? "bg-danger text-white" : "text-dark"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

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

          @keyframes slideDown {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}
