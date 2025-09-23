import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaExchangeAlt } from "react-icons/fa";

export default function Transactions() {
  // Dummy Transactions Data
  const dummyTransactions = [
    {
      id: "T001",
      user: "Ram Kumar",
      type: "Deposit",
      amount: 15000,
      status: "Completed",
      date: "2025-09-18",
      auditLogs: [
        { id: 1, action: "Created", user: "System", date: "2025-09-18 09:30", remark: "Deposit request" },
        { id: 2, action: "Completed", user: "Admin1", date: "2025-09-18 09:45", remark: "Funds credited" },
      ],
      notes: ["Verified transaction"],
    },
    {
      id: "T002",
      user: "Sita Sharma",
      type: "Withdrawal",
      amount: 5000,
      status: "Pending",
      date: "2025-09-17",
      auditLogs: [
        { id: 1, action: "Created", user: "System", date: "2025-09-17 14:10", remark: "Withdrawal request" },
      ],
      notes: ["Need approval"],
    },
    {
      id: "T003",
      user: "Amit Verma",
      type: "Transfer",
      amount: 25000,
      status: "Flagged",
      date: "2025-09-16",
      auditLogs: [
        { id: 1, action: "Created", user: "System", date: "2025-09-16 10:00", remark: "Transfer request" },
        { id: 2, action: "Flagged", user: "Admin2", date: "2025-09-16 10:30", remark: "High amount flagged" },
      ],
      notes: ["Under compliance review"],
    },
  ];

  const [transactions, setTransactions] = useState(dummyTransactions);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [viewingTxn, setViewingTxn] = useState(null);
  const itemsPerPage = 5;

  // Filtering
  const filtered = transactions.filter(
    (t) =>
      (t.user.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" || t.status === filter)
  );

  // Sorting
  filtered.sort((a, b) =>
    sort === "latest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Select toggles
  const toggleOne = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map((t) => t.id));

  // Bulk Actions
  const bulkAction = (action) => {
    setTransactions((prev) =>
      prev.map((t) =>
        selected.includes(t.id)
          ? {
              ...t,
              status: action,
              auditLogs: [
                ...t.auditLogs,
                {
                  id: t.auditLogs.length + 1,
                  action,
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: `${action} via bulk`,
                },
              ],
            }
          : t
      )
    );
    setSelected([]);
  };

  // Add Note
  const addNote = (id, text) => {
    if (!text.trim()) return;
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              notes: [...t.notes, text],
              auditLogs: [
                ...t.auditLogs,
                {
                  id: t.auditLogs.length + 1,
                  action: "Note Added",
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: text,
                },
              ],
            }
          : t
      )
    );
  };

  return (
    <div className="vh-100 d-flex flex-column" style={{ overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#8B0000" }}>
        <div className="container-fluid">
          <a className="navbar-brand text-white fw-bold" href="#">
            Beo Bank – All Transactions
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto p-4 bg-light">
        <div className="container-fluid">
          {/* Heading */}
          <div className="card mb-4 shadow-sm rounded">
            <div className="card-body d-flex align-items-center" style={{ backgroundColor: "#fff5f5" }}>
              <FaExchangeAlt size={28} color="#8B0000" className="me-2" />
              <h3 className="mb-0" style={{ color: "#8B0000" }}>
                All Transactions
              </h3>
            </div>
          </div>

          {/* Controls */}
          <div className="row mb-3">
            <div className="col-md-4 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID / User / Type"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="col-md-3 mb-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
            <div className="col-md-3 mb-2">
              <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="col-md-2 text-end mb-2">
              <button className="btn btn-success" onClick={() => bulkAction("Completed")}>
                Bulk Mark Completed
              </button>
              <button
                className="btn btn-dark ms-2"
                style={{ backgroundColor: "#8B0000" }}
                onClick={() => bulkAction("Flagged")}
              >
                Bulk Flag
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selected.length === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Txn ID</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleOne(t.id)} />
                    </td>
                    <td>{t.id}</td>
                    <td>{t.user}</td>
                    <td>{t.type}</td>
                    <td>₹ {t.amount.toLocaleString()}</td>
                    <td>{t.status}</td>
                    <td>{t.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ backgroundColor: "#8B0000" }}
                        onClick={() => setViewingTxn(t)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Page {page} of {totalPages}
            </span>
            <div>
              <button className="btn btn-outline-secondary me-2" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Prev
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal */}
          {viewingTxn && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                    <h5 className="modal-title">Transaction {viewingTxn.id}</h5>
                    <button className="btn-close btn-close-white" onClick={() => setViewingTxn(null)}></button>
                  </div>
                  <div className="modal-body">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#infoTab">
                          Info
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#auditTab">
                          Audit Trail
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#notesTab">
                          Notes
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content mt-3">
                      <div className="tab-pane fade show active" id="infoTab">
                        <p><strong>User:</strong> {viewingTxn.user}</p>
                        <p><strong>Type:</strong> {viewingTxn.type}</p>
                        <p><strong>Amount:</strong> ₹ {viewingTxn.amount.toLocaleString()}</p>
                        <p><strong>Status:</strong> {viewingTxn.status}</p>
                        <p><strong>Date:</strong> {viewingTxn.date}</p>
                        <div className="input-group mt-2">
                          <input type="text" className="form-control" placeholder="Add note..." id="txnNote"/>
                          <button
                            className="btn btn-primary"
                            style={{ backgroundColor: "#8B0000" }}
                            onClick={() => {
                              const text = document.getElementById("txnNote").value;
                              addNote(viewingTxn.id, text);
                              document.getElementById("txnNote").value = "";
                            }}
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="auditTab">
                        <table className="table table-bordered text-center">
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Action</th>
                              <th>User</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewingTxn.auditLogs.map((log) => (
                              <tr key={log.id}>
                                <td>{log.date}</td>
                                <td>{log.action}</td>
                                <td>{log.user}</td>
                                <td>{log.remark}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="tab-pane fade" id="notesTab">
                        <ul className="list-group">
                          {viewingTxn.notes.map((n, idx) => (
                            <li key={idx} className="list-group-item">{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setViewingTxn(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

