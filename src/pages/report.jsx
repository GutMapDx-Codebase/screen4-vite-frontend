import React, { useState, useEffect } from "react";
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
  const [jobRequests, setJobRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);

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
    { date: "2025-12-01", location: "Newcastle", testType: "Urine Test", collector: "John Doe", result: "Negative", notes: "Routine testing" },
    { date: "2025-12-02", location: "London", testType: "Blood Test", collector: "Jane Smith", result: "Positive", notes: "Follow-up required" },
    { date: "2025-12-03", location: "Manchester", testType: "Oral Fluid Test", collector: "Emily Johnson", result: "Negative", notes: "All confirmed" }
  ];

  // Calculate totals
  const totals = tableData.reduce((acc, curr) => {
    acc.totalTests += 1;
    acc.positiveTests += curr.result === "Positive" ? 1 : 0;
    return acc;
  }, { totalTests: 0, positiveTests: 0 });

  const totalTests = Object.values(totals).reduce((sum, val) => sum + val, 0);

  const fetchJobRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getJobRequests`);
      if (!response.ok) {
        throw new Error("Failed to fetch job requests data");
      }
      const data = await response.json();

      // Ensure the data is an array before setting state
      if (Array.isArray(data)) {
        setJobRequests(data);
      } else {
        console.error("Unexpected data format for job requests:", data);
        setJobRequests([]); // Set to an empty array as a fallback
      }
    } catch (error) {
      console.error("Error fetching job requests data:", error);
      setJobRequests([]); // Set to an empty array in case of error
    }
  };

  const fetchCollectors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getCollectors`);
      if (!response.ok) {
        throw new Error("Failed to fetch collectors data");
      }

      const data = await response.json();
      setCollectors(data);
    } catch (error) {
      console.error("Error fetching collectors data:", error);
      setCollectors([]); // Fallback to empty array
    }
  };

  const fetchDynamicReport = async () => {
    try {
      const queryParams = new URLSearchParams({
        startDate: reportStartDate,
        endDate: reportEndDate,
        location: reportLocation,
        testType: reportTestType,
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getDynamicReport?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dynamic report data");
      }

      const data = await response.json();
      setJobRequests(data);
    } catch (error) {
      console.error("Error fetching dynamic report data:", error);
      setJobRequests([]); // Fallback to empty array
    }
  };

  useEffect(() => {
    fetchJobRequests();
    fetchCollectors();
  }, []);

  useEffect(() => {
    fetchDynamicReport();
  }, [reportStartDate, reportEndDate, reportLocation, reportTestType]);

  const jobRequestTableData = jobRequests.map((request) => {
    const collector = collectors.find((col) => col.id === request.collectorId)?.name || "Unknown";
    return {
      jobId: request.jobId,
      date: request.date,
      location: request.location,
      testType: request.testType,
      collector,
      result: request.result,
      notes: request.notes,
    };
  });

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
              <th>Test Type</th>
              <th>Collector</th>
              <th>Result</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.location}</td>
                <td>{row.testType}</td>
                <td>{row.collector}</td>
                <td>{row.result}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="total-label">Total Tests</td>
              <td className="total-value">{totals.totalTests}</td>
              <td className="total-value">Positive: {totals.positiveTests}</td>
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

      {/* Job Requests Table */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Date</th>
              <th>Location</th>
              <th>Test Type</th>
              <th>Collector</th>
              <th>Result</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {jobRequestTableData.map((row, index) => (
              <tr key={index}>
                <td>{row.jobId}</td>
                <td>{row.date}</td>
                <td>{row.location}</td>
                <td>{row.testType}</td>
                <td>{row.collector}</td>
                <td>{row.result}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
};

export default Report;