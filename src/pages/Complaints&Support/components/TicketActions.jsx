import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateTicket } from "../services/ticketService";

const TicketActions = ({ ticketId, close }) => {
  const [assigned, setAssigned] = useState("");
  const [note, setNote] = useState("");

  const handleClose = async () => { await updateTicket(ticketId, "close"); close(); };
  const handleEscalate = async () => { await updateTicket(ticketId, "escalate"); close(); };
  const handleAssign = async () => { await updateTicket(ticketId, "assign", { agent: assigned }); close(); };

  return (
    <Modal show onHide={close} centered>
      <Modal.Header closeButton><Modal.Title>Manage Ticket</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Assign to Agent</Form.Label>
            <Form.Control type="text" placeholder="Enter agent name" value={assigned} onChange={(e) => setAssigned(e.target.value)} />
            <Button variant="info" size="sm" className="mt-2" onClick={handleAssign}>Assign</Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Internal Note</Form.Label>
            <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </Form.Group>

          <Button variant="success" className="me-2" onClick={handleClose}>✅ Close Ticket</Button>
          <Button variant="warning" onClick={handleEscalate}>📌 Escalate</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TicketActions;
