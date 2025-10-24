import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/newdashboard.css';
import Cookies from 'js-cookie';

const ModernDashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [monthlyData, setMonthlyData] = useState([]);
  const [reasonData, setReasonData] = useState([]);
  const [jobStats, setJobStats] = useState({ pending: 0, accepted: 0, completed: 0 });
  const [clientsCount, setClientsCount] = useState(0);
  const [collectorsCount, setCollectorsCount] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const clientId = Cookies.get('id');
  const token = Cookies.get('Token');
  const id = Cookies.get('id');
  const isClientUser = token === 'clientdgf45sdgf89756dfgdhgdf';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your new API
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getdashboarddata?token=${token}&id=${id}`);
        
        if (res.ok) {
          const data = await res.json();
  
          // Set the state with the received data
          setTotalTests(data.totalTests);
          setClientsCount(data.clientsCount);
          setCollectorsCount(data.collectorsCount);
          setMonthlyData(data.monthlyData);
          setReasonData(data.reasonData);
          setJobStats(data.jobStats);
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Sync active item with URL
  useEffect(() => {
    const path = location.pathname || '';
    if (path.startsWith('/clients')) setActiveNav('clients');
    else if (path.startsWith('/collectors')) setActiveNav('collectors');
    else if (path.startsWith('/jobrequests')) setActiveNav('jobs');
    else if (path.startsWith('/report')) setActiveNav('reports');
    else if (path.startsWith('/dashboard/profile')) setActiveNav('settings');
    else if (path.startsWith('/dashboard')) setActiveNav('dashboard');
  }, [location.pathname]);

  const summaryCards = isClientUser
    ? [
        { id: 'total-tests', label: 'Total Tests', value: totalTests, trend: '+12% from last month', icon: '🧪', color: '#22c55e' },
        { id: 'pending-jobs', label: 'Pending Jobs', value: jobStats.pending, trend: '+12% from last month', icon: '💼', color: '#f59e0b' },
        { id: 'completed-jobs', label: 'Completed Jobs', value: jobStats.completed, trend: '+12% from last month', icon: '✅', color: '#10b981' },
      ]
    : [
        { id: 'total-tests', label: 'Total Tests', value: totalTests, trend: '+12% from last month', icon: '🧪', color: '#22c55e' },
        { id: 'active-clients', label: 'Active Clients', value: clientsCount, trend: '+12% from last month', icon: '👥', color: '#3b82f6' },
        { id: 'collectors', label: 'Collectors', value: collectorsCount, trend: '+12% from last month', icon: '✓', color: '#8b5cf6' },
        { id: 'pending-jobs', label: 'Pending Jobs', value: jobStats.pending, trend: '+12% from last month', icon: '💼', color: '#f59e0b' },
        { id: 'completed-jobs', label: 'Completed Jobs', value: jobStats.completed, trend: '+12% from last month', icon: '✅', color: '#10b981' },
      ];

  return (
    <div className="dashboard-content">
      {/* Stats Cards */}
      <div className="stats-grid">
        {summaryCards.map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`stat-card ${hoveredCard === card.id ? 'hovered' : ''}`}
            style={{ backgroundColor: card.color }}
          >
            <div className="stat-header">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-arrow">↗</div>
            </div>
            <h3 className="stat-title">{card.label}</h3>
            <p className="stat-value">{card.value}</p>
            <div className="stat-trend">
              <span>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Monthly Tests */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Monthly Tests</h2>
              <p>Test distribution overview</p>
            </div>
            <div className="chart-icon">📊</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="tests" fill="url(#colorTests)" radius={[12, 12, 0, 0]} />
              <defs>
                <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reason for Tests */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h2>Reason for Tests</h2>
              <p>Test categories breakdown</p>
            </div>
            <div className="chart-icon">🥧</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={reasonData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                {reasonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-items">
            {reasonData.map((item) => (
              <div key={item.name} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Only show for non-client users */}
      {!isClientUser && (
        <div className="bottom-grid">
          {/* Job Status */}
          <div className="status-card">
            <h2>Job Requests Status</h2>
            <div className="status-grid">
              <div className="status-item pending">
                <p className="status-label">Pending</p>
                <p className="status-value">{jobStats.pending}</p>
                <p className="status-desc">Awaiting review</p>
              </div>
              <div className="status-item accepted">
                <p className="status-label">Accepted</p>
                <p className="status-value">{jobStats.accepted}</p>
                <p className="status-desc">In progress</p>
              </div>
              <div className="status-item completed">
                <p className="status-label">Completed</p>
                <p className="status-value">{jobStats.completed}</p>
                <p className="status-desc">Finished</p>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="reports-card">
            <h2>Recent Reports</h2>
            <div className="reports-list">
              {['August Report', 'July Report'].map((report, index) => (
                <div key={report} className="report-item">
                  <div className="report-icon">📄</div>
                  <div className="report-info">
                    <span className="report-name">{report}</span>
                    <span className="report-date">Generated on {index === 0 ? 'Sep 1' : 'Aug 1'}, 2024</span>
                  </div>
                  <button className="download-btn">
                    <span className="download-text">Download</span>
                    <span>⬇</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Client User ke liye alternative content (optional) */}
      {isClientUser && (
        <div className="bottom-grid">
          {/* Client-specific content yahan add kar sakte ho */}
          <div className="status-card">
            <h2>My Test Summary</h2>
            <div className="status-grid">
              <div className="status-item pending">
                <p className="status-label">Pending Tests</p>
                <p className="status-value">{jobStats.pending}</p>
                <p className="status-desc">Awaiting collection</p>
              </div>
              <div className="status-item completed">
                <p className="status-label">Completed Tests</p>
                <p className="status-value">{jobStats.completed}</p>
                <p className="status-desc">Results available</p>
              </div>
            </div>
          </div>

          <div className="reports-card">
            <h2>Quick Actions</h2>
            <div className="reports-list">
              <div className="report-item">
                <div className="report-icon">📋</div>
                <div className="report-info">
                  <span className="report-name">Request New Test</span>
                  <span className="report-date">Schedule a new screening</span>
                </div>
                <button className="download-btn">
                  <span className="download-text">Create</span>
                  <span>➕</span>
                </button>
              </div>
              <div className="report-item">
                <div className="report-icon">📊</div>
                <div className="report-info">
                  <span className="report-name">View Test History</span>
                  <span className="report-date">All previous results</span>
                </div>
                <button className="download-btn">
                  <span className="download-text">View</span>
                  <span>👁️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDashboard;