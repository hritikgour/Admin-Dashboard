import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReviewTransactions() {
  // Dummy KYC data
  const dummyCases = [
    {
      caseId: "C001",
      name: "Ram Kumar",
      status: "Pending",
      date: "2025-09-18",
      note: "Initial KYC",
      docs: [
        { type: "Aadhar", url: "https://via.placeholder.com/150" },
        { type: "PAN", url: "https://via.placeholder.com/150" },
      ],
      auditLogs: [
        {
          id: 1,
          action: "Created",
          user: "Admin1",
          date: "2025-09-18 10:00",
          remark: "KYC started",
        },
      ],
      notes: ["Initial check pending"],
    },
    {
      caseId: "C002",
      name: "Sita Sharma",
      status: "Approved",
      date: "2025-09-17",
      note: "Verified",
      docs: [{ type: "Passport", url: "https://via.placeholder.com/150" }],
      auditLogs: [
        {
          id: 1,
          action: "Approved",
          user: "Admin2",
          date: "2025-09-17 12:00",
          remark: "Verified",
        },
      ],
      notes: ["Documents verified"],
    },
    {
      caseId: "C003",
      name: "Amit Verma",
      status: "Rejected",
      date: "2025-09-16",
      note: "Invalid Docs",
      docs: [],
      auditLogs: [
        {
          id: 1,
          action: "Rejected",
          user: "Admin1",
          date: "2025-09-16 14:00",
          remark: "Invalid documents",
        },
      ],
      notes: ["Documents not valid"],
    },
  ];

  const [cases, setCases] = useState(dummyCases);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [selectedCases, setSelectedCases] = useState([]);
  const [viewingCase, setViewingCase] = useState(null);
  const itemsPerPage = 5;

  let filteredCases = cases.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.caseId.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "All" || c.status === filter)
  );

  filteredCases.sort((a, b) =>
    sort === "latest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const paginatedCases = filteredCases.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const toggleCase = (caseId) =>
    setSelectedCases((prev) =>
      prev.includes(caseId)
        ? prev.filter((id) => id !== caseId)
        : [...prev, caseId]
    );

  const toggleAll = () =>
    setSelectedCases(
      selectedCases.length === paginatedCases.length
        ? []
        : paginatedCases.map((c) => c.caseId)
    );

  const bulkAction = (action) => {
    if (selectedCases.length === 0) return;
    setCases((prev) => {
      const updatedCases = prev.map((c) =>
        selectedCases.includes(c.caseId)
          ? {
              ...c,
              status: action,
              auditLogs: [
                ...c.auditLogs,
                {
                  id: c.auditLogs.length + 1,
                  action,
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: `${action} via bulk`,
                },
              ],
            }
          : c
      );
      if (viewingCase && selectedCases.includes(viewingCase.caseId)) {
        const updatedCase = updatedCases.find(
          (c) => c.caseId === viewingCase.caseId
        );
        setViewingCase(updatedCase);
      }
      return updatedCases;
    });
    setSelectedCases([]);
  };

  const addNote = (caseId, noteText) => {
    if (noteText.trim() === "") return;
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              notes: [...(c.notes || []), noteText],
              auditLogs: [
                ...c.auditLogs,
                {
                  id: c.auditLogs.length + 1,
                  action: "Note Added",
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: noteText,
                },
              ],
            }
          : c
      )
    );
  };

  const escalateCase = (caseId, reason) => {
    if (reason.trim() === "") return;
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: "Escalated",
              note: reason,
              auditLogs: [
                ...c.auditLogs,
                {
                  id: c.auditLogs.length + 1,
                  action: "Escalated",
                  user: "Admin",
                  date: new Date().toLocaleString(),
                  remark: reason,
                },
              ],
            }
          : c
      )
    );
  };

  const downloadDoc = (url, type) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}.png`;
    link.click();
  };

  return (
    <div className="vh-100 d-flex flex-column w-100">
      {/* Navbar - Full Width */}
      <nav
        className="navbar navbar-expand-lg w-100"
        style={{ backgroundColor: "#900603" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand text-white fw-bold m-0" href="#">
            KYC History
          </a>
        </div>
      </nav>

      {/* Main Content - Full Width */}
      <div className="flex-grow-1 overflow-auto bg-light w-100 px-3 py-4">
        <div className="container-fluid px-0">
          <h2 className="mb-3" style={{ color: "#900603" }}>
            KYC History
          </h2>

          {/* Controls */}
          <div className="row mb-3 g-2 align-items-center">
            <div className="col-12 col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search Case ID or Name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="col-6 col-md-3">
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
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="col-12 col-md-2 d-flex justify-content-md-end gap-2 mt-2 mt-md-0">
              <button
                className="btn btn-success"
                onClick={() => bulkAction("Approved")}
              >
                Bulk Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => bulkAction("Rejected")}
              >
                Bulk Reject
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead style={{ backgroundColor: "#900603", color: "#fff" }}>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedCases.length === paginatedCases.length &&
                        paginatedCases.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Case ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map((c) => (
                  <tr key={c.caseId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCases.includes(c.caseId)}
                        onChange={() => toggleCase(c.caseId)}
                      />
                    </td>
                    <td>{c.caseId}</td>
                    <td>{c.name}</td>
                    <td
                      className={
                        c.status === "Pending"
                          ? "text-warning fw-bold"
                          : c.status === "Approved"
                          ? "text-success fw-bold"
                          : c.status === "Escalated"
                          ? "text-primary fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {c.status}
                    </td>
                    <td>{c.date}</td>
                    <td>{c.note}</td>
                    <td>
                      <button
                        className="btn btn-sm text-white"
                        style={{ backgroundColor: "#900603" }}
                        onClick={() => setViewingCase(c)}
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
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  Page {page} of {totalPages}
                </span>
              </li>
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

          {/* Modal */}
          {viewingCase && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#900603", color: "#fff" }}
                  >
                    <h5 className="modal-title">
                      Case {viewingCase.caseId} - {viewingCase.name}
                    </h5>
                    <button
                      className="btn-close btn-close-white"
                      onClick={() => setViewingCase(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#documentsTab"
                        >
                          Documents
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#notesTab"
                        >
                          Notes
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#auditTab"
                        >
                          Audit Trail
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#escalateTab"
                        >
                          Escalate
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content mt-3">
                      <div
                        className="tab-pane fade show active"
                        id="documentsTab"
                      >
                        {viewingCase.docs.length > 0 ? (
                          <div className="d-flex flex-wrap gap-3">
                            {viewingCase.docs.map((doc, idx) => (
                              <div key={idx} className="border p-2 text-center">
                                <img
                                  src={doc.url}
                                  alt={doc.type}
                                  className="img-thumbnail mb-2"
                                  width="120"
                                />
                                <div>{doc.type}</div>
                                <button
                                  className="btn btn-sm btn-outline-dark mt-1"
                                  onClick={() => downloadDoc(doc.url, doc.type)}
                                >
                                  Download
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No documents uploaded</p>
                        )}
                      </div>
                      <div className="tab-pane fade" id="notesTab">
                        <ul className="list-group mb-2">
                          {(viewingCase.notes || []).map((note, idx) => (
                            <li key={idx} className="list-group-item">
                              {note}
                            </li>
                          ))}
                        </ul>
                        <div className="input-group mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add note"
                            id="newNoteInput"
                          />
                          <button
                            className="btn text-white"
                            style={{ backgroundColor: "#900603" }}
                            onClick={() => {
                              const val =
                                document.getElementById("newNoteInput").value;
                              addNote(viewingCase.caseId, val);
                              document.getElementById("newNoteInput").value = "";
                            }}
                          >
                            Add Note
                          </button>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="auditTab">
                        <table className="table table-bordered">
                          <thead className="table-light text-center">
                            <tr>
                              <th>Date</th>
                              <th>Action</th>
                              <th>User</th>
                              <th>Remark</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewingCase.auditLogs.map((log) => (
                              <tr key={log.id} className="text-center">
                                <td>{log.date}</td>
                                <td>{log.action}</td>
                                <td>{log.user}</td>
                                <td>{log.remark}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="tab-pane fade" id="escalateTab">
                        <textarea
                          className="form-control mb-2"
                          id="escalateInput"
                          placeholder="Enter escalation reason"
                        ></textarea>
                        <button
                          className="btn text-white"
                          style={{ backgroundColor: "#900603" }}
                          onClick={() => {
                            const val =
                              document.getElementById("escalateInput").value;
                            escalateCase(viewingCase.caseId, val);
                            document.getElementById("escalateInput").value = "";
                          }}
                        >
                          Escalate Case
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setViewingCase(null)}
                    >
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
