import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup, Form, Modal } from "react-bootstrap";
import TicketActions from "./TicketActions";
import { getTicketDetails, updateTicket } from "../services/ticketService";

export default function TicketDetails({ ticketId, goBack, onUpdate }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTicketDetails(ticketId).then(data => {
      setTicket(data);
      setLoading(false);
    });
  }, [ticketId]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const updated = {
      ...ticket,
      messages: [
        ...ticket.messages,
        { sender: "Agent", text: newMsg, time: new Date().toLocaleString() }
      ]
    };
    setTicket(updated);
    setNewMsg("");
    await updateTicket(ticketId, "reply", { text: newMsg });
    onUpdate(prev => prev.map(t => t.id === ticket.id ? updated : t));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Card className="shadow-sm mb-3">
      {/* Header */}
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap">
        <Button variant="secondary" size="sm" onClick={goBack} className="mb-2 mb-sm-0">⬅ Back</Button>
        <div className="flex-grow-1 text-center text-sm-start">
          <h5 className="mb-0">{ticket.subject}</h5>
          <small className="text-muted">{ticket.user}</small>
        </div>
        <Button variant="outline-dark" onClick={() => setShowActions(true)} className="mt-2 mt-sm-0">Manage Ticket ⚙</Button>
      </Card.Header>

      {/* Chat Box */}
      <Card.Body className="d-flex flex-column p-2 p-md-3">
        <div className="flex-grow-1 mb-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
          <ListGroup variant="flush">
            {ticket.messages.map((msg, idx) => (
              <ListGroup.Item key={idx} className={`d-flex flex-column ${msg.sender === "Agent" ? "text-end bg-light rounded" : ""}`}>
                <div><b>{msg.sender}:</b> {msg.text}</div>
                <small className="text-muted">{msg.time}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Reply Box */}
        <Form className="d-flex gap-2 flex-column flex-sm-row">
          <Form.Control 
            type="text" 
            placeholder="Type reply..." 
            value={newMsg} 
            onChange={e => setNewMsg(e.target.value)} 
          />
          <Button variant="primary" onClick={sendMessage} className="mt-2 mt-sm-0">Send</Button>
        </Form>
      </Card.Body>

      {/* Ticket Actions Modal */}
      <Modal show={showActions} onHide={() => setShowActions(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TicketActions ticketId={ticketId} close={() => setShowActions(false)} onUpdate={onUpdate} />
        </Modal.Body>
      </Modal>
    </Card>
  );
}
