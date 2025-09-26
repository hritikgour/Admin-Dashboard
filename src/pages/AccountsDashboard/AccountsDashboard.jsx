import React, { useState, useEffect } from "react";
import "./AccountsDashboard.css";

const sampleAccounts = [
  {
    id: 1,
    customerName: "John Doe",
    accountNumber: "ACC001234567",
    accountType: "Savings",
    balance: 25000.5,
    walletBalance: 1200.0,
    status: "Active",
    lastTransaction: "2024-01-15",
    kycStatus: "Verified",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    accountNumber: "ACC001234568",
    accountType: "Current",
    balance: 45000.75,
    walletBalance: 800.0,
    status: "Active",
    lastTransaction: "2024-01-14",
    kycStatus: "Pending",
  },
  {
    id: 3,
    customerName: "Mike Johnson",
    accountNumber: "ACC001234569",
    accountType: "Savings",
    balance: 15000.25,
    walletBalance: 500.0,
    status: "Frozen",
    lastTransaction: "2024-01-10",
    kycStatus: "Verified",
  },
  {
    id: 4,
    customerName: "Sarah Wilson",
    accountNumber: "ACC001234570",
    accountType: "Business",
    balance: 75000.0,
    walletBalance: 2000.0,
    status: "Active",
    lastTransaction: "2024-01-16",
    kycStatus: "Verified",
  },
  {
    id: 5,
    customerName: "Robert Brown",
    accountNumber: "ACC001234571",
    accountType: "Current",
    balance: 500.0,
    walletBalance: 50.0,
    status: "Pending",
    lastTransaction: "2024-01-12",
    kycStatus: "Pending",
  },
];

const AccountsDashboard = () => {
  const [accounts, setAccounts] = useState(sampleAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(sampleAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [balanceRangeFilter, setBalanceRangeFilter] = useState("All");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(
    (acc) => acc.status === "Active"
  ).length;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalWalletBalance = accounts.reduce(
    (sum, acc) => sum + acc.walletBalance,
    0
  );

  useEffect(() => {
    let filtered = accounts;

    if (searchTerm) {
      filtered = filtered.filter(
        (account) =>
          account.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((account) => account.status === statusFilter);
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter(
        (account) => account.accountType === typeFilter
      );
    }

    if (balanceRangeFilter !== "All") {
      filtered = filtered.filter((account) => {
        switch (balanceRangeFilter) {
          case "0-1000":
            return account.balance >= 0 && account.balance <= 1000;
          case "1000-10000":
            return account.balance > 1000 && account.balance <= 10000;
          case "10000-50000":
            return account.balance > 10000 && account.balance <= 50000;
          case "50000+":
            return account.balance > 50000;
          default:
            return true;
        }
      });
    }

    if (dateFromFilter || dateToFilter) {
      filtered = filtered.filter((account) => {
        const transactionDate = new Date(account.lastTransaction);
        const fromDate = dateFromFilter
          ? new Date(dateFromFilter)
          : new Date("1900-01-01");
        const toDate = dateToFilter
          ? new Date(dateToFilter)
          : new Date("2099-12-31");

        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    setFilteredAccounts(filtered);
  }, [
    accounts,
    searchTerm,
    statusFilter,
    typeFilter,
    balanceRangeFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  const StatusBadge = ({ status }) => {
    return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setTypeFilter("All");
    setBalanceRangeFilter("All");
    setDateFromFilter("");
    setDateToFilter("");
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setEditFormData({
      customerName: account.customerName,
      accountType: account.accountType,
      balance: account.balance,
      walletBalance: account.walletBalance,
      status: account.status,
      kycStatus: account.kycStatus
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    setAccounts(prevAccounts => 
      prevAccounts.map(acc => 
        acc.id === editingAccount.id 
          ? {
              ...acc,
              ...editFormData,
              balance: parseFloat(editFormData.balance) || 0,
              walletBalance: parseFloat(editFormData.walletBalance) || 0
            }
          : acc
      )
    );
    setEditingAccount(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingAccount(null);
    setEditFormData({});
  };

  return (
<>
      {/* Header */}
      <div className="header">
        <h1>Accounts & Wallets</h1>
        <p>Manage customer accounts, wallets, and financial operations</p>
      </div>


    <div className="accounts-dashboard">
    

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <p>Total Accounts</p>
          <h4>{totalAccounts}</h4>
          <small>{activeAccounts} active</small>
        </div>
        <div className="card">
          <p>Total Balance</p>
          <h4 className="green">${totalBalance.toLocaleString()}</h4>
          <small>Account balances</small>
        </div>
        <div className="card">
          <p>Wallet Balance</p>
          <h4 className="blue">${totalWalletBalance.toLocaleString()}</h4>
          <small>Digital wallet funds</small>
        </div>
        <div className="card">
          <p>Pending Actions</p>
          <h4 className="yellow">5</h4>
          <small>Requires attention</small>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="filters-container">
        <div className="filters-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search accounts, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="actions">
            <button onClick={() => setShowFilters(!showFilters)}>🔍 Filters</button>
            <button className="primary">⬇ Export</button>
            <button className="primary">➕ New Account</button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="grid">
              <div>
                <label>Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label>Account Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div>
                <label>Balance Range</label>
                <select
                  value={balanceRangeFilter}
                  onChange={(e) => setBalanceRangeFilter(e.target.value)}
                >
                  <option value="All">All Ranges</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-10000">$1,000 - $10,000</option>
                  <option value="10000-50000">$10,000 - $50,000</option>
                  <option value="50000+">$50,000+</option>
                </select>
              </div>
              <div>
                <label>Date From</label>
                <input
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                />
              </div>
              <div>
                <label>Date To</label>
                <input
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                />
              </div>
            </div>
            <button className="secondary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="table-container">
        <div className="table-header">
          <h5>All Accounts ({filteredAccounts.length})</h5>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>Account Balance</th>
                <th>Wallet Balance</th>
                <th>Status</th>
                <th>Last Transaction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, index) => (
                <tr
                  key={acc.id}
                  className={index % 2 === 0 ? "even" : "odd"}
                  onClick={() => setSelectedAccount(acc)}
                >
                  <td>
                    <div>
                      <strong>{acc.customerName}</strong>
                      <br />
                      <small>{acc.accountNumber}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge">{acc.accountType}</span>
                  </td>
                  <td>${acc.balance.toLocaleString()}</td>
                  <td>${acc.walletBalance.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={acc.status} />
                  </td>
                  <td>{acc.lastTransaction}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAccount(acc);
                        }}
                      >
                        👁
                      </button>
                      <button 
                        className="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(acc);
                        }}
                      >
                        ✏
                      </button>
                      <button className="gray">⋯</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Detail Modal */}
      {selectedAccount && !editingAccount && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5>Account Details</h5>
              <button onClick={() => setSelectedAccount(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid">
                <div>
                  <h6>Customer Information</h6>
                  <p>
                    <strong>Name:</strong> {selectedAccount.customerName}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {selectedAccount.accountNumber}
                  </p>
                  <p>
                    <strong>Account Type:</strong> {selectedAccount.accountType}
                  </p>
                  <p>
                    <strong>KYC Status:</strong> {selectedAccount.kycStatus}
                  </p>
                </div>
                <div>
                  <h6>Balance Information</h6>
                  <p>
                    <strong>Account Balance:</strong> ${selectedAccount.balance.toLocaleString()}
                  </p>
                  <p>
                    <strong>Wallet Balance:</strong> ${selectedAccount.walletBalance.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> <StatusBadge status={selectedAccount.status} />
                  </p>
                  <p>
                    <strong>Last Transaction:</strong> {selectedAccount.lastTransaction}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="primary">Generate Statement</button>
              <button className="green">Manual Adjustment</button>
              <button className="yellow">Update Limits</button>
              <button className="red">Freeze Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header edit-header">
              <h5>Edit Account</h5>
              <button onClick={handleCancelEdit}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid">
                <div>
                  <h6>Customer Information</h6>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editFormData.customerName || ''}
                      onChange={(e) => handleEditFormChange('customerName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number:</label>
                    <input
                      type="text"
                      className="form-input disabled"
                      value={editingAccount.accountNumber}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type:</label>
                    <select
                      className="form-input"
                      value={editFormData.accountType || ''}
                      onChange={(e) => handleEditFormChange('accountType', e.target.value)}
                    >
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>KYC Status:</label>
                    <select
                      className="form-input"
                      value={editFormData.kycStatus || ''}
                      onChange={(e) => handleEditFormChange('kycStatus', e.target.value)}
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div>
                  <h6>Balance Information</h6>
                  <div className="form-group">
                    <label>Account Balance:</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={editFormData.balance || ''}
                      onChange={(e) => handleEditFormChange('balance', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Wallet Balance:</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={editFormData.walletBalance || ''}
                      onChange={(e) => handleEditFormChange('walletBalance', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      className="form-input"
                      value={editFormData.status || ''}
                      onChange={(e) => handleEditFormChange('status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Frozen">Frozen</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Last Transaction:</label>
                    <input
                      type="text"
                      className="form-input disabled"
                      value={editingAccount.lastTransaction}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
              <button className="primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    /</>
  );
};

export default AccountsDashboard;