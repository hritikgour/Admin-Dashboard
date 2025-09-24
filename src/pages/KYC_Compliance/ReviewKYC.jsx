import React, { useState } from "react";
import { Modal, Button, Alert, FormControl, InputGroup } from "react-bootstrap";
import {
  FaSearch,
  FaUserCheck,
  FaBan,
  FaRegFileAlt,
  FaStickyNote,
  FaUserShield,
} from "react-icons/fa";
import Logo from "../../assets/NeoBank_Logo_01.png";

const initialUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    kycId: "KYC-001-20240715",
    documents: [
      { type: "Aadhaar", img: "https://via.placeholder.com/600x400?text=Aadhaar" },
      { type: "PAN", img: "https://via.placeholder.com/600x400?text=PAN" },
      { type: "Passport", img: "https://via.placeholder.com/600x400?text=Passport" },
      { type: "Utility Bill", img: "https://via.placeholder.com/600x400?text=Utility+Bill" },
    ],
    uploadedDate: "Jul 15, 2024",
    validity: "Dec 31, 2030",
    status: "Pending",
    notes: ["Aadhaar image slightly blurry, but readable. PAN looks clear."],
    auditLogs: [
      { id: 1, action: "Submitted", user: "User", date: "2025-09-18 09:00", remark: "Initial submission" },
    ],
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    kycId: "KYC-002-20240714",
    documents: [
      { type: "Aadhaar", img: "https://via.placeholder.com/600x400?text=Aadhaar" },
      { type: "PAN", img: "https://via.placeholder.com/600x400?text=PAN" },
      { type: "Passport", img: "https://via.placeholder.com/600x400?text=Passport" },
      { type: "Utility Bill", img: "https://via.placeholder.com/600x400?text=Utility+Bill" },
    ],
    uploadedDate: "Jul 14, 2024",
    validity: "Jun 15, 2028",
    status: "Approved",
    notes: ["All documents verified and approved. No issues found."],
    auditLogs: [
      { id: 1, action: "Submitted", user: "User", date: "2025-09-17 08:00", remark: "Initial submission" },
      { id: 2, action: "Approved", user: "Admin1", date: "2025-09-17 12:00", remark: "All good" },
    ],
  },
];

export default function PendingKYC() {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentAction, setRecentAction] = useState({});

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.img;
    link.download = `${doc.type}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlert({ type: "info", msg: `${doc.type} downloaded successfully!` });
    setTimeout(() => setAlert(null), 2500);
  };

  const handleAction = (type, userId) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      setAlert({ type: "danger", msg: "User not found" });
      setTimeout(() => setAlert(null), 2500);
      return;
    }

    const user = users[userIndex];
    const time = new Date().toLocaleString();

    if (type === "approve") {
      const updated = { ...user };
      updated.status = "Approved";
      updated.auditLogs = [
        ...updated.auditLogs,
        { id: updated.auditLogs.length + 1, action: "Approved", user: "Admin", date: time, remark: "KYC Approved" },
      ];
      const next = [...users];
      next[userIndex] = updated;
      setUsers(next);
      setAlert({ type: "success", msg: `✅ ${user.name} approved.` });
      setRecentAction({ id: userId, action: "approve" });
      setTimeout(() => setRecentAction({}), 2200);
      setTimeout(() => setAlert(null), 2500);
      return;
    }

    if (type === "reject") {
      const reason = window.prompt("Reason for rejection (optional):", "");
      const updated = { ...user };
      updated.status = "Rejected";
      updated.auditLogs = [
        ...updated.auditLogs,
        { id: updated.auditLogs.length + 1, action: "Rejected", user: "Admin", date: time, remark: reason || "Rejected by Admin" },
      ];
      const next = [...users];
      next[userIndex] = updated;
      setUsers(next);
      setAlert({ type: "danger", msg: `❌ ${user.name} rejected.` });
      setRecentAction({ id: userId, action: "reject" });
      setTimeout(() => setRecentAction({}), 2200);
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (type === "request") {
      const info = window.prompt("What documents/details do you want to request?", "Please upload a clearer copy of Aadhaar.");
      const updated = { ...user };
      updated.status = "Info Requested";
      updated.auditLogs = [
        ...updated.auditLogs,
        { id: updated.auditLogs.length + 1, action: "Requested More Docs", user: "Admin", date: time, remark: info || "Requested more documents" },
      ];
      updated.notes = [...(updated.notes || []), `Requested: ${info || "More documents required"}`];
      const next = [...users];
      next[userIndex] = updated;
      setUsers(next);
      setAlert({ type: "warning", msg: `📑 Requested more documents from ${user.name}.` });
      setRecentAction({ id: userId, action: "request" });
      setTimeout(() => setRecentAction({}), 2200);
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (type === "notes") {
      const note = window.prompt("Enter note to add for compliance/audit:", "");
      if (!note || !note.trim()) {
        setAlert({ type: "info", msg: "No note added." });
        setTimeout(() => setAlert(null), 1800);
        return;
      }
      const updated = { ...user };
      updated.notes = [...(updated.notes || []), note];
      updated.auditLogs = [
        ...updated.auditLogs,
        { id: updated.auditLogs.length + 1, action: "Note Added", user: "Admin", date: time, remark: note },
      ];
      const next = [...users];
      next[userIndex] = updated;
      setUsers(next);
      setAlert({ type: "success", msg: `📝 Note added for ${user.name}.` });
      setTimeout(() => setAlert(null), 2200);
      return;
    }

    if (type === "edd") {
      const reason = window.prompt("Reason for EDD (optional):", "High-risk transaction or mismatch in docs");
      const updated = { ...user };
      updated.status = "Escalated (EDD)";
      updated.auditLogs = [
        ...updated.auditLogs,
        { id: updated.auditLogs.length + 1, action: "Marked EDD", user: "Admin", date: time, remark: reason || "Marked for EDD" },
      ];
      updated.notes = [...(updated.notes || []), `EDD: ${reason || "Escalated for review"}`];
      const next = [...users];
      next[userIndex] = updated;
      setUsers(next);
      setAlert({ type: "danger", msg: `🔎 ${user.name} marked for EDD.` });
      setRecentAction({ id: userId, action: "edd" });
      setTimeout(() => setRecentAction({}), 2200);
      setTimeout(() => setAlert(null), 3000);
      return;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.kycId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4" style={{ background: "#f9f9f9" }}>
      {/* Header */}
      <div
        className="p-4 mb-4 rounded text-white shadow-lg d-flex justify-content-between align-items-center flex-wrap"
        style={{ border: "2px solid #f8e4e4ff", backgroundColor: "#900603" }}
      >
        <div>
          <h4 className="mb-1 text-uppercase fw-bold d-flex align-items-center">
            
            KYC Approve
          </h4>
          <small className="text-white">Efficiently review and manage all KYC submissions</small>
        </div>
        <div className="d-none d-md-block">
          <FaUserCheck size="2.5rem" color="#900603" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <InputGroup className="shadow-sm">
          <InputGroup.Text style={{ backgroundColor: "#900603", color: "white", border: "none" }}>
            <FaSearch />
          </InputGroup.Text>
          <FormControl
            placeholder="Search by Name, Email, or KYC ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "1px solid #900603", fontSize: "0.9rem" }}
          />
        </InputGroup>
      </div>

      {/* Alerts - Theme Styled */}
      {alert && (
        <Alert
          variant={alert.type}
          onClose={() => setAlert(null)}
          dismissible
          className={`shadow-sm border-2 fw-semibold text-center ${
            alert.type === "success"
              ? "bg-success text-white border-success"
              : alert.type === "danger"
              ? "bg-danger text-white border-danger"
              : alert.type === "warning"
              ? "bg-warning text-dark border-warning"
              : "bg-info text-dark border-info"
          }`}
        >
          {alert.msg}
        </Alert>
      )}

      {/* User Cards */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const isRecent = recentAction.id === user.id;
          const recentClass =
            recentAction.action === "approve"
              ? "border-success"
              : recentAction.action === "reject"
              ? "border-danger"
              : recentAction.action === "request"
              ? "border-warning"
              : recentAction.action === "edd"
              ? "border-danger"
              : "";

          return (
            <div className={`card border-0 shadow-lg mb-4 rounded-3 ${isRecent ? recentClass : ""}`} key={user.id}>
              <div className="card-body p-4">
                {/* User Info */}
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 flex-wrap">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{user.name}</h5>
                    <small className="text-muted">
                      {user.email} | KYC ID: <span className="fw-bold">{user.kycId}</span>
                    </small>
                  </div>
                  <span
                    className={`badge px-3 py-2 ${
                      user.status === "Approved"
                        ? "bg-success"
                        : user.status === "Rejected"
                        ? "bg-danger"
                        : user.status === "Info Requested"
                        ? "bg-warning text-dark"
                        : user.status === "Escalated (EDD)"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    } rounded-pill`}
                    style={{ minWidth: 120, textAlign: "center" }}
                  >
                    {user.status}
                  </span>
                </div>

                {/* Documents */}
                <div className="row g-3 mt-3">
                  {user.documents.map((doc, idx) => (
                    <div className="col-lg-3 col-md-6 col-sm-12" key={idx}>
                      <div
                        className="card text-center text-white border-0 h-100 shadow-sm"
                        style={{
                          backgroundColor: "#900603",
                          borderRadius: "12px",
                        }}
                      >
                        <div className="card-body d-flex flex-column justify-content-between p-3">
                          <h6 className="fw-bold mb-3">{doc.type}</h6>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <Button variant="outline-light" size="sm" onClick={() => handleView(doc)}>
                              View
                            </Button>
                            <Button variant="outline-light" size="sm" onClick={() => handleDownload(doc)}>
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="mt-4 p-3 bg-light rounded small border border-secondary border-opacity-25">
                  <strong>Uploaded:</strong> {user.uploadedDate} | <strong>Validity:</strong> {user.validity}
                </div>

                {/* Notes */}
                <div className="alert alert-warning mt-3 p-3 small mb-3 border border-warning">
                  <strong>Compliance Notes:</strong>{" "}
                  {user.notes && user.notes.length > 0 ? (
                    <span>{user.notes[user.notes.length - 1]}</span>
                  ) : (
                    <span>No notes yet.</span>
                  )}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 flex-wrap mt-3">
                  <Button size="sm" variant="success" onClick={() => handleAction("approve", user.id)}>
                    <FaUserCheck className="me-1" /> Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleAction("reject", user.id)}>
                    <FaBan className="me-1" /> Reject
                  </Button>
                  <Button size="sm" variant="warning" onClick={() => handleAction("request", user.id)}>
                    <FaRegFileAlt className="me-1" /> Request More Docs
                  </Button>
                  <Button size="sm" variant="info" onClick={() => handleAction("notes", user.id)}>
                    <FaStickyNote className="me-1" /> Add Notes
                  </Button>
                  <Button size="sm" variant="dark" onClick={() => handleAction("edd", user.id)}>
                    <FaUserShield className="me-1" /> Mark for EDD
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <Alert variant="info" className="text-center">
          No users found matching your search.
        </Alert>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: "#900603" }}>
          <Modal.Title className="text-white">Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          {selectedDoc && <img src={selectedDoc.img} alt="Document" className="img-fluid rounded shadow" />}
        </Modal.Body>
      </Modal>
    </div>
  );
}
