import React, { useMemo, useState } from "react";
import { Table, Badge, Button, ButtonGroup, Pagination } from "react-bootstrap";

const PNB_PRIMARY_COLOR = "#950606";
const PNB_ACCENT_COLOR = "#ff9800";

export default function TicketQueue({ tickets, search, onView, onUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredTickets = useMemo(() => {
    const text = search.toLowerCase();
    return tickets.filter(t =>
      t.user.toLowerCase().includes(text) ||
      t.ticketId.toLowerCase().includes(text)
    );
  }, [tickets, search]);

  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage]);

  return (
    <>
      <Table hover responsive>
        <thead style={{ backgroundColor: PNB_PRIMARY_COLOR, color: "white" }}>
          <tr>
            <th>Ticket ID</th>
            <th>User</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedTickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.ticketId}</td>
              <td>{ticket.user}</td>
              <td>{ticket.subject}</td>
              <td>
                <Badge bg={ticket.priority === "High" ? "danger" : ticket.priority === "Medium" ? "warning" : "success"}>
                  {ticket.priority}
                </Badge>
              </td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.lastUpdate).toLocaleDateString()}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button variant="info" onClick={() => onView(ticket.id)}>
                    View
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="pnb-pagination justify-content-center">
        {[...Array(Math.ceil(filteredTickets.length / pageSize)).keys()].map(num => (
          <Pagination.Item key={num} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
}
