import React, { useState, useEffect } from "react";
import "./Loans.css";

const Loans = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loans, setLoans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocs, setSelectedDocs] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    // Mock data
    setLoans([
      {
        LoanID: "L001",
        CustomerName: "Alice",
        LoanType: "Home",
        Principal: 100000,
        CreditScore: 750,
        Status: "Approved",
        DocumentsVerified: true,
        EligibilityCheck: "Pass",
        documents: [
          { name: "Aadhaar.pdf", url: "/docs/alice_aadhaar.pdf" },
          { name: "PAN.pdf", url: "/docs/alice_pan.pdf" },
        ],
      },
      {
        LoanID: "L002",
        CustomerName: "Bob",
        LoanType: "Car",
        Principal: 20000,
        CreditScore: 680,
        Status: "Sanction",
        DocumentsVerified: false,
        EligibilityCheck: "Check",
        documents: [],
      },
      {
        LoanID: "L003",
        CustomerName: "Charlie",
        LoanType: "Personal",
        Principal: 15000,
        CreditScore: 600,
        Status: "Rejected",
        DocumentsVerified: true,
        EligibilityCheck: "Fail",
        documents: [{ name: "SalarySlip.pdf", url: "/docs/charlie_salary.pdf" }],
      },
    ]);
  }, []);

  const handleAction = (loanID, action) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.LoanID === loanID ? { ...loan, Status: action } : loan
      )
    );
  };

  const filteredLoans = loans.filter((loan) => {
    const q = search.toLowerCase();
    const matchesSearch =
      loan.CustomerName.toLowerCase().includes(q) ||
      loan.LoanID.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || loan.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container full-width">
      <h1>Loan Management</h1>

      {/* Tabs */}
      <div className="tabs full-width">
        {["applications", "accounts"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "applications" ? "Loan Applications" : "Loan Accounts"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters full-width">
        <input
          type="text"
          placeholder="Search by Loan ID or Customer..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Sanction">Sanction</option>
          <option value="Disburse">Disburse</option>
          <option value="Reschedule">Reschedule</option>
          <option value="NPA">Mark NPA</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-card full-width">
        <table>
          <thead>
            <tr>
              {activeTab === "applications" ? (
                <>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Principal</th>
                  <th>Credit Score</th>
                  <th>Documents</th>
                  <th>Eligibility</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              ) : (
                <>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Loan Type</th>
                  <th>Principal</th>
                  <th>Remaining Balance</th>
                  <th>EMI</th>
                  <th>Tenure</th>
                  <th>Repayment</th>
                  <th>Default Alert</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedLoans.length > 0 ? (
              paginatedLoans.map((loan) => (
                <tr key={loan.LoanID}>
                  <td>{loan.LoanID}</td>
                  <td>{loan.CustomerName}</td>
                  <td>{loan.LoanType}</td>
                  <td>{loan.Principal.toLocaleString()}</td>
                  {activeTab === "applications" ? (
                    <>
                      <td>{loan.CreditScore}</td>
                      <td>
                        {loan.DocumentsVerified && loan.documents.length > 0 ? (
                          <button onClick={() => setSelectedDocs(loan.documents)}>
                            View Docs
                          </button>
                        ) : (
                          "No Docs"
                        )}
                      </td>
                      <td>{loan.EligibilityCheck}</td>
                      <td>
                        <span className={`status ${loan.Status.toLowerCase()}`}>
                          {loan.Status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {["Approved", "Rejected", "Sanction", "Disburse", "Reschedule", "NPA"].map((act) => (
                            <button key={act} onClick={() => handleAction(loan.LoanID, act)}>
                              {act}
                            </button>
                          ))}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{loan.RemainingBalance?.toLocaleString() || "-"}</td>
                      <td>{loan.EMI?.toLocaleString() || "-"}</td>
                      <td>{loan.Tenure || "-"}</td>
                      <td>{loan.RepaymentSchedule || "-"}</td>
                      <td>{loan.DefaultAlert ? "Yes" : "No"}</td>
                      <td>
                        <span className={`status ${loan.Status.toLowerCase()}`}>
                          {loan.Status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleAction(loan.LoanID, "Reschedule")}>Reschedule</button>
                          <button onClick={() => handleAction(loan.LoanID, "NPA")}>Mark NPA</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === "applications" ? 9 : 11} className="no-data">
                  No loans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination full-width">
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedDocs && (
        <div className="modal-overlay" onClick={() => setSelectedDocs(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Documents</h3>
            <ul>
              {selectedDocs.map((doc, index) => (
                <li key={index}>
                  <a href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a>
                </li>
              ))}
            </ul>
            <button className="btn-close" onClick={() => setSelectedDocs(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
