import React, { useState, useEffect } from "react";
import "./css/report.css";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Report = () => {
  const [reportLocation, setReportLocation] = useState("");
  const [reportTestType, setReportTestType] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        "http://localhost:1338";

      const query = new URLSearchParams({
        location: reportLocation || "",
        type: reportTestType || "",
      }).toString();

      const response = await fetch(`${apiUrl}/reports?${query}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError(
        error?.message === "Failed to fetch"
          ? "Cannot reach the reports API. Please make sure the backend server is running or update the API URL."
          : error.message || "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return alert("No report data available to download.");

    const csvRows = [];
    csvRows.push(
      ["Date", "Location", "Test Type", "Collector", "Result", "Notes"].join(",")
    );

    reportData.jobReports?.forEach((row) => {
      csvRows.push(
        [
          row.date || "",
          row.location || "",
          row.testType || "",
          row.collector || "",
          row.result || "",
          row.notes || "",
        ].join(",")
      );
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Test_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading && !error) {
    return (
      <Box className="report-main">
        <Typography variant="h5">Loading report data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="report-main">
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <button onClick={fetchReport} className="download-btn" style={{ marginTop: 16 }}>
          Retry
        </button>
      </Box>
    );
  }

  if (!reportData) {
    return null;
  }

  const {
    totalTests,
    confirmedPositives,
    nonNegScreens,
    trend,
    locations,
    jobReports,
    chartData,
  } = reportData;

  const barData = [
    { name: "Confirmed", value: chartData?.confirmed || 0, fill: "#22c55e" },
    { name: "Non-Neg", value: chartData?.nonNeg || 0, fill: "#f59e0b" },
  ];

  const pieData =
    locations?.map((loc) => ({
      name: loc.name || "Unknown",
      value: loc.tests || 0,
    })) || [];

  return (
    <Box className="report-main">
      <div className="report-header">
        <Typography variant="h4" className="report-title">
          Test Reports
        </Typography>
        <p className="report-subtitle">
          Comprehensive testing analysis and statistics
        </p>
      </div>

      {/* Filters */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter location"
            value={reportLocation}
            onChange={(e) => setReportLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchReport();
            }}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>Test Type</label>
          <input
            type="text"
            placeholder="Enter test type"
            value={reportTestType}
            onChange={(e) => setReportTestType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchReport();
            }}
            className="filter-input"
          />
        </div>

        <div className="report-actions">
          <button onClick={downloadReport} className="download-btn">
            ⬇ Download Report
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-cards">
        <div className="summary-card total-tests">
          <div className="summary-icon">🧪</div>
          <div className="summary-content">
            <h3>Total Tests</h3>
            <p className="summary-value">{totalTests}</p>
            <p className="summary-trend">{trend?.totalChange || "0%"}</p>
          </div>
        </div>

        <div className="summary-card positive-cases">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Confirmed Positives</h3>
            <p className="summary-value">{confirmedPositives}</p>
            <p className="summary-trend">{trend?.positiveChange || "0%"}</p>
          </div>
        </div>

        <div className="summary-card non-neg-screens">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <h3>Non-Neg Screens</h3>
            <p className="summary-value">{nonNegScreens}</p>
            <p className="summary-trend">{trend?.nonNegChange || "0%"}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
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
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
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
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#22c55e", "#10b981", "#84cc16", "#65a30d"][
                        index % 4
                      ]
                    }
                  />
                ))}
              </Pie>
              <ReTooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
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
            {jobReports?.length ? (
              jobReports.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.location}</td>
                  <td>{row.testType}</td>
                  <td>{row.collector}</td>
                  <td>{row.result}</td>
                  <td>{row.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Box>
  );
};

export default Report;
