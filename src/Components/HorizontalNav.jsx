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
  BarChart3,
  Settings
} from "lucide-react";
import "./HorizontalNav.css";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "KYC", url: "/kyc", icon: FileText },
  { title: "Transactions", url: "/transactions", icon: CreditCard },
  { title: "Loans", url: "/loans", icon: DollarSign },
  { title: "Support", url: "/support", icon: HelpCircle },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function HorizontalNav() {
  return (
    <nav className="horizontal-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon className="nav-icon" />
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
