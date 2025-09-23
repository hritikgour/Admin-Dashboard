import React from "react";
import { Table, Button } from "react-bootstrap";

const TicketTable = ({ tickets, onView }) => (
  <Table striped bordered hover responsive>
    <thead>
      <tr><th>#</th><th>User</th><th>Subject</th><th>Priority</th><th>Status</th><th>SLA</th><th>Actions</th></tr>
    </thead>
    <tbody>
      {tickets.map((t, i) => (
        <tr key={t.id}>
          <td>{i + 1}</td>
          <td>{t.user}</td>
          <td>{t.subject}</td>
          <td>
            <span className={`badge ${t.priority === "High" ? "bg-danger" : t.priority === "Medium" ? "bg-warning text-dark" : "bg-success"}`}>{t.priority}</span>
          </td>
          <td>{t.status}</td>
          <td>{t.sla}</td>
          <td><Button size="sm" variant="info" onClick={() => onView(t.id)}>View</Button></td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TicketTable;
