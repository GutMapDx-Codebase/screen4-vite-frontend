import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../pages/css/newdashboard.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeNav, setActiveNav] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname || '';
    if (path.startsWith('/clients')) setActiveNav('clients');
    else if (path.startsWith('/collectors')) setActiveNav('collectors');
    else if (path.startsWith('/jobrequests')) setActiveNav('jobs');
    else if (path.startsWith('/report')) setActiveNav('reports');
    else if (path.startsWith('/dashboard/profile')) setActiveNav('settings');
    else if (path.startsWith('/dashboard')) setActiveNav('dashboard');
  }, [location.pathname]);

  const handleNav = (id) => {
    setActiveNav(id);
    switch (id) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'clients':
        navigate('/clients');
        break;
      case 'collectors':
        navigate('/collectors');
        break;
      case 'jobs':
        navigate('/jobrequests');
        break;
      case 'reports':
        navigate('/report');
        break;
      case 'settings':
        navigate('/dashboard/profile');
        break;
      default:
        break;
    }
  };

  // Check if current page is dashboard
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="dashboard-container">
      <Sidebar activeNav={activeNav} onNav={handleNav} />
      <div className="main-content" style={{ paddingBottom: 96 }}>
        <header className="header">
          <div className="header-left">
            <h2>Dashboard</h2>
            <p>Unified experience across pages</p>
          </div>
          <div className="header-right">
            {/* Search bar only show on dashboard */}
            {isDashboard && (
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search..." />
              </div>
            )}
            {/* <button className="notification-btn">
              <span>🔔</span>
              <span className="notification-dot"></span>
            </button> */}
          </div>
        </header>
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;