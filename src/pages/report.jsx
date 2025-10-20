import React, { useState } from "react";
import "./css/report.css";
import { Box, Card, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const locations = ["Newcastle", "London", "Manchester", "Birmingham"];
const testTypes = ["Outstation Testing", "Call Out Testing"];

const Report = () => {
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [reportLocation, setReportLocation] = useState("");
  const [reportTestType, setReportTestType] = useState("");

  // Sample data for charts
  const barData = [
    { name: "Confirmed", value: 2, fill: "#22c55e" },
    { name: "Non-Neg", value: 1, fill: "#f59e0b" }
  ];

  const pieData = [
    { name: "Newcastle", value: 5, fill: "#22c55e" },
    { name: "London", value: 3, fill: "#10b981" },
    { name: "Manchester", value: 2, fill: "#84cc16" },
    { name: "Birmingham", value: 4, fill: "#65a30d" }
  ];

  // Sample table data
  const tableData = [
    { date: "2025-12-01", location: "Newcastle", ca: "CA1", dea: 2, aOnly: 1, nonNeg: 0, amp: 3, bar: 0, coc: 1, notes: "All confirmed" },
    { date: "2025-12-02", location: "London", ca: "CA2", dea: 1, aOnly: 2, nonNeg: 1, amp: 2, bar: 1, coc: 0, notes: "Routine testing" },
    { date: "2025-12-03", location: "Manchester", ca: "CA3", dea: 3, aOnly: 0, nonNeg: 2, amp: 1, bar: 2, coc: 1, notes: "Follow-up required" }
  ];

  // Calculate totals
  const totals = tableData.reduce((acc, curr) => ({
    dea: acc.dea + curr.dea,
    aOnly: acc.aOnly + curr.aOnly,
    nonNeg: acc.nonNeg + curr.nonNeg,
    amp: acc.amp + curr.amp,
    bar: acc.bar + curr.bar,
    coc: acc.coc + curr.coc
  }), { dea: 0, aOnly: 0, nonNeg: 0, amp: 0, bar: 0, coc: 0 });

  const totalTests = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return (
    <Box className="report-main">
      {/* Header Section */}
      <div className="report-header">
        <Typography variant="h4" className="report-title">
          Test Reports
        </Typography>
        <p className="report-subtitle">Comprehensive testing analysis and statistics</p>
      </div>

      {/* Filters Section */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Date Range</label>
          <div className="date-inputs">
            <input 
              type="date" 
              value={reportStartDate} 
              onChange={e => setReportStartDate(e.target.value)}
              className="filter-input"
            />
            <span className="date-separator">to</span>
            <input 
              type="date" 
              value={reportEndDate} 
              onChange={e => setReportEndDate(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select 
            value={reportLocation} 
            onChange={e => setReportLocation(e.target.value)}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Test Type</label>
          <select 
            value={reportTestType} 
            onChange={e => setReportTestType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Test Types</option>
            {testTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="report-actions">
          <button className="download-btn">
            <span className="btn-icon">📥</span>
            Export Excel
          </button>
          <button className="print-btn">
            <span className="btn-icon">🖨️</span>
            Print Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total-tests">
          <div className="summary-icon">🧪</div>
          <div className="summary-content">
            <h3>Total Tests</h3>
            <p className="summary-value">{totalTests}</p>
            <p className="summary-trend">+92% this month</p>
          </div>
        </div>

        <div className="summary-card positive-cases">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Confirmed Positives</h3>
            <p className="summary-value">2</p>
            <p className="summary-trend">+95% this month</p>
          </div>
        </div>

        <div className="summary-card non-neg-screens">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <h3>Non-Neg Screens</h3>
            <p className="summary-value">1</p>
            <p className="summary-trend">-25% this month</p>
          </div>
        </div>
      </div>

      {/* Report Title */}
      <Typography variant="h5" className="report-subtitle">
        Job Report for {reportLocation || "All Locations"} 
        {reportStartDate && reportEndDate ? ` (${reportStartDate} to ${reportEndDate})` : ""}
      </Typography>

      {/* Data Table */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>CA</th>
              <th>D&A</th>
              <th>A Only</th>
              <th>Non-Neg Onsite</th>
              <th>AMP</th>
              <th>BAR</th>
              <th>COC</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>
                  <span className="location-badge">{row.location}</span>
                </td>
                <td>{row.ca}</td>
                <td>{row.dea}</td>
                <td>{row.aOnly}</td>
                <td>{row.nonNeg}</td>
                <td>{row.amp}</td>
                <td>{row.bar}</td>
                <td>{row.coc}</td>
                <td className="notes-cell">{row.notes}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-totals">
              <td colSpan={3} className="total-label">Total Tests</td>
              <td className="total-value">{totals.dea}</td>
              <td className="total-value">{totals.aOnly}</td>
              <td className="total-value">{totals.nonNeg}</td>
              <td className="total-value">{totals.amp}</td>
              <td className="total-value">{totals.bar}</td>
              <td className="total-value">{totals.coc}</td>
              <td className="total-label">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Charts Section */}
      <div className="report-charts">
        <div className="chart-section">
          <div className="chart-header">
            <h3>Positive Confirmed vs Non-Negative Screens</h3>
            <p>Test result distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <ReTooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '12px', 
                  color: '#fff' 
                }} 
              />
              <Bar 
                dataKey="value" 
                radius={[12, 12, 0, 0]}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h3>Tests per Location</h3>
            <p>Geographical distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={60}
                outerRadius={100} 
                paddingAngle={2}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ReTooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '12px', 
                  color: '#fff' 
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Box>
  );
};

export default Report;