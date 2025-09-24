import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateTicket } from "../services/ticketService";

export default function TicketActions({ ticketId, close, onUpdate }) {
  const [assigned, setAssigned] = useState("");
  const [note, setNote] = useState("");

  const handleAssign = async () => {
    if (!assigned.trim()) return;
    await updateTicket(ticketId, "assign", { agent: assigned });
    onUpdate(prev => prev.map(t => t.id === ticketId ? { ...t, assigned: assigned } : t));
    close();
  };

  const handleCloseTicket = async () => {
    await updateTicket(ticketId, "close");
    onUpdate(prev => prev.map(t => t.id === ticketId ? { ...t, status: "Closed" } : t));
    close();
  };

  const handleEscalate = async () => {
    await updateTicket(ticketId, "escalate");
    onUpdate(prev => prev.map(t => t.id === ticketId ? { ...t, priority: "High" } : t));
    close();
  };

  return (
    <Modal show onHide={close} centered>
      <Modal.Header closeButton><Modal.Title>Manage Ticket</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Assign to Agent</Form.Label>
            <Form.Control value={assigned} onChange={e => setAssigned(e.target.value)} placeholder="Agent Name"/>
            <Button className="mt-2" size="sm" variant="info" onClick={handleAssign}>Assign</Button>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Add Internal Note</Form.Label>
            <Form.Control as="textarea" rows={3} value={note} onChange={e => setNote(e.target.value)} />
          </Form.Group>
          <Button variant="success" className="me-2" onClick={handleCloseTicket}>Close Ticket</Button>
          <Button variant="warning" onClick={handleEscalate}>Escalate</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
