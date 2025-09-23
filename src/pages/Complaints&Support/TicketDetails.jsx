import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Badge, Spinner } from "react-bootstrap";
import TicketActions from "./components/TicketActions";
import { getTicketDetails, updateTicket } from "./services/ticketService";

const TicketDetails = ({ ticketId, goBack }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      const data = await getTicketDetails(ticketId);
      setTicket(data);
      setLoading(false);
    };
    fetchTicket();
  }, [ticketId]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const updated = { ...ticket, messages: [...ticket.messages, { sender: "Agent", text: newMsg }] };
    setTicket(updated);
    setNewMsg("");
    await updateTicket(ticketId, "reply", { text: newMsg });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div>
      <Button variant="secondary" onClick={goBack} size="sm">⬅ Back to Queue</Button>
      <h4 className="mt-3">
        Ticket #{ticket.id} - {ticket.subject} <Badge bg="danger">{ticket.priority}</Badge>
      </h4>
      <p><b>User:</b> {ticket.user} | <b>Status:</b> {ticket.status}</p>

      <div className="chat-box border rounded p-3 mb-3" style={{ height: "250px", overflowY: "auto" }}>
        <ListGroup>
          {ticket.messages.map((msg, i) => (
            <ListGroup.Item key={i} className={msg.sender === "Agent" ? "text-end bg-light" : ""}>
              <b>{msg.sender}:</b> {msg.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      <Form className="d-flex mb-3">
        <Form.Control type="text" placeholder="Type reply..." value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
        <Button onClick={sendMessage} className="ms-2">Send</Button>
      </Form>

      <Button variant="outline-dark" onClick={() => setShowActions(true)}>⚙ Manage Ticket</Button>
      {showActions && <TicketActions ticketId={ticketId} close={() => setShowActions(false)} />}
    </div>
  );
};

export default TicketDetails;
