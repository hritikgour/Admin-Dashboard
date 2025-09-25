import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import TicketQueue from "./TicketQueue";
import Escalations from "./Escalations";
import TicketDetails from "./TicketDetails";
import { getTickets } from "../services/ticketService";

const PNB_PRIMARY_COLOR = "#900603";
const PNB_ACCENT_COLOR = "#ff9800";

export default function ComplaintsLayout() {
  const [activeTab, setActiveTab] = useState("queue");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  const summaryData = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    highPriority: tickets.filter(t => t.priority === "High").length,
    closed: tickets.filter(t => t.status === "Closed").length
  }), [tickets]);

  const renderTab = () => {
    if (selectedTicket) {
      return <TicketDetails ticketId={selectedTicket} goBack={() => setSelectedTicket(null)} />;
    }
    if (activeTab === "queue") return <TicketQueue tickets={tickets} search={search} onView={setSelectedTicket} />;
    if (activeTab === "escalations") return <Escalations tickets={tickets} search={search} onView={setSelectedTicket} />;
  };

  const summaryCards = [
    { title:"Total Tickets", value:summaryData.total, color:PNB_PRIMARY_COLOR, icon:"bi-people-fill" },
    { title:"Open Tickets", value:summaryData.open, color:"#28a745", icon:"bi-folder2-open" },
    { title:"High Priority", value:summaryData.highPriority, color:PNB_ACCENT_COLOR, icon:"bi-exclamation-circle-fill" },
    { title:"Closed Tickets", value:summaryData.closed, color:"gray", icon:"bi-check-circle-fill" }
  ];

  return (
    <div className="bg-light">

      {/* Full-width Header */}
      <div className="w-100" style={{ backgroundColor: PNB_PRIMARY_COLOR }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 py-4 px-4 text-white container-fluid">
          <h4 className="mb-2 mb-md-0">📩 Complaints & Supports</h4>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={activeTab==="queue"?"light":"outline-light"}
              onClick={()=>{setSelectedTicket(null);setActiveTab("queue");}}
              className={activeTab==="queue" ? "text-dark" : "text-white"}
            >
              Ticket Queue
            </Button>
            <Button
              variant={activeTab==="escalations"?"light":"outline-light"}
              onClick={()=>{setSelectedTicket(null);setActiveTab("escalations");}}
              className={activeTab==="escalations" ? "text-dark" : "text-white"}
            >
              Escalations
            </Button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container-fluid p-3 p-md-4">

        {/* Summary Cards */}
        {!selectedTicket && (
          <Row className="mb-4 g-3">
            {summaryCards.map((card, idx) => (
              <Col xs={12} sm={6} lg={3} key={idx}>
                <Card className={`shadow-sm border-0 border-start border-5`} style={{ borderColor: card.color }}>
                  <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <h6 className="text-muted">{card.title}</h6>
                      <h2 className="fw-bold mb-0">{card.value}</h2>
                    </div>
                    <div className="d-flex align-items-center justify-content-center rounded-circle text-white" 
                         style={{ backgroundColor: card.color, width: "50px", height: "50px", fontSize: "1.5rem" }}>
                      <i className={`bi ${card.icon}`}></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Table / Details */}
        <Card className="shadow-sm">
          {!selectedTicket && (
            <Card.Header className="bg-white p-3">
              <Form.Control
                type="text"
                placeholder="Search by Ticket ID / Username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </Card.Header>
          )}
          <Card.Body className="p-0 table-responsive">
            {renderTab()}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
