import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Modal, List, Spin, Button, Avatar } from 'antd';
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

  // Modal state for showing lists when clicking cards
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState([]);
  const [modalType, setModalType] = useState('');

  const handleCardClick = async (id) => {
    setModalType(id);
    setModalTitle(
      id === 'total-tests' ? 'Total Tests' :
      id === 'active-clients' ? 'Active Clients' :
      id === 'collectors' ? 'Collectors' :
      id === 'pending-jobs' ? 'Pending Jobs' :
      id === 'completed-jobs' ? 'Completed Jobs' : 'Details'
    );
    setModalItems([]);
    setModalVisible(true);
    setModalLoading(true);

    try {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      let res;
      if (id === 'active-clients') {
        res = await fetch(`${base}/getclients`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.data || [];
        setModalItems(items);
      } else if (id === 'collectors') {
        res = await fetch(`${base}/getcollectors`);
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.data || [];
        setModalItems(items);
      } else if (id === 'pending-jobs' || id === 'completed-jobs' || id === 'total-tests') {
        // reuse job requests endpoint - send large limit to fetch items
        const status = id === 'pending-jobs' ? 'pending' : id === 'completed-jobs' ? 'completed' : '';
        const tokenParam = token ? `&token=${encodeURIComponent(token.toString())}` : '';
        res = await fetch(`${base}/getjobrequests?id=${clientId || ''}&status=${status}&page=1&limit=1000${tokenParam}`);
        const data = await res.json();
        // endpoint typically returns { data: [...], total, ... }
        const items = data.data || data || [];
        setModalItems(items);
      } else {
        setModalItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch modal items', err);
      setModalItems([]);
    } finally {
      setModalLoading(false);
    }
  };

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

  // Only show values, no trend
  const summaryCards = isClientUser
    ? [
        { id: 'total-tests', label: 'Total Tests', value: totalTests, icon: '🧪', color: '#22c55e' },
        { id: 'pending-jobs', label: 'Pending Jobs', value: jobStats.pending, icon: '💼', color: '#f59e0b' },
        { id: 'completed-jobs', label: 'Completed Jobs', value: jobStats.completed, icon: '✅', color: '#10b981' },
      ]
    : [
        { id: 'total-tests', label: 'Total Tests', value: totalTests, icon: '🧪', color: '#22c55e' },
        { id: 'active-clients', label: 'Active Clients', value: clientsCount, icon: '👥', color: '#3b82f6' },
        { id: 'collectors', label: 'Collectors', value: collectorsCount, icon: '✓', color: '#8b5cf6' },
        { id: 'pending-jobs', label: 'Pending Jobs', value: jobStats.pending, icon: '💼', color: '#f59e0b' },
        { id: 'completed-jobs', label: 'Completed Jobs', value: jobStats.completed, icon: '✅', color: '#10b981' },
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
            onClick={() => handleCardClick(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(card.id); }}
            className={`stat-card ${hoveredCard === card.id ? 'hovered' : ''}`}
            style={{ backgroundColor: card.color }}
          >
            <div className="stat-header">
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-arrow">↗</div>
            </div>
            <h3 className="stat-title">{card.label}</h3>
            <p className="stat-value">{card.value}</p>
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
          {/* <div className="reports-card">
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
          </div> */}
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

          {/* <div className="reports-card">
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
          </div> */}
        </div>
      )}
      {/* Modal to show list details when clicking stat cards */}
      <Modal
        open={modalVisible}
        title={modalTitle}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {modalLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={modalItems}
            renderItem={(item) => {
              // jobs list
              if (modalType === 'pending-jobs' || modalType === 'completed-jobs' || modalType === 'total-tests') {
                const jobRef = item.jobReferenceNo || item.jobReference || item._id;
                const customer = item.customer || item.name || item.customerName || '';
                const date = item.dateAndTimeOfCollection || item.date || '';
                return (
                  <List.Item className="modal-list-item" key={item._id}
                    actions={[
                      <Button
                        key="open-job"
                        type="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalVisible(false);
                          navigate(`/jobrequest/${item._id}`);
                        }}
                      >
                        Open
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#22c55e' }}>{jobRef?.toString().charAt(0)}</Avatar>}
                      title={<div className="modal-item-title">{jobRef}</div>}
                      description={<div className="modal-item-meta">{customer} {customer && date ? ' — ' : ''} <span className="modal-item-date">{date}</span></div>}
                    />
                  </List.Item>
                );
              }

              // clients
              if (modalType === 'active-clients') {
                const name = item.name || item.clientName || item.company || item.customer || 'Client';
                const email = item.email || item.contact || '';
                return (
                  <List.Item className="modal-list-item" key={item._id}
                    actions={[
                      <Button
                        key="open-client"
                        type="default"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalVisible(false);
                          navigate(`/clients/${item._id}`);
                        }}
                      >
                        Open
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#3b82f6' }}>{name?.toString().charAt(0)}</Avatar>}
                      title={<div className="modal-item-title">{name}</div>}
                      description={<div className="modal-item-meta">{email}</div>}
                    />
                  </List.Item>
                );
              }

              // collectors
              if (modalType === 'collectors') {
                const name = item.name || item.collectorName || item.fullName || 'Collector';
                const email = item.email || item.contact || '';
                return (
                  <List.Item className="modal-list-item" key={item._id}
                    actions={[
                      <Button
                        key="open-collector"
                        type="default"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalVisible(false);
                          navigate(`/addcollector/${item._id}`);
                        }}
                      >
                        Open
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#8b5cf6' }}>{name?.toString().charAt(0)}</Avatar>}
                      title={<div className="modal-item-title">{name}</div>}
                      description={<div className="modal-item-meta">{email}</div>}
                    />
                  </List.Item>
                );
              }

              return <List.Item>{JSON.stringify(item)}</List.Item>;
            }}
          />
        )}
      </Modal>

    </div>
  );
};

export default ModernDashboard;