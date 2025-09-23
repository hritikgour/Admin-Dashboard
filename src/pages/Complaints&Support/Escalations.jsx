import React, { useEffect, useState } from "react";
import { Table, Badge, Spinner, Card } from "react-bootstrap";
import { getTickets } from "./services/ticketService";

const PNB_PRIMARY_COLOR = "#950606";
const PNB_ACCENT_COLOR = "#ff9800";

const Escalations = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const data = await getTickets();
      setTickets(data.filter((t) => t.priority === "High"));
      setLoading(false);
    };
    fetchTickets();
  }, []);

  if (loading) 
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ color: PNB_PRIMARY_COLOR }} />
      </div>
    );

  return (
    <Card className="shadow-sm border">
      <Card.Body className="p-0">
        <Table hover responsive className="m-0">
          <thead style={{ backgroundColor: PNB_PRIMARY_COLOR, color: "white" }}>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Status</th>
              <th>SLA</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="align-middle">
                <td>{t.id}</td>
                <td>{t.user}</td>
                <td>{t.subject}</td>
                <td>
                  <Badge
                    bg={
                      t.status === "Open"
                        ? "danger"
                        : t.status === "In Progress"
                        ? "warning"
                        : "success"
                    }
                    text={t.status === "In Progress" ? "dark" : "light"}
                    className="py-1 px-2"
                  >
                    {t.status}
                  </Badge>
                </td>
                <td>{t.sla}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Escalations;
