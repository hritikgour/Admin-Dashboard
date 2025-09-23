import React, { useState, useEffect } from "react";
import "./Reports.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Reports = () => {
  const [reportType, setReportType] = useState("transactions");
  const [reportPeriod, setReportPeriod] = useState("daily"); // daily/weekly/monthly
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mock raw data
    const mock = [
      { date: "2025-09-01", type: "Deposit", count: 12, total: 5000 },
      { date: "2025-09-02", type: "Withdrawal", count: 8, total: 3200 },
      { date: "2025-09-03", type: "Transfer", count: 15, total: 7800 },
      { date: "2025-09-04", type: "Deposit", count: 10, total: 4200 },
      { date: "2025-09-08", type: "Deposit", count: 5, total: 2000 },
      { date: "2025-09-15", type: "Withdrawal", count: 7, total: 3100 },
    ];
    setRawData(mock);
  }, []);

  // Aggregate data based on reportPeriod
  useEffect(() => {
    const aggregated = aggregateData(rawData, reportPeriod);
    setData(aggregated);
  }, [rawData, reportPeriod]);

  // Aggregate helper function
  const aggregateData = (data, period) => {
    if (period === "daily") return data;
    const grouped = {};
    data.forEach((d) => {
      let key;
      const dateObj = new Date(d.date);
      if (period === "weekly") {
        const weekNumber = getWeekNumber(dateObj);
        key = `${dateObj.getFullYear()}-W${weekNumber}`;
      } else if (period === "monthly") {
        key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
      }

      if (!grouped[key]) grouped[key] = { date: key, count: 0, total: 0 };
      grouped[key].count += d.count;
      grouped[key].total += d.total;
    });
    return Object.values(grouped);
  };

  // Get ISO week number
  const getWeekNumber = (date) => {
    const temp = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date - temp) / (24 * 60 * 60 * 1000) + temp.getDay() + 1
    );
    return Math.ceil(days / 7);
  };

  // CSV export
  const downloadCSV = () => {
    const csvRows = [
      ["Date", "Count", "Total Amount"],
      ...data.map((d) => [d.date, d.count, d.total]),
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF export
  const downloadPDF = async () => {
    const jsPDFModule = await import("jspdf");
    await import("jspdf-autotable");
    const doc = new jsPDFModule.default();
    doc.text("Admin Report", 14, 20);
    doc.autoTable({
      head: [["Date", "Count", "Total Amount"]],
      body: data.map((d) => [d.date, d.count, d.total]),
    });
    doc.save("report.pdf");
  };

  return (
    <div className="reports-container">
      <h1>Admin Reports & Analytics</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Transactions</h3>
          <p>{data.reduce((acc, d) => acc + d.count, 0)}</p>
        </div>
        <div className="card">
          <h3>Total Amount</h3>
          <p>${data.reduce((acc, d) => acc + d.total, 0)}</p>
        </div>
        <div className="card">
          <h3>Average Amount</h3>
          <p>
            $
            {(
              data.reduce((acc, d) => acc + d.total, 0) /
              data.reduce((acc, d) => acc + d.count, 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="transactions">Transactions</option>
            <option value="compliance">Compliance</option>
            <option value="financial">Financial</option>
          </select>
        </div>
        <div>
          <label>Period:</label>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label>From:</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
        </div>
        <div>
          <label>To:</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange({ ...dateRange, to: e.target.value })
            }
          />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="export-buttons">
        <button onClick={downloadCSV}>Export CSV</button>
        <button onClick={downloadPDF}>Export PDF</button>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-container">
          <h3>Transaction Count ({reportPeriod})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#780606"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Total Amount ({reportPeriod})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#780606" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Count</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.count}</td>
              <td>${row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
