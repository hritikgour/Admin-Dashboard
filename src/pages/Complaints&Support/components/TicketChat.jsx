import React, { useState } from "react";
import { Card, ListGroup, Form, Button } from "react-bootstrap";

export default function TicketChat({ ticket, onSendMessage }) {
  const [msg, setMsg] = useState("");

  const send = () => {
    if(msg.trim()==="") return;
    onSendMessage(ticket.id, msg);
    setMsg("");
  }

  return (
    <Card className="my-2">
      <Card.Header>Conversation with {ticket.user}</Card.Header>
      <Card.Body style={{ maxHeight: "200px", overflowY: "auto" }}>
        <ListGroup variant="flush">
          {ticket.messages.map((m,i)=>(
            <ListGroup.Item key={i} className={m.sender==="User"?"":"text-end bg-light"}>
              <b>{m.sender}:</b> {m.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="d-flex">
        <Form.Control type="text" placeholder="Type reply..." value={msg} onChange={e=>setMsg(e.target.value)} />
        <Button className="ms-2" onClick={send}>Send</Button>
      </Card.Footer>
    </Card>
  );
}
