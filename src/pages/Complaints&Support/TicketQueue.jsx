import React, { useState, useEffect, useMemo, useCallback } from "react";
import { faker } from "@faker-js/faker";
import { Table, Button, Badge, Card, Row, Col, Pagination, ButtonGroup, Image, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const PNB_PRIMARY_COLOR = "#950606";
const PNB_ACCENT_COLOR = "#ff9800";

export default function TicketQueue({ search }) {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const pageSize = 10;

  useEffect(() => {
    const dummyTickets = Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      user: faker.person.fullName(),
      email: faker.internet.email(),
      ticketId: `TCKT-${1000 + i}`,
      subject: faker.lorem.sentence(),
      priority: faker.helpers.arrayElement(["Low", "Medium", "High"]),
      status: faker.helpers.arrayElement(["Open", "In Progress", "Closed"]),
      lastUpdate: faker.date.recent({ days: 10 }).toISOString(),
    }));
    setTickets(dummyTickets);
  }, []);

  const filteredTickets = useMemo(() => {
    const searchText = search.toLowerCase();
    return tickets.filter(
      (t) =>
        t.user.toLowerCase().includes(searchText) ||
        t.ticketId.toLowerCase().includes(searchText) ||
        t.status.toLowerCase().includes(searchText)
    );
  }, [tickets, search]);

  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-0">
        <Table hover responsive className="m-0">
          <thead style={{ backgroundColor: PNB_PRIMARY_COLOR, color: "white" }}>
            <tr>
              <th className="text-center">
                <Form.Check
                  type="checkbox"
                  onChange={() =>
                    pagedTickets.every((t) => selectedIds.has(t.id))
                      ? setSelectedIds((prev) => {
                          const newSet = new Set(prev);
                          pagedTickets.forEach((t) => newSet.delete(t.id));
                          return newSet;
                        })
                      : setSelectedIds((prev) => {
                          const newSet = new Set(prev);
                          pagedTickets.forEach((t) => newSet.add(t.id));
                          return newSet;
                        })
                  }
                  checked={pagedTickets.length > 0 && pagedTickets.every((t) => selectedIds.has(t.id))}
                />
              </th>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Last Update</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedTickets.map((ticket) => (
              <tr key={ticket.id} className="align-middle">
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={selectedIds.has(ticket.id)}
                    onChange={() => toggleSelect(ticket.id)}
                  />
                </td>
                <td>{ticket.ticketId}</td>
                <td>{ticket.user}</td>
                <td>{ticket.subject}</td>
                <td>
                  <Badge
                    bg={ticket.priority === "High" ? "danger" : ticket.priority === "Medium" ? "warning" : "success"}
                    text={ticket.priority === "Medium" ? "dark" : "light"}
                  >
                    {ticket.priority}
                  </Badge>
                </td>
                <td>
                  <Badge
                    bg={ticket.status === "Open" ? "success" : ticket.status === "In Progress" ? "warning" : "secondary"}
                  >
                    {ticket.status}
                  </Badge>
                </td>
                <td>{new Date(ticket.lastUpdate).toLocaleDateString("en-GB")}</td>
                <td className="text-center">
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary">
                      <i className="bi bi-eye-fill"></i>
                    </Button>
                    <Button variant="warning">
                      <i className="bi bi-arrow-up-right-square"></i>
                    </Button>
                    <Button variant="danger">
                      <i className="bi bi-check-lg"></i>
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-center bg-white p-3">
        <Pagination className="pnb-pagination">
          {[...Array(Math.ceil(filteredTickets.length / pageSize)).keys()].map((num) => (
            <Pagination.Item key={num} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
              {num + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Card.Footer>
    </Card>
  );
}
