import React from "react";
import "./Footer.css";
import logo from "../assets/logo.png"; // ✅ your logo inside /src/assets

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Top: Logo + Links */}
      <div className="footer-top">
        <div className="footer-logo">
          <img src={logo} alt="NeoBank Logo" />
          <h2>NeoBank</h2>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>Customer Service: 1800 1080</p>
            <p>Locate Us: Find Branches & ATMs near you</p>
            <p>Customer Care</p>
            <p>Complaints and Grievance Redressal</p>
            <p>Central KYC (CKYC)</p>
            <p>Unclaimed / Dormant Accounts</p>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <p>Report Unauthorized Transactions</p>
            <p>Form Center</p>
            <p>Raise a Service Request</p>
            <p>Report Suspicious Activities</p>
            <p>Complaint Form</p>
          </div>

          <div className="footer-col">
            <h4>Regulatory</h4>
            <p>Safe Banking</p>
            <p>RBI Awareness Campaign</p>
            <p>Beware of Fraudulent Offers</p>
            <p>RBI-UDGAM Portal</p>
            <p>Regulatory Disclosures</p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <p>Interest Rates</p>
            <p>Forex Rates</p>
            <p>Service Charges & Fees</p>
            <p>FAQs</p>
            <p>Terms & Conditions</p>
          </div>

          <div className="footer-col">
            <h4>Ways to Bank</h4>
            <p>Digital Banking</p>
            <p>Mobile Banking</p>
            <p>Internet Banking</p>
            <p>WhatsApp Banking</p>
            <p>ATMs & Branches</p>
          </div>

          <div className="footer-col">
            <h4>Investor Center</h4>
            <p>Annual Reports</p>
            <p>Quarterly Results</p>
            <p>Investor Presentations</p>
            <p>Notice & Updates</p>
          </div>

          <div className="footer-col">
            <h4>About Us</h4>
            <p>Board of Directors</p>
            <p>Media Center</p>
            <p>Awards & Recognition</p>
            <p>ESG Initiatives</p>
          </div>

          <div className="footer-col">
            <h4>Calculators</h4>
            <p>FD Calculator</p>
            <p>Loan EMI Calculator</p>
            <p>Mutual Fund Calculator</p>
            <p>Retirement Calculator</p>
            <p>SIP Calculator</p>
          </div>
        </div>
      </div>

      {/* Bottom: Social */}
      <div className="footer-social">
        <h4>Get Social</h4>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" alt="LinkedIn" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}
