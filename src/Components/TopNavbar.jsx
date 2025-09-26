import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  CreditCard,
  Send,
  Banknote,
  DollarSign,
  CreditCard as CardIcon,
  BarChart3,
  HelpCircle,
  FileBarChart,
  Settings,
  Bell,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const TopNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ✅ Menu items
  const firstRow = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/" },
    { name: "Users", icon: <Users size={18} />, path: "/users" },
    { name: "KYC", icon: <FileText size={18} />, path: "/kyc" },
    { name: "Accounts & Wallets", icon: <Wallet size={18} />, path: "/accountsdashboard" },
    { name: "Transactions", icon: <CreditCard size={18} />, path: "/transactions" },
    { name: "Money Transfer Request", icon: <Send size={18} />, path: "/moneyrequest" },
    { name: "Deposit Management", icon: <Banknote size={18} />, path: "/depositmanagement" },
    { name: "Loans", icon: <DollarSign size={18} />, path: "/loans" },
    { name: "Cards", icon: <CardIcon size={18} />, path: "/cards" },
  ];

  const secondRow = [
    { name: "Investment Products", icon: <BarChart3 size={18} />, path: "/investment_products" },
    { name: "Complaints & Support", icon: <HelpCircle size={18} />, path: "/complaints" },
    { name: "Reports & Analytics", icon: <FileBarChart size={18} />, path: "/reports" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <>
      {/* 🔝 Top Navbar */}
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          {/* Logo */}
          <Link to="/homepage" className="navbar-brand d-flex align-items-center fw-bold">
            <img
              src={logo}
              alt="NeoBank Logo"
              style={{ height: "40px", width: "40px", objectFit: "contain" }}
            />
            <span
              className="ms-2 fw-bold fs-4 text-uppercase"
              style={{ color: "#950606" }}
            >
              NeoBank
            </span>
          </Link>

          {/* Search bar */}
          <form className="d-none d-md-flex flex-grow-1 mx-md-3">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "500px", marginLeft: "30px" }}
              placeholder="Search users, transactions..."
            />
          </form>

          {/* Right side icons */}
          <div className="d-flex align-items-center ms-auto flex-wrap flex-sm-nowrap">
            <button className="btn position-relative me-3 d-none d-lg-block">
              <Bell size={22} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <div className="d-flex align-items-center">
              <span className="fw-bold me-2">JD</span>
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📌 First Row Navbar (till Cards) */}
      <div className="bg-light shadow-sm border-top mt-3 d-none d-lg-block">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom mt-5">
          <div className="container-fluid">
            <ul
              className="navbar-nav mx-auto flex-nowrap"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                scrollbarWidth: "thin",
              }}
            >
              {firstRow.map((item) => (
                <li className="nav-item d-inline-block" key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-semi-bold px-3 py-2 rounded`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#950606" : "transparent",
                      color: isActive ? "white" : "#333",
                    })}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* 📌 Second Row Navbar (rest modules) */}
      <div className="bg-light shadow-sm border-top d-none d-lg-block">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom">
          <div className="container-fluid">
            <ul
              className="navbar-nav mx-auto flex-nowrap"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                scrollbarWidth: "thin",
              }}
            >
              {secondRow.map((item) => (
                <li className="nav-item d-inline-block" key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-semi-bold px-3 py-2 rounded`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#950606" : "transparent",
                      color: isActive ? "white" : "#333",
                    })}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* 📱 Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="bg-light shadow-lg border-top d-lg-none"
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            right: 0,
            zIndex: 9999,
            borderRadius: "0 0 10px 10px",
            borderTop: "2px solid black",
            borderBottom: "2px solid black",
            overflow: "hidden",
            animation: "slideDown 0.3s ease",
          }}
        >
          <div className="container-fluid py-3">
            <ul className="nav flex-column">
              {[...firstRow, ...secondRow].map((item) => (
                <li className="nav-item mb-2" key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center fw-semibold px-3 py-2 rounded shadow-sm`
                    }
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#E0E0E0" : "#fff",
                      color: isActive ? "#000" : "#333",
                    })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="me-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <style>
            {`
              @keyframes slideDown {
                0% { transform: translateY(-20px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }
              .navbar-nav::-webkit-scrollbar {
                height: 6px;
              }
              .navbar-nav::-webkit-scrollbar-thumb {
                background: #950606;
                border-radius: 10px;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default TopNavbar;
