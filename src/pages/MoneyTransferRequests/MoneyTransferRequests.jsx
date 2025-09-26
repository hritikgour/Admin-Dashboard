import React, { useState, useEffect } from "react";
import "./MoneyTransferRequests.css";

const MoneyTransferRequests = () => {
  const [requests, setRequests] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("transfers");

  // Mock data
  useEffect(() => {
    setRequests([
      {
        id: "REQ001",
        date: "2025-09-16 10:32 AM",
        senderName: "Amit Sharma",
        senderAcc: "1234567890",
        receiverName: "Rahul Verma",
        receiverAcc: "9876543210",
        amount: 25000,
        currency: "INR",
        method: "NEFT",
        status: "Pending",
      },
      {
        id: "REQ002",
        date: "2025-09-15 02:45 PM",
        senderName: "Sanya Kapoor",
        senderAcc: "2223334445",
        receiverName: "Arjun Mehta",
        receiverAcc: "9998887776",
        amount: 5000,
        currency: "INR",
        method: "UPI",
        status: "Approved",
      },
    ]);

    setOutgoing([
      {
        id: "OUT001",
        date: "2025-09-20",
        beneficiary: "Neha Singh",
        amount: 12000,
        currency: "INR",
        type: "Scheduled",
      },
      {
        id: "OUT002",
        date: "2025-09-21",
        beneficiary: "Vikram Rao",
        amount: 7500,
        currency: "INR",
        type: "Queued",
      },
    ]);

    setIncoming([
      {
        id: "IN001",
        date: "2025-09-19",
        sender: "Global Corp Ltd.",
        amount: 500000,
        currency: "INR",
        review: "Pending",
      },
      {
        id: "IN002",
        date: "2025-09-18",
        sender: "Overseas Bank",
        amount: 250000,
        currency: "INR",
        review: "Approved",
      },
    ]);

    setBeneficiaries([
      {
        id: "BENE001",
        name: "Ravi Sharma",
        account: "5551112223",
        bank: "HDFC Bank",
        status: "Pending",
      },
      {
        id: "BENE002",
        name: "Meena Kumari",
        account: "7778889991",
        bank: "ICICI Bank",
        status: "Approved",
      },
    ]);

    setBills([
      {
        id: "BILL001",
        date: "2025-09-17",
        biller: "Electricity Board",
        amount: 3500,
        currency: "INR",
        status: "Pending",
      },
      {
        id: "BILL002",
        date: "2025-09-16",
        biller: "Mobile Operator",
        amount: 899,
        currency: "INR",
        status: "Approved",
      },
    ]);
  }, []);

  // Action handler for all entities
  const handleAction = (id, action, type) => {
    if (type === "request") {
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: action } : req))
      );
    } else if (type === "incoming") {
      setIncoming((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, review: action } : inc))
      );
    } else if (type === "beneficiary") {
      setBeneficiaries((prev) =>
        prev.map((bene) => (bene.id === id ? { ...bene, status: action } : bene))
      );
    } else if (type === "bill") {
      setBills((prev) =>
        prev.map((bill) => (bill.id === id ? { ...bill, status: action } : bill))
      );
    }
  };

  // Filtering transfers
  const filteredRequests = requests.filter((req) => {
    const q = search.toLowerCase();
    const matchesSearch =
      req.senderName.toLowerCase().includes(q) ||
      req.receiverName.toLowerCase().includes(q) ||
      req.id.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
<>
   {/* Header */}
      <div
        className="py-4 text-center shadow-sm"
        style={{ backgroundColor: "#960603" }}
      >
        <h1 className="fw-bold fs-2 text-white"> Money Transfer Request</h1>
        
      </div>



    <div className="container">
 
 

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "transfers" ? "active" : ""}
          onClick={() => setActiveTab("transfers")}
        >
          Money Transfers
        </button>
        <button
          className={activeTab === "outgoing" ? "active" : ""}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing Transfers
        </button>
        <button
          className={activeTab === "incoming" ? "active" : ""}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming Transfers
        </button>
        <button
          className={activeTab === "beneficiaries" ? "active" : ""}
          onClick={() => setActiveTab("beneficiaries")}
        >
          Beneficiary Management
        </button>
        <button
          className={activeTab === "bills" ? "active" : ""}
          onClick={() => setActiveTab("bills")}
        >
          Bill Payments
        </button>
      </div>

      {/* Transfers Tab */}
      {activeTab === "transfers" && (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by ID, Sender, Receiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Date</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.date}</td>
                      <td>
                        {req.senderName}
                        <br />
                        <span className="small">{req.senderAcc}</span>
                      </td>
                      <td>
                        {req.receiverName}
                        <br />
                        <span className="small">{req.receiverAcc}</span>
                      </td>
                      <td>
                        {req.currency} {req.amount.toLocaleString()}
                      </td>
                      <td>{req.method}</td>
                      <td>
                        <span
                          className={`status ${
                            req.status === "On Hold"
                              ? "on-hold"
                              : req.status.toLowerCase()
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleAction(req.id, "Approved", "request")
                          }
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleAction(req.id, "Rejected", "request")
                          }
                        >
                          Reject
                        </button>
                        <button
                          onClick={() =>
                            handleAction(req.id, "On Hold", "request")
                          }
                        >
                          Hold
                        </button>
                        <button
                          onClick={() =>
                            handleAction(req.id, "Pending", "request")
                          }
                        >
                          Pending
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">
                      No requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Outgoing Transfers */}
      {activeTab === "outgoing" && (
        <div className="table-card">
          <h2>Queued / Scheduled Outgoing Transfers</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.beneficiary}</td>
                  <td>
                    {o.currency} {o.amount.toLocaleString()}
                  </td>
                  <td>{o.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Incoming Transfers */}
      {activeTab === "incoming" && (
        <div className="table-card">
          <h2>Large Incoming Transfers Requiring Review</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Amount</th>
                <th>Review Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map((i) => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.date}</td>
                  <td>{i.sender}</td>
                  <td>
                    {i.currency} {i.amount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        i.review === "On Hold" ? "on-hold" : i.review.toLowerCase()
                      }`}
                    >
                      {i.review}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAction(i.id, "Approved", "incoming")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(i.id, "Rejected", "incoming")}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(i.id, "On Hold", "incoming")}
                    >
                      Hold
                    </button>
                    <button
                      onClick={() => handleAction(i.id, "Pending", "incoming")}
                    >
                      Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Beneficiary Management Section */}
      {activeTab === "beneficiaries" && (
        <div className="table-card">
          <h2>Beneficiary Management</h2>
          <table>
            <thead>
              <tr>
                <th>Beneficiary ID</th>
                <th>Name</th>
                <th>Account</th>
                <th>Bank</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length > 0 ? (
                beneficiaries.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.account}</td>
                    <td>{b.bank}</td>
                    <td>
                      <span
                        className={`status ${
                          b.status === "On Hold"
                            ? "on-hold"
                            : b.status.toLowerCase()
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAction(b.id, "Approved", "beneficiary")}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(b.id, "Rejected", "beneficiary")}
                      >
                        Blacklist
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No beneficiaries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bill Payments */}
      {activeTab === "bills" && (
        <div className="table-card">
          <h2>Bill Payments & Reconciliation</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Biller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.date}</td>
                  <td>{b.biller}</td>
                  <td>
                    {b.currency} {b.amount.toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        b.status === "On Hold" ? "on-hold" : b.status.toLowerCase()
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAction(b.id, "Approved", "bill")}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(b.id, "Rejected", "bill")}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(b.id, "On Hold", "bill")}
                    >
                      Hold
                    </button>
                    <button
                      onClick={() => handleAction(b.id, "Pending", "bill")}
                    >
                      Pending
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default MoneyTransferRequests;
