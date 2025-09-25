import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBell } from "react-icons/fa";

export default function ViewAlerts() {
  const dummyAlerts = [
    {
      alertId: "A001",
      name: "Ram Kumar",
      type: "Suspicious Transaction",
      status: "Pending",
      date: "2025-09-18",
      note: "Transaction above threshold",
      auditLogs: [
        { id: 1, action: "Created", user: "Admin1", date: "2025-09-18 10:00", remark: "Initial alert" },
      ],
      notes: ["Check transaction details"],
    },
    {
      alertId: "A002",
      name: "Sita Sharma",
      type: "Customer Complaint",
      status: "Resolved",
      date: "2025-09-17",
      note: "Refund issued",
      auditLogs: [
        { id: 1, action: "Resolved", user: "Admin2", date: "2025-09-17 12:00", remark: "Refund processed" },
      ],
      notes: ["Customer notified"],
    },
    {
      alertId: "A003",
      name: "Amit Verma",
      type: "Suspicious Transaction",
      status: "Escalated",
      date: "2025-09-16",
      note: "Large transfer flagged",
      auditLogs: [
        { id: 1, action: "Escalated", user: "Admin1", date: "2025-09-16 14:00", remark: "High-risk transaction" },
      ],
      notes: ["Sent to compliance team"],
    },
  ];

  const [alerts, setAlerts] = useState(dummyAlerts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [viewingAlert, setViewingAlert] = useState(null);

  const [newNote, setNewNote] = useState("");
  const [escalateReason, setEscalateReason] = useState("");

  const itemsPerPage = 5;

  const filteredAlerts = alerts.filter(
    (a) =>
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.alertId.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" || a.status === filter)
  );

  filteredAlerts.sort((a, b) =>
    sort === "latest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleAlert = (alertId) =>
    setSelectedAlerts((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );

  const toggleAll = () =>
    setSelectedAlerts(
      selectedAlerts.length === paginatedAlerts.length
        ? []
        : paginatedAlerts.map((a) => a.alertId)
    );

  const bulkAction = (action) => {
    setAlerts((prev) =>
      prev.map((a) =>
        selectedAlerts.includes(a.alertId)
          ? {
              ...a,
              status: action,
              auditLogs: [
                ...a.auditLogs,
                {
                  id: a.auditLogs.length + 1,
                  action,
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: `${action} via bulk`,
                },
              ],
            }
          : a
      )
    );
    setSelectedAlerts([]);
  };

  const addNote = (alertId) => {
    if (!newNote.trim()) return;
    setAlerts((prev) =>
      prev.map((a) =>
        a.alertId === alertId
          ? {
              ...a,
              notes: [...(a.notes || []), newNote],
              auditLogs: [
                ...a.auditLogs,
                {
                  id: a.auditLogs.length + 1,
                  action: "Note Added",
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: newNote,
                },
              ],
            }
          : a
      )
    );
    setNewNote("");
  };

  const escalateAlert = (alertId) => {
    if (!escalateReason.trim()) return;
    setAlerts((prev) =>
      prev.map((a) =>
        a.alertId === alertId
          ? {
              ...a,
              status: "Escalated",
              note: escalateReason,
              auditLogs: [
                ...a.auditLogs,
                {
                  id: a.auditLogs.length + 1,
                  action: "Escalated",
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: escalateReason,
                },
              ],
            }
          : a
      )
    );
    setEscalateReason("");
  };

  const statusColor = (status) =>
    status === "Pending"
      ? "text-warning fw-bold"
      : status === "Resolved"
      ? "text-success fw-bold"
      : "text-danger fw-bold";

  return (
    <div className="vh-100 d-flex flex-column" style={{ overflowX: "hidden" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#8B0000" }}>
        <div className="container-fluid">
          <span className="navbar-brand text-white fw-bold">
            Neo Bank AML & Complaints
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto p-3 p-md-4 bg-light">
        <div className="container-fluid">
          {/* Heading */}
          <div className="card mb-4 shadow-sm rounded">
            <div className="card-body d-flex align-items-center" style={{ backgroundColor: "#fff5f5" }}>
              <FaBell size={28} color="#8B0000" className="me-2" />
              <h3 className="mb-0" style={{ color: "#8B0000" }}>
                AML / Complaints Alerts
              </h3>
            </div>
          </div>

          {/* Controls */}
          <div className="row g-2 mb-3 align-items-center">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID / Name / Type"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="col-12 col-md-4 d-flex flex-wrap gap-2 justify-content-md-end">
              <button
                className="btn btn-success flex-grow-1 flex-md-grow-0"
                onClick={() => bulkAction("Resolved")}
              >
                Bulk Resolve
              </button>
              <button
                className="btn btn-danger flex-grow-1 flex-md-grow-0"
                onClick={() => bulkAction("Escalated")}
              >
                Bulk Escalate
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedAlerts.length === paginatedAlerts.length && paginatedAlerts.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Alert ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAlerts.map((a) => (
                  <tr key={a.alertId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(a.alertId)}
                        onChange={() => toggleAlert(a.alertId)}
                      />
                    </td>
                    <td>{a.alertId}</td>
                    <td>{a.name}</td>
                    <td>{a.type}</td>
                    <td className={statusColor(a.status)}>{a.status}</td>
                    <td>{a.date}</td>
                    <td>{a.note}</td>
                    <td>
                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#8B0000" }}
                        onClick={() => setViewingAlert(a)}
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
            <span className="mb-2 mb-md-0">
              Page {page} of {totalPages}
            </span>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
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
          {viewingAlert && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                    <h5 className="modal-title">{viewingAlert.name}</h5>
                    <button className="btn-close btn-close-white" onClick={() => setViewingAlert(null)}></button>
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
                      {/* Info Tab */}
                      <div className="tab-pane fade show active" id="infoTab">
                        <p><strong>Alert ID:</strong> {viewingAlert.alertId}</p>
                        <p><strong>Type:</strong> {viewingAlert.type}</p>
                        <p><strong>Status:</strong> {viewingAlert.status}</p>
                        <p><strong>Note:</strong> {viewingAlert.note}</p>
                        <p><strong>Date:</strong> {viewingAlert.date}</p>

                        <div className="input-group mt-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <button
                            className="btn text-white"
                            style={{ backgroundColor: "#8B0000" }}
                            onClick={() => addNote(viewingAlert.alertId)}
                          >
                            Add Note
                          </button>
                        </div>

                        <div className="input-group mt-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Escalate reason..."
                            value={escalateReason}
                            onChange={(e) => setEscalateReason(e.target.value)}
                          />
                          <button
                            className="btn btn-danger text-white"
                            style={{ backgroundColor: "#8B0000" }}
                            onClick={() => escalateAlert(viewingAlert.alertId)}
                          >
                            Escalate
                          </button>
                        </div>
                      </div>

                      {/* Audit Trail */}
                      <div className="tab-pane fade" id="auditTab">
                        <div className="table-responsive">
                          <table className="table table-bordered text-center">
                            <thead style={{ backgroundColor: "#8B0000", color: "#fff" }}>
                              <tr>
                                <th>Date</th>
                                <th>Action</th>
                                <th>User</th>
                                <th>Remark</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewingAlert.auditLogs.map((log) => (
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
                      </div>

                      {/* Notes */}
                      <div className="tab-pane fade" id="notesTab">
                        <ul className="list-group">
                          {viewingAlert.notes.map((n, idx) => (
                            <li key={idx} className="list-group-item">{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setViewingAlert(null)}>
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
