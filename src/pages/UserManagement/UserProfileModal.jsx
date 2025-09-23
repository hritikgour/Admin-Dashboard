import React, { useState } from "react";
import { Modal, Button, Form, Card } from "react-bootstrap";

export default function UserProfileModal({ user, onClose, onUpdate }) {
  const [editableUser, setEditableUser] = useState(user);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleChange = (field, value) => setEditableUser((prev) => ({ ...prev, [field]: value }));
  const handleSaveChanges = () => { if(onUpdate) onUpdate(editableUser); onClose(); };

  const docsArray = [
    { title: "Aadhaar", imgs: [editableUser.aadhaarFront, editableUser.aadhaarBack] },
    { title: "PAN Card", img: editableUser.panCard },
    { title: "Signature", img: editableUser.signature },
    ...(editableUser.documents || []).map((doc) => ({ title: doc.name, img: doc.url })),
  ];

  return (
    <Modal show={!!user} onHide={onClose} centered size="xl">
      <Modal.Header style={{ backgroundColor: "#800000", color: "white" }} closeButton>
        <Modal.Title><i className="bi bi-person-badge-fill me-2"></i>{editableUser.name} – Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#fdf6e3", maxHeight: "75vh", overflowY: "auto" }}>
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Card className="shadow-lg border-0 flex-shrink-0 text-center" style={{ width: "220px", borderRadius: "12px", background: "linear-gradient(135deg, #800000, #a83232)", color: "white" }}>
            <Card.Body className="p-3">
              <img src={editableUser.photo} alt="Profile" className="rounded-circle mb-2 shadow border border-3 border-warning" width={100} height={100} />
              <h6 className="fw-bold mb-1">{editableUser.name}</h6>
              <p className="mb-1 small"><i className="bi bi-envelope-fill me-2"></i>{editableUser.email}</p>
              <p className="small"><i className="bi bi-telephone-fill me-2"></i>{editableUser.phone}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm flex-grow-1" style={{ minWidth: "360px", borderRadius: "12px", borderTop: "4px solid #FFD700", backgroundColor: "white" }}>
            <Card.Body className="p-3">
              <Form>
                {[
                  { label: "Name", field: "name", editable: true },
                  { label: "Father's Name", field: "fatherName", editable: true },
                  { label: "Address", field: "address", editable: true },
                  { label: "Aadhaar Number", field: "aadhaar", editable: false },
                  { label: "PAN Number", field: "pan", editable: false },
                  { label: "Account Number", field: "account", editable: false },
                  { label: "Account Type", field: "type", editable: true },
                  { label: "Balance", field: "balance", editable: true },
                ].map((item, idx) => (
                  <Form.Group className="mb-2" key={idx}>
                    <Form.Label className="fw-semibold small">{item.label}</Form.Label>
                    <Form.Control size="sm" type="text" value={editableUser[item.field] || ""} readOnly={!item.editable} onChange={(e) => item.editable && handleChange(item.field, e.target.value)} />
                  </Form.Group>
                ))}

                <div className="d-flex gap-2">
                  <Form.Group className="mb-2 flex-grow-1">
                    <Form.Label className="small">Status</Form.Label>
                    <Form.Control size="sm" type="text" value={editableUser.status} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-2 flex-grow-1">
                    <Form.Label className="small">Frozen</Form.Label>
                    <Form.Control size="sm" type="text" value={editableUser.frozen ? "Yes" : "No"} readOnly />
                  </Form.Group>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className="mt-4">
          <h6 className="fw-bold text-dark mb-3">KYC Documents</h6>
          <div className="d-grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", display: "grid" }}>
            {docsArray.map((doc, idx) => (
              <div
                key={idx}
                style={{ border: "2px solid #FFD700", borderRadius: "10px", overflow: "hidden", cursor: doc.img || doc.imgs ? "pointer" : "not-allowed", transition: "transform 0.3s ease, box-shadow 0.3s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", backgroundColor: "#fff", textAlign: "center", fontWeight: "500", fontSize: "0.9rem", padding: "5px" }}
                onMouseEnter={(e) => { if (doc.img || doc.imgs) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 15px rgba(255, 215, 0, 0.5)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; }}
                onClick={() => (doc.img || doc.imgs) && setPreviewDoc(doc)}
              >
                {doc.imgs ? <div style={{ display: "flex", gap: "2px" }}>{doc.imgs.map((i, index) => (<img key={index} src={i} alt={doc.title + " " + (index + 1)} style={{ width: "88px", height: "120px", objectFit: "cover" }} />))}</div>
                  : doc.img ? <img src={doc.img} alt={doc.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} /> 
                  : <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6c757d", fontSize: "0.85rem" }}>{doc.title} not uploaded</div>}
                <div style={{ padding: "5px" }}>{doc.title}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>

      {previewDoc && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}
          onClick={() => setPreviewDoc(null)}>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", maxWidth: "95%", maxHeight: "90%", overflow: "auto", textAlign: "center", boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}>
            <h5 className="mb-3">{previewDoc.title} Preview</h5>
            {previewDoc.imgs ? <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>{previewDoc.imgs.map((i, index) => (<img key={index} src={i} alt={previewDoc.title + " " + (index + 1)} style={{ maxWidth: "45%", maxHeight: "70vh", borderRadius: "8px" }} />))}</div>
              : <img src={previewDoc.img} alt={previewDoc.title} style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px" }} />}
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button variant="secondary" onClick={() => setPreviewDoc(null)}>Close</Button>
              {(previewDoc.img || previewDoc.imgs) && <Button variant="warning" onClick={() => {
                if (previewDoc.imgs) previewDoc.imgs.forEach((i, idx) => { const link = document.createElement("a"); link.href = i; link.download = previewDoc.title.replace(/\s+/g, "_") + "_" + (idx + 1); link.click(); });
                else { const link = document.createElement("a"); link.href = previewDoc.img; link.download = previewDoc.title.replace(/\s+/g, "_"); link.click(); }
              }}>Download</Button>}
            </div>
          </div>
        </div>
      )}

      <Modal.Footer style={{ backgroundColor: "#fdf6e3", borderTop: "2px solid #FFD700" }}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="warning" onClick={handleSaveChanges}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}
