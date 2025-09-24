// src/Components/HorizontalNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  HelpCircle,
  Settings,
  Wallet,
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

export default function HorizontalNav() {
  return (
    <nav className="sticky-top bg-white shadow-sm border-bottom py-2">
      <div className="container-fluid d-flex flex-wrap gap-3 justify-content-start">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `d-flex align-items-center gap-1 px-3 py-2 rounded fw-medium text-decoration-none transition ${
                  isActive
                    ? "bg-danger text-white"
                    : "text-dark"
                }`
              }
              style={{
                transition: "all 0.3s ease",
              }}
            >
              <Icon className="me-1" size={18} />
              <span className="d-none d-md-inline">{item.title}</span>
            </NavLink>
          );
        })}
      </div>

      <style>
        {`
          .nav-link:not(.active):hover {
            background-color: #900603 !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
          }
        `}
      </style>
    </nav>
  );
}
