import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBoxOpen, FaChartBar, FaExchangeAlt, FaCog, FaKey } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * InvestmentPanel.jsx
 *
 * Single-file admin panel covering:
 * - Product Catalog
 * - Subscriptions / Redemptions
 * - Portfolio Reports
 * - Service Requests
 * - API Keys & Integrations
 *
 * Theme color used: #900603
 *
 * NOTE: This is demo/sample code and uses localStorage for persistence.
 */

const THEME = "#900603";

// tiny id generator
const uid = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.floor(Math.random()*1000)}`;

const sampleProducts = [
  { id: "P-MF-001", name: "Mutual Fund A", type: "Mutual Fund", risk: "Moderate", nav: 125.43, aum: 5000000, description: "Diversified equity fund", createdAt: "2024-01-10" },
  { id: "P-BND-001", name: "Govt Bond 2025", type: "Bond", risk: "Low", nav: 100.00, aum: 20000000, description: "Government security", createdAt: "2023-11-05" },
];

const sampleSubscriptions = [
  { id: "S-001", user: "Rahul Sharma", productId: "P-MF-001", productName: "Mutual Fund A", action: "Subscribe", amount: 100000, status: "Pending", date: "2025-09-01", audit: [{id:1,action:"Created",user:"System",date:"2025-09-01",remark:"Manual request"}] },
  { id: "S-002", user: "Priya Singh", productId: "P-BND-001", productName: "Govt Bond 2025", action: "Redeem", amount: 50000, status: "Pending", date: "2025-09-03", audit: [] },
];

const sampleServiceRequests = [
  { id: "SR-001", merchant: "Acme Pay", type: "Onboarding", status: "Pending", details: "Merchant wants to onboard for biller integration", date: "2025-09-05", audit: [] },
];

const sampleApiKeys = [
  { id: "K-1", name: "Payments-Gateway", keyHash: "****-****-1234", active: true, createdAt: "2025-06-10" },
];

function saveLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch {
    return fallback;
  }
}

export default function InvestmentPanel() {
  // Data states with localStorage persistence
  const [products, setProducts] = useState(() => loadLS("ip_products", sampleProducts));
  const [requests, setRequests] = useState(() => loadLS("ip_subscriptions", sampleSubscriptions));
  const [services, setServices] = useState(() => loadLS("ip_services", sampleServiceRequests));
  const [apiKeys, setApiKeys] = useState(() => loadLS("ip_apikeys", sampleApiKeys));

  // UI / navigation
  const [page, setPage] = useState("catalog"); // catalog / subs / reports / services / apikeys
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All"); // used on catalog or lists
  const [sort, setSort] = useState("latest");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 6;

  // modals / forms
  const [productEditor, setProductEditor] = useState(null); // object to edit or null
  const [viewItem, setViewItem] = useState(null); // product / request / service being viewed
  const [subsEditor, setSubsEditor] = useState(null); // for manual create
  const [serviceEditor, setServiceEditor] = useState(null);

  // persist changes
  useEffect(() => saveLS("ip_products", products), [products]);
  useEffect(() => saveLS("ip_subscriptions", requests), [requests]);
  useEffect(() => saveLS("ip_services", services), [services]);
  useEffect(() => saveLS("ip_apikeys", apiKeys), [apiKeys]);

  // ---------- Product Catalog functions ----------
  function addOrUpdateProduct(payload) {
    if (!payload.name || !payload.type) return;
    if (payload.id) {
      // update
      setProducts((prev) => prev.map((p) => (p.id === payload.id ? { ...p, ...payload } : p)));
    } else {
      const newP = { ...payload, id: uid("P-"), createdAt: new Date().toISOString().slice(0,10) };
      setProducts((prev) => [newP, ...prev]);
    }
    setProductEditor(null);
  }

  function deleteProduct(id) {
    if (!confirm("Delete product? This will remove it permanently.")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // also remove subscriptions referencing productName? we will keep them but note mismatch
  }

  // ---------- Subscriptions / Redemptions ----------
  function createSubscription(req) {
    const newReq = {
      id: uid("S-"),
      ...req,
      status: "Pending",
      date: new Date().toISOString().slice(0,10),
      audit: [{ id: 1, action: "Created", user: "Admin", date: new Date().toLocaleString(), remark: "Manual create" }],
    };
    setRequests((prev) => [newReq, ...prev]);
    setSubsEditor(null);
  }

  function processSubscription(id, action) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: action,
              audit: [...r.audit, { id: r.audit.length + 1, action, user: "Manager", date: new Date().toLocaleString(), remark: `${action} by Manager` }],
            }
          : r
      )
    );
  }

  function bulkProcessSubscriptions(ids, action) {
    setRequests((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status: action, audit: [...r.audit, { id: r.audit.length + 1, action, user: "Admin", date: new Date().toLocaleString(), remark: `Bulk ${action}` }] } : r)));
  }

  // ---------- Service Requests ----------
  function processServiceRequest(id, action) {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: action, audit: [...s.audit, { id: s.audit.length + 1, action, user: "Admin", date: new Date().toLocaleString(), remark: `${action} by Admin` }] } : s
      )
    );
  }

  function createServiceRequest(payload) {
    const newS = { id: uid("SR-"), status: "Pending", date: new Date().toISOString().slice(0,10), audit: [{ id: 1, action: "Created", user: "Admin", date: new Date().toLocaleString(), remark: "Manual create" }], ...payload };
    setServices((prev) => [newS, ...prev]);
    setServiceEditor(null);
  }

  // ---------- API Keys ----------
  function generateApiKey(name) {
    if (!name) return;
    // generate secure-ish key
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    const key = Array.from(arr, (b) => ("0" + b.toString(16)).slice(-2)).join("") + "-" + Math.round(Math.random()*9999);
    const item = { id: uid("K-"), name, keyShown: key, keyHash: `****-${key.slice(-4)}`, active: true, createdAt: new Date().toISOString().slice(0,10) };
    // store only masked/hash so "keyShown" can be displayed once by caller & then removed
    setApiKeys((prev) => [{ ...item, keyShown: undefined, keyHash: item.keyHash }, ...prev]); // we will return key to UI separately
    return key;
  }

  function revokeKey(id) {
    if (!confirm("Revoke this API key?")) return;
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, active: false, audit: [...(k.audit||[]), { id: (k.audit||[]).length+1, action: "Revoked", user: "Admin", date: new Date().toLocaleString(), remark: "Revoked by admin" }] } : k)));
  }

  // ---------- Reports (simple derived analytics) ----------
  function computeProductAllocations() {
    // aggregate AUM from products as sample chart
    return products.map((p) => ({ name: p.name, value: p.aum || 0 }));
  }
  function computeTopUsers() {
    // derive from requests: sum amounts per user (subscriptions)
    const m = {};
    requests.forEach((r) => {
      if (r.action === "Subscribe" || r.action === "Subscription" || r.action === "Subscribe") {
        m[r.user] = (m[r.user] || 0) + (r.amount || 0);
      }
    });
    // fallback sample:
    if (Object.keys(m).length === 0) {
      return [{ name: "Rahul Sharma", value: 100000 }, { name: "Priya Singh", value: 50000 }];
    }
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }

  // ---------- Export CSV helper ----------
  function exportCSV(filename, rows) {
    if (!rows || rows.length === 0) {
      alert("Nothing to export");
      return;
    }
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(",")].concat(rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Pagination utilities ----------
  function pageSlice(arr) {
    const start = (pageNo - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  }

  // ---------- UI small helpers ----------
  function statusClass(s) {
    if (s === "Pending") return "text-warning fw-bold";
    if (s === "Resolved" || s === "Approved" || s === "Completed") return "text-success fw-bold";
    if (s === "Escalated" || s === "Rejected" || s === "Flagged") return "text-danger fw-bold";
    return "";
  }

  // ---------- Render panels ----------
  return (
    <div className="min-vh-100 bg-light">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg py-4" style={{ backgroundColor: THEME }}>
        <div className="container-fluid">
          <a className="navbar-brand text-white fw-bold" href="#">Neo Bank — Investment & Integrations</a>
          <div className="d-flex ms-auto">
            <button className="btn btn-sm btn-outline-light me-2" onClick={() => { setPage("reports"); setPageNo(1); }}>Reports</button>
            <button className="btn btn-sm btn-outline-light" onClick={() => { setPage("catalog"); setPageNo(1); }}>Catalog</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold" style={{ color: THEME }}>Modules</h5>
                <ul className="list-group list-group-flush">
  <button
    className={`list-group-item list-group-item-action ${page === "catalog" ? "active" : ""}`}
    style={{
      backgroundColor: page === "catalog" ? "#900603" : "",
      color: page === "catalog" ? "white" : "",
      borderColor: page === "catalog" ? "#900603" : ""
    }}
    onClick={() => { setPage("catalog"); setPageNo(1); }}
  >
    <FaBoxOpen className="me-2" /> Product Catalog
  </button>

  <button
    className={`list-group-item list-group-item-action ${page === "subscriptions" ? "active" : ""}`}
    style={{
      backgroundColor: page === "subscriptions" ? "#900603" : "",
      color: page === "subscriptions" ? "white" : "",
      borderColor: page === "subscriptions" ? "#900603" : ""
    }}
    onClick={() => { setPage("subscriptions"); setPageNo(1); }}
  >
    <FaExchangeAlt className="me-2" /> Subscriptions/Redemptions
  </button>

  <button
    className={`list-group-item list-group-item-action ${page === "reports" ? "active" : ""}`}
    style={{
      backgroundColor: page === "reports" ? "#900603" : "",
      color: page === "reports" ? "white" : "",
      borderColor: page === "reports" ? "#900603" : ""
    }}
    onClick={() => { setPage("reports"); setPageNo(1); }}
  >
    <FaChartBar className="me-2" /> Portfolio Reports
  </button>

  <button
    className={`list-group-item list-group-item-action ${page === "services" ? "active" : ""}`}
    style={{
      backgroundColor: page === "services" ? "#900603" : "",
      color: page === "services" ? "white" : "",
      borderColor: page === "services" ? "#900603" : ""
    }}
    onClick={() => { setPage("services"); setPageNo(1); }}
  >
    <FaCog className="me-2" /> Service Requests
  </button>

  <button
    className={`list-group-item list-group-item-action ${page === "apikeys" ? "active" : ""}`}
    style={{
      backgroundColor: page === "apikeys" ? "#900603" : "",
      color: page === "apikeys" ? "white" : "",
      borderColor: page === "apikeys" ? "#900603" : ""
    }}
    onClick={() => { setPage("apikeys"); setPageNo(1); }}
  >
    <FaKey className="me-2" /> API Keys & Integrations
  </button>
</ul>


                <hr />
                <div>
                  <h6 className="mb-1">Quick Actions</h6>
                  <button className="btn btn-sm btn-outline-primary me-2 mb-2" onClick={() => { setProductEditor({}); }}>Add Product</button>
                  <button className="btn btn-sm btn-outline-success me-2 mb-2" onClick={() => setSubsEditor({ action: "Subscribe" })}>New Subscription</button>
                  <button className="btn btn-sm btn-outline-secondary mb-2" onClick={() => setServiceEditor({})}>New Service Req</button>
                </div>
              </div>
            </div>

            {/* simple stats card */}
            <div className="card mt-3 shadow-sm">
              <div className="card-body">
                <h6>Stats</h6>
                <p className="mb-1">Products: <strong>{products.length}</strong></p>
                <p className="mb-1">Pending Requests: <strong>{requests.filter(r=>r.status==="Pending").length}</strong></p>
                <p className="mb-1">Service Requests: <strong>{services.filter(s=>s.status==="Pending").length}</strong></p>
                <p className="mb-1">API Keys: <strong>{apiKeys.filter(k=>k.active).length}</strong></p>
                <button className="btn btn-sm btn-outline-dark mt-2" onClick={() => {
                  // reset sample
                  if (!confirm("Reset sample data?")) return;
                  setProducts(sampleProducts);
                  setRequests(sampleSubscriptions);
                  setServices(sampleServiceRequests);
                  setApiKeys(sampleApiKeys);
                }}>Reset Sample</button>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="col-md-9">
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Header for current page */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 style={{ color: THEME, margin:0 }}>
                    {page === "catalog" && "Product Catalog"}
                    {page === "subscriptions" && "Subscriptions / Redemptions"}
                    {page === "reports" && "Portfolio Reports"}
                    {page === "services" && "Service Requests"}
                    {page === "apikeys" && "API Keys & Integrations"}
                  </h4>

                  <div className="d-flex gap-2">
                    <input className="form-control form-control-sm" style={{ minWidth: 220 }} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
                    <select className="form-select form-select-sm" style={{ width: 140 }} value={filterType} onChange={e=>setFilterType(e.target.value)}>
                      <option value="All">All Types</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                      <option value="Bond">Bond</option>
                      <option value="Subscribe">Subscribe</option>
                      <option value="Redeem">Redeem</option>
                      <option value="Onboarding">Onboarding</option>
                    </select>
                    <select className="form-select form-select-sm" style={{ width: 140 }} value={sort} onChange={e=>setSort(e.target.value)}>
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                      <option value="nameasc">Name A→Z</option>
                    </select>
                  </div>
                </div>

                {/* PAGE CONTENT */}
                {/* --------- CATALOG --------- */}
                {page === "catalog" && (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered align-middle">
                        <thead className="table-light text-center">
                          <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Risk</th>
                            <th>NAV</th>
                            <th>AUM</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageSlice(
                            products
                              .filter(p => (filterType === "All" ? true : p.type === filterType) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())))
                              .sort((a,b) => {
                                if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
                                if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
                                if (sort === "nameasc") return a.name.localeCompare(b.name);
                                return 0;
                              })
                          ).map((p) => (
                            <tr key={p.id}>
                              <td className="text-center">{p.id}</td>
                              <td>{p.name}</td>
                              <td>{p.type}</td>
                              <td className="text-center">{p.risk}</td>
                              <td className="text-end">₹ {Number(p.nav).toFixed(2)}</td>
                              <td className="text-end">₹ {Number(p.aum || 0).toLocaleString()}</td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>setViewItem({ type:"product", data:p })}>View</button>
                                <button className="btn btn-sm btn-outline-success me-1" onClick={()=>setProductEditor(p)}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteProduct(p.id)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* pagination */}
                    <div className="d-flex justify-content-between align-items-center">
                      <small>Showing {Math.min(products.length, (pageNo*pageSize))} of {products.length} products</small>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" disabled={pageNo===1} onClick={()=>setPageNo(n=>n-1)}>Prev</button>
                        <button className="btn btn-sm btn-outline-secondary" disabled={pageNo*pageSize >= products.length} onClick={()=>setPageNo(n=>n+1)}>Next</button>
                      </div>
                    </div>
                  </>
                )}

                {/* --------- SUBSCRIPTIONS / REDEMPTIONS --------- */}
                {page === "subscriptions" && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => { setSubsEditor({ action: "Subscribe" }); }}>New Subscribe</button>
                        <button className="btn btn-sm btn-secondary me-2" onClick={() => { setSubsEditor({ action: "Redeem" }); }}>New Redeem</button>
                        <button className="btn btn-sm btn-outline-success me-2" onClick={() => exportCSV("subscriptions.csv", requests)}>Export CSV</button>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-success me-2" onClick={() => { const ids = requests.filter(r=>r.status==="Pending").map(r=>r.id); bulkProcessSubscriptions(ids,"Approved"); }}>Approve All Pending</button>
                        <button className="btn btn-sm btn-danger" onClick={() => { const ids = requests.filter(r=>r.status==="Pending").map(r=>r.id); bulkProcessSubscriptions(ids,"Rejected"); }}>Reject All Pending</button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light text-center">
                          <tr>
                            <th>Req ID</th>
                            <th>User</th>
                            <th>Product</th>
                            <th>Action</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageSlice(
                            requests
                              .filter(r => (filterType==="All" ? true : r.action === filterType) && (r.user.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())))
                              .sort((a,b) => sort === "latest" ? new Date(b.date)-new Date(a.date) : new Date(a.date)-new Date(b.date))
                          ).map(r => (
                            <tr key={r.id}>
                              <td className="text-center">{r.id}</td>
                              <td>{r.user}</td>
                              <td>{r.productName}</td>
                              <td className="text-center">{r.action}</td>
                              <td className="text-end">₹ {Number(r.amount).toLocaleString()}</td>
                              <td className="text-center">{r.status}</td>
                              <td className="text-center">{r.date}</td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>setViewItem({ type:"request", data:r })}>View</button>
                                {r.status==="Pending" && <button className="btn btn-sm btn-success me-1" onClick={()=>processSubscription(r.id,"Approved")}>Approve</button>}
                                {r.status==="Pending" && <button className="btn btn-sm btn-danger" onClick={()=>processSubscription(r.id,"Rejected")}>Reject</button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* --------- REPORTS --------- */}
                {page === "reports" && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-body" style={{ minHeight: 300 }}>
                            <h6>Product Allocations (AUM)</h6>
                            <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                <Pie data={computeProductAllocations()} dataKey="value" nameKey="name" outerRadius={80} label>
                                  {computeProductAllocations().map((entry, idx) => (
                                    <Cell key={idx} fill={["#8B0000", "#FF8042", "#00C49F", "#0088FE"][idx % 4]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card mb-3">
                          <div className="card-body" style={{ minHeight: 300 }}>
                            <h6>Top Users by Subscriptions</h6>
                            <ResponsiveContainer width="100%" height={220}>
                              <BarChart data={computeTopUsers()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill={THEME} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => exportCSV("product_alloc.csv", computeProductAllocations())}>Export Product Allocations</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => exportCSV("top_users.csv", computeTopUsers())}>Export Top Users</button>
                    </div>
                  </>
                )}

                {/* --------- SERVICES --------- */}
                {page === "services" && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => setServiceEditor({})}>New Service Request</button>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => exportCSV("services.csv", services)}>Export</button>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped table-bordered align-middle">
                        <thead className="table-light text-center">
                          <tr>
                            <th>Req ID</th>
                            <th>Merchant</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageSlice(services.filter(s => (filterType==="All" ? true : s.type===filterType) && (s.merchant.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())))).map(s => (
                            <tr key={s.id}>
                              <td className="text-center">{s.id}</td>
                              <td>{s.merchant}</td>
                              <td>{s.type}</td>
                              <td className="text-center">{s.status}</td>
                              <td className="text-center">{s.date}</td>
                              <td className="text-center">
                                <button className="btn btn-sm btn-outline-primary me-1" onClick={()=>setViewItem({ type:"service", data:s })}>View</button>
                                {s.status==="Pending" && <button className="btn btn-sm btn-success me-1" onClick={()=>processServiceRequest(s.id,"Approved")}>Approve</button>}
                                {s.status==="Pending" && <button className="btn btn-sm btn-danger" onClick={()=>processServiceRequest(s.id,"Rejected")}>Reject</button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {/* --------- API KEYS --------- */}
                {page === "apikeys" && (
                  <>
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <ApiKeyGenerator onCreate={(name, key) => {
                          // show the key to user and store masked version
                          const k = generateApiKey(name); // returns key string
                          // persist masked key (handled in generateApiKey)
                          alert(`New API Key created. Copy it now:\n\n${k}\n\n(You will not be able to view it again)`);
                        }} />
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => exportCSV("apikeys.csv", apiKeys)}>Export</button>
                      </div>
                    </div>

                    <ul className="list-group">
                      {apiKeys.map(k => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={k.id}>
                          <div>
                            <div className="fw-bold">{k.name}</div>
                            <small className="text-muted">Created: {k.createdAt} • {k.keyHash}</small>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { navigator.clipboard?.writeText(k.keyHash); alert("Key hash copied"); }}>Copy Hash</button>
                            <button className="btn btn-sm btn-danger" onClick={() => revokeKey(k.id)}>Revoke</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------ Modals & Small Components ------ */}

      {/* Product Editor Modal */}
      {productEditor !== null && (
        <Modal title={productEditor.id ? "Edit Product" : "Add Product"} onClose={() => setProductEditor(null)}>
          <ProductEditor product={productEditor} onSave={addOrUpdateProduct} onCancel={() => setProductEditor(null)} />
        </Modal>
      )}

      {/* Subscription Editor */}
      {subsEditor !== null && (
        <Modal title={subsEditor.id ? "Edit Request" : `${subsEditor.action || "Subscription"} Request`} onClose={() => setSubsEditor(null)}>
          <SubscriptionEditor products={products} initial={subsEditor} onSave={createSubscription} onCancel={() => setSubsEditor(null)} />
        </Modal>
      )}

      {/* Service Editor */}
      {serviceEditor !== null && (
        <Modal title={serviceEditor.id ? "Edit Service Request" : "Create Service Request"} onClose={() => setServiceEditor(null)}>
          <ServiceEditor initial={serviceEditor} onSave={createServiceRequest} onCancel={() => setServiceEditor(null)} />
        </Modal>
      )}

      {/* View Item Modal */}
      {viewItem && (
        <Modal title={viewItem.type === "product" ? viewItem.data.name : viewItem.type === "request" ? `Request ${viewItem.data.id}` : viewItem.type === "service" ? `Service ${viewItem.data.id}` : "View"} onClose={() => setViewItem(null)} size="lg">
          <ViewModalContent item={viewItem} onProcess={(id,action)=>{ if(viewItem.type==="request") processSubscription(id,action); if(viewItem.type==="service") processServiceRequest(id,action); setViewItem(null); }} />
        </Modal>
      )}
    </div>
  );
}

/* ----------------- Small Reusable UI components ----------------- */

function Modal({ title, children, onClose, size = "xl" }) {
  // simple modal overlay using bootstrap classes
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
      <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: THEME, color: "#fff" }}>
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Product Editor Form */
function ProductEditor({ product = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ name: product.name || "", type: product.type || "Mutual Fund", risk: product.risk || "Moderate", nav: product.nav || 100, aum: product.aum || 0, description: product.description || "", id: product.id });

  return (
    <div>
      <div className="mb-2">
        <label className="form-label">Name</label>
        <input className="form-control" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
      </div>
      <div className="mb-2">
        <label className="form-label">Type</label>
        <select className="form-select" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
          <option>Mutual Fund</option>
          <option>Bond</option>
          <option>ETF</option>
        </select>
      </div>
      <div className="row">
        <div className="col">
          <label className="form-label">Risk</label>
          <select className="form-select" value={form.risk} onChange={(e)=>setForm({...form, risk: e.target.value})}>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>
        </div>
        <div className="col">
          <label className="form-label">NAV</label>
          <input type="number" className="form-control" value={form.nav} onChange={(e)=>setForm({...form, nav: Number(e.target.value)})} />
        </div>
        <div className="col">
          <label className="form-label">AUM</label>
          <input type="number" className="form-control" value={form.aum} onChange={(e)=>setForm({...form, aum: Number(e.target.value)})} />
        </div>
      </div>
      <div className="mb-2 mt-2">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" style={{ backgroundColor: THEME }} onClick={()=>onSave(form)}>Save</button>
      </div>
    </div>
  );
}

/* Subscription Editor Form */
function SubscriptionEditor({ products = [], initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({
    user: initial.user || "",
    productId: initial.productId || (products[0] && products[0].id) || "",
    productName: initial.productName || (products[0] && products[0].name) || "",
    action: initial.action || "Subscribe",
    amount: initial.amount || 0,
  });

  useEffect(() => {
    // update productName when productId changes
    const prod = products.find(p => p.id === form.productId);
    if (prod) setForm(f => ({...f, productName: prod.name}));
  }, [form.productId]);

  return (
    <div>
      <div className="mb-2">
        <label className="form-label">User</label>
        <input className="form-control" value={form.user} onChange={(e)=>setForm({...form, user: e.target.value})}/>
      </div>
      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Product</label>
          <select className="form-select" value={form.productId} onChange={(e)=>setForm({...form, productId: e.target.value})}>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="col">
          <label className="form-label">Action</label>
          <select className="form-select" value={form.action} onChange={(e)=>setForm({...form, action: e.target.value})}>
            <option>Subscribe</option>
            <option>Redeem</option>
          </select>
        </div>
      </div>
      <div className="mb-2">
        <label className="form-label">Amount</label>
        <input type="number" className="form-control" value={form.amount} onChange={(e)=>setForm({...form, amount: Number(e.target.value)})}/>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-success" onClick={()=>onSave(form)}>Create Request</button>
      </div>
    </div>
  );
}

/* Service Editor */
function ServiceEditor({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ merchant: initial.merchant || "", type: initial.type || "Onboarding", details: initial.details || "" });

  return (
    <div>
      <div className="mb-2">
        <label className="form-label">Merchant</label>
        <input className="form-control" value={form.merchant} onChange={(e)=>setForm({...form, merchant: e.target.value})}/>
      </div>
      <div className="mb-2">
        <label className="form-label">Request Type</label>
        <select className="form-select" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
          <option>Onboarding</option>
          <option>Enable Service</option>
          <option>Disable Service</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="form-label">Details</label>
        <textarea className="form-control" value={form.details} onChange={(e)=>setForm({...form, details: e.target.value})}/>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-success" onClick={()=>onSave(form)}>Submit Request</button>
      </div>
    </div>
  );
}

/* API Key generator small component */
function ApiKeyGenerator({ onCreate }) {
  const [name, setName] = useState("");
  return (
    <div className="d-flex gap-2">
      <input className="form-control form-control-sm" placeholder="New key name" value={name} onChange={(e)=>setName(e.target.value)} />
      <button className="btn btn-sm btn-outline-light" style={{ backgroundColor: THEME }} onClick={() => {
        if (!name.trim()) { alert("Give key a name"); return; }
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        const key = Array.from(arr, b => ("0"+b.toString(16)).slice(-2)).join("") + "-" + Math.round(Math.random()*9999);
        // add masked key to store
        const k = { id: uid("K-"), name, keyHash: `****-${key.slice(-4)}`, active: true, createdAt: new Date().toISOString().slice(0,10) };
        const existing = loadLS("ip_apikeys", []);
        existing.unshift(k);
        saveLS("ip_apikeys", existing);
        onCreate(name, key);
        setName("");
        alert("API key generated & stored (masked). Key value shown in popup: " + key + "\nCopy it now!");
      }}>Generate</button>
    </div>
  );
}

/* View modal content depending on type */
function ViewModalContent({ item, onProcess }) {
  const { type, data } = item;
  if (type === "product") {
    return (
      <div>
        <p><strong>ID:</strong> {data.id}</p>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Type:</strong> {data.type}</p>
        <p><strong>Risk:</strong> {data.risk}</p>
        <p><strong>NAV:</strong> ₹ {Number(data.nav).toFixed(2)}</p>
        <p><strong>AUM:</strong> ₹ {Number(data.aum||0).toLocaleString()}</p>
        <p><strong>Description:</strong> {data.description}</p>
      </div>
    );
  } else if (type === "request") {
    return (
      <div>
        <p><strong>Req ID:</strong> {data.id}</p>
        <p><strong>User:</strong> {data.user}</p>
        <p><strong>Product:</strong> {data.productName}</p>
        <p><strong>Action:</strong> {data.action}</p>
        <p><strong>Amount:</strong> ₹ {Number(data.amount).toLocaleString()}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <hr />
        <h6>Audit Trail</h6>
        <table className="table table-sm table-bordered">
          <thead className="table-light"><tr><th>Date</th><th>Action</th><th>User</th><th>Remark</th></tr></thead>
          <tbody>{(data.audit||[]).map(l=> <tr key={l.id}><td>{l.date}</td><td>{l.action}</td><td>{l.user}</td><td>{l.remark}</td></tr>)}</tbody>
        </table>
        <div className="d-flex gap-2 mt-2">
          {data.status === "Pending" && <button className="btn btn-success" onClick={()=>onProcess(data.id,"Approved")}>Approve</button>}
          {data.status === "Pending" && <button className="btn btn-danger" onClick={()=>onProcess(data.id,"Rejected")}>Reject</button>}
        </div>
      </div>
    );
  } else if (type === "service") {
    return (
      <div>
        <p><strong>Req ID:</strong> {data.id}</p>
        <p><strong>Merchant:</strong> {data.merchant}</p>
        <p><strong>Type:</strong> {data.type}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Details:</strong> {data.details}</p>
        <hr />
        <h6>Audit Trail</h6>
        <table className="table table-sm table-bordered">
          <thead className="table-light"><tr><th>Date</th><th>Action</th><th>User</th><th>Remark</th></tr></thead>
          <tbody>{(data.audit||[]).map(l=> <tr key={l.id}><td>{l.date}</td><td>{l.action}</td><td>{l.user}</td><td>{l.remark}</td></tr>)}</tbody>
        </table>
        <div className="d-flex gap-2 mt-2">
          {data.status === "Pending" && <button className="btn btn-success" onClick={()=>onProcess(data.id,"Approved")}>Approve</button>}
          {data.status === "Pending" && <button className="btn btn-danger" onClick={()=>onProcess(data.id,"Rejected")}>Reject</button>}
        </div>
      </div>
    );
  } else {
    return <div>Unknown view</div>;
  }
}
