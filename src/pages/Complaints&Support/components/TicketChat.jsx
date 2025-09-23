import React, { useState } from "react";
import { Button, Form, ListGroup, Card } from "react-bootstrap";

const TicketChat = ({ ticket, onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSendMessage(ticket.id, message);
      setMessage("");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <strong>Conversation with {ticket.user}</strong>
      </Card.Header>
      <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <ListGroup variant="flush">
          {ticket.conversation.map((msg, index) => (
            <ListGroup.Item
              key={index}
              className={`d-flex justify-content-${
                msg.from === "admin" ? "end" : "start"
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.from === "admin"
                    ? "bg-primary text-white"
                    : "bg-light border"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <small>{msg.text}</small>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {msg.time}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <Form className="d-flex">
          <Form.Control
            type="text"
            placeholder="Type a reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="primary" className="ms-2" onClick={handleSend}>
            Send
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default TicketChat;
