import React, { useState, useEffect, useMemo, useCallback } from "react";
import { faker } from "@faker-js/faker";
import {
  Button,
  Table,
  Form,
  Badge,
  Pagination,
  Card,
  Row,
  Col,
  ButtonGroup,
  Image,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import UserProfileModal from "./UserProfileModal";

const PNB_PRIMARY_COLOR = "#900603";
const PNB_ACCENT_COLOR = "#ff9800";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const pageSize = 10;

  useEffect(() => {
    const dummyUsers = Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      fatherName: faker.person.fullName(),
      address: faker.location.streetAddress(),
      aadhaar: faker.string.numeric(12),
      pan: faker.string.alphanumeric(10).toUpperCase(),
      account: `XXXX${faker.finance.accountNumber(8)}`,
      type: faker.helpers.arrayElement(["Savings", "Current", "Salary"]),
      balance: formatCurrency(faker.finance.amount({ min: 5000, max: 200000 })),
      status: faker.helpers.arrayElement(["Active", "Pending KYC", "Suspended"]),
      frozen: faker.datatype.boolean(),
      lastLogin: faker.date.recent({ days: 30 }).toISOString(),
      photo: `https://i.pravatar.cc/150?u=${i + 1}`,
      aadhaarFront: `https://dummyimage.com/600x400/cccccc/000000&text=Aadhaar+Front+${i + 1}`,
      aadhaarBack: `https://dummyimage.com/600x400/cccccc/000000&text=Aadhaar+Back+${i + 1}`,
      panCard: `https://dummyimage.com/600x400/cccccc/000000&text=PAN+Card+${i + 1}`,
      signature: `https://dummyimage.com/600x200/cccccc/000000&text=Signature+${i + 1}`,
      documents: [
        {
          name: "Bank Statement",
          url: `https://dummyimage.com/800x600/cccccc/000000&text=Bank+Statement+${i + 1}`,
        },
      ],
    }));
    setUsers(dummyUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    let sortableUsers = [...users].filter((u) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(searchText) ||
        u.email.toLowerCase().includes(searchText) ||
        u.phone.includes(searchText) ||
        u.account.includes(searchText);
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, search, statusFilter, sortConfig]);

  const pagedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const handleSort = useCallback(
    (key) => {
      setSortConfig((prevConfig) => ({
        key,
        direction:
          prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
      }));
    },
    []
  );
  const toggleFreeze = useCallback((userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, frozen: !u.frozen } : u))
    );
  }, []);
  const toggleStatus = useCallback((userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }, []);
  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };
  const sortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up text-muted ms-1"></i>;
    return sortConfig.direction === "asc" ? (
      <i className="bi bi-sort-up ms-1"></i>
    ) : (
      <i className="bi bi-sort-down ms-1"></i>
    );
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };
  const toggleSelectAll = () => {
    if (pagedUsers.length > 0 && pagedUsers.every((u) => selectedIds.has(u.id))) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        pagedUsers.forEach((u) => newSet.delete(u.id));
        return newSet;
      });
    } else {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        pagedUsers.forEach((u) => newSet.add(u.id));
        return newSet;
      });
    }
  };
  const bulkFreeze = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, frozen: true } : u))
    );
    alert(`Frozen ${selectedIds.size} users!`);
  };
  const bulkExport = () => {
    const exportData = users.filter((u) => selectedIds.has(u.id));
    console.log("Exported:", exportData);
    alert(`Exported ${exportData.length} users (check console)`);
  };
  const summaryData = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      frozen: users.filter((u) => u.frozen).length,
      pending: users.filter((u) => u.status === "Pending KYC").length,
    }),
    [users]
  );

  return (
   <div className="container-fluid px-0">  {/* px-0 = remove container padding */}
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
    `}
  </style>

  {/* Header */}
      <div
        className="py-4 text-center shadow-sm"
        style={{ backgroundColor: "#960603" }}
      >
        <h1 className="fw-bold fs-2 text-white">User Management Dashboard</h1>
        
      </div>

  <Card className="shadow-sm px-0 pt-0 w-100">
    
        <Card.Body className="p-3">
          <Row className="mb-4 g-3">
            {[
              { title: "Total Users", value: summaryData.total, icon: "bi-people-fill", color: PNB_PRIMARY_COLOR },
              { title: "Active Users", value: summaryData.active, icon: "bi-person-check-fill", color: "#28a745" },
              { title: "Frozen Accounts", value: summaryData.frozen, icon: "bi-snow", color: "#6c757d" },
              { title: "Pending KYC", value: summaryData.pending, icon: "bi-card-checklist", color: PNB_ACCENT_COLOR },
            ].map((card, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="shadow-sm border-0 border-start border-5" style={{ borderColor: card.color }}>
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-muted">{card.title}</h6>
                      <h2 className="fw-bold mb-0">{card.value}</h2>
                    </div>
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle text-white"
                      style={{ width: "50px", height: "50px", fontSize: "1.5rem", backgroundColor: card.color }}
                    >
                      <i className={`bi ${card.icon}`}></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="border">
            <Card.Header className="bg-white p-3">
              <Row className="align-items-center g-2">
                <Col md={6} lg={5}>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone, account..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Col>
                <Col md={3} lg={2}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Status</option>
                    <option>Active</option>
                    <option>Pending KYC</option>
                    <option>Suspended</option>
                  </Form.Select>
                </Col>
                <Col md={3} lg={5} className="text-md-end">
                  <Button
                    onClick={bulkFreeze}
                    disabled={!selectedIds.size}
                    style={{ backgroundColor: PNB_PRIMARY_COLOR, border: "none" }}
                  >
                    <i className="bi bi-snow me-1"></i>Freeze
                  </Button>{" "}
                  <Button variant="outline-secondary" onClick={bulkExport} disabled={!selectedIds.size}>
                    <i className="bi bi-download me-1"></i>Export
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="p-0">
              <Table hover responsive className="m-0">
                <thead style={{ backgroundColor: PNB_PRIMARY_COLOR, color: "white" }}>
                  <tr>
                    <th className="text-center">
                      <Form.Check
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={pagedUsers.length > 0 && pagedUsers.every((u) => selectedIds.has(u.id))}
                      />
                    </th>
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      User {sortIcon("name")}
                    </th>
                    <th>Email & Phone</th>
                    <th>Account & Type</th>
                    <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                      Status {sortIcon("status")}
                    </th>
                    <th onClick={() => handleSort("lastLogin")} style={{ cursor: "pointer" }}>
                      Last Login {sortIcon("lastLogin")}
                    </th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user) => (
                    <tr key={user.id} className={`align-middle ${user.frozen ? "table-light" : ""}`}>
                      <td className="text-center">
                        <Form.Check type="checkbox" checked={selectedIds.has(user.id)} onChange={() => toggleSelect(user.id)} />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={user.photo}
                            alt={user.name}
                            roundedCircle
                            style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "10px" }}
                          />
                          <span className="fw-bold">{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <div>{user.email}</div>
                        <div className="small text-muted">{user.phone}</div>
                      </td>
                      <td>
                        <div>{user.account}</div>
                        <div className="small text-muted">{user.type}</div>
                      </td>
                      <td>
                        <Badge
                          bg={user.status === "Active" ? "success" : user.status === "Pending KYC" ? "warning" : "danger"}
                          text={user.status === "Pending KYC" ? "dark" : "light"}
                        >
                          {user.status}
                        </Badge>{" "}
                        {user.frozen && <Badge bg="secondary">Frozen</Badge>}
                      </td>
                      <td>{new Date(user.lastLogin).toLocaleDateString("en-GB")}</td>
                      <td className="text-center">
                        <ButtonGroup size="sm">
                          <Button variant="outline-secondary" onClick={() => setSelectedUser(user)}>
                            <i className="bi bi-eye-fill"></i>
                          </Button>
                          <Button variant={user.frozen ? "success" : "danger"} onClick={() => toggleFreeze(user.id)}>
                            {user.frozen ? "Unfreeze" : "Freeze"}
                          </Button>
                          <Button variant={user.status === "Active" ? "warning" : "info"} onClick={() => toggleStatus(user.id, user.status)}>
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-center p-3 bg-white">
              <Pagination className="pnb-pagination">
                {[...Array(totalPages).keys()].map((num) => (
                  <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                    {num + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Card.Footer>
          </Card>
        </Card.Body>
      </Card>

      {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdate={handleUpdateUser} />}
    </div>
  );
}
