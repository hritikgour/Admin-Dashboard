import React, { useState, useMemo } from "react";
import { Card, Button, Row, Col, Form, Pagination, Image } from "react-bootstrap";
import TicketQueue from "./TicketQueue";
import Escalations from "./Escalations";

const PNB_PRIMARY_COLOR = "#950606";
const PNB_ACCENT_COLOR = "#ff9800";

const ComplaintsLayout = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [search, setSearch] = useState("");

  const renderTab = () => {
    if (activeTab === "queue") return <TicketQueue search={search} />;
    if (activeTab === "escalations") return <Escalations search={search} />;
  };

  const summaryData = useMemo(() => ({
    total: 125,
    open: 45,
    highPriority: 18,
    closed: 62
  }), []);

  return (
    <div className="container-fluid p-3 p-md-4 bg-light">
      <style>
        {`
          .pnb-pagination .page-item.active .page-link {
            background-color: ${PNB_PRIMARY_COLOR};
            border-color: ${PNB_PRIMARY_COLOR};
            color: white;
          }
          .pnb-pagination .page-link {
            color: ${PNB_PRIMARY_COLOR};
          }
          .summary-icon {
            font-size: 1.5rem;
          }
        `}
      </style>

      {/* Header Card */}
      <Card className="shadow-sm mb-4">
        <Card.Header
          style={{ backgroundColor: PNB_PRIMARY_COLOR, color: "white" }}
          className="d-flex justify-content-between align-items-center"
        >
          <h4 className="mb-0">📩 Complaints & Supports</h4>
          <div>
            <Button
              variant={activeTab === "queue" ? "light" : "outline-light"}
              onClick={() => setActiveTab("queue")}
              className="me-2"
              style={{
                color: activeTab === "queue" ? PNB_PRIMARY_COLOR : "white",
                fontWeight: "500",
                minWidth: "130px"
              }}
            >
              Ticket Queue
            </Button>
            <Button
              variant={activeTab === "escalations" ? "light" : "outline-light"}
              onClick={() => setActiveTab("escalations")}
              style={{
                color: activeTab === "escalations" ? PNB_PRIMARY_COLOR : "white",
                fontWeight: "500",
                minWidth: "130px"
              }}
            >
              Escalations
            </Button>
          </div>
        </Card.Header>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4 g-3">
        {[
          { title: "Total Tickets", value: summaryData.total, color: PNB_PRIMARY_COLOR, icon: "bi-people-fill" },
          { title: "Open Tickets", value: summaryData.open, color: "#28a745", icon: "bi-folder2-open" },
          { title: "High Priority", value: summaryData.highPriority, color: PNB_ACCENT_COLOR, icon: "bi-exclamation-circle-fill" },
          { title: "Closed Tickets", value: summaryData.closed, color: "gray", icon: "bi-check-circle-fill" },
        ].map((card, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card className="shadow-sm border-0 border-start border-5" style={{ borderColor: card.color }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">{card.title}</h6>
                  <h2 className="fw-bold mb-0">{card.value}</h2>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "1.5rem",
                    backgroundColor: card.color
                  }}
                >
                  <i className={`bi ${card.icon}`}></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table Card */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white p-3">
          <Form.Control
            type="text"
            placeholder="Search by ticket ID, user, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Card.Header>

        <Card.Body className="p-3">{renderTab()}</Card.Body>

        <Card.Footer className="d-flex justify-content-center bg-white p-3">
          <Pagination className="pnb-pagination">
            {[...Array(5)].map((_, i) => (
              <Pagination.Item key={i} active={i === 0}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ComplaintsLayout;
