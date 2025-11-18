import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import '../pages/css/newdashboard.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    const path = location.pathname || '';
    if (path.startsWith('/clients')) setActiveNav('clients');
    else if (path.startsWith('/collectors')) setActiveNav('collectors');
    else if (path.startsWith('/admins')) setActiveNav('admins');
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
      case 'admins':
        navigate('/admins');
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = async (e) => {
  if (e.key === 'Enter') {
    console.log('Search Query (on Enter):', searchQuery);

    if (!searchQuery.trim()) {
      alert('Please enter a search term');
      return;
    }

    if (searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(
        `${API_URL}/search-job-requests?searchTerm=${encodeURIComponent(
          searchQuery.trim()
        )}&page=1&limit=20`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "Search completed successfully") {
        console.log('✅ Search successful:', data.data.results.length, 'results found');

        if (data.data.results.length > 0) {
          navigate('/jobrequests', {
            state: {
              searchResults: data.data.results,
              searchQuery: searchQuery,
              fromSearch: true,
            },
          });
        } else {
          alert(`No results found for "${searchQuery}"`);
        }
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      alert("Search failed: " + error.message);
    } finally {
      setLoading(false);
    }
  }
};


  // Check if current page is dashboard
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="dashboard-container">
      <Sidebar activeNav={activeNav} onNav={handleNav} />
      <div className="main-content" style={{ paddingBottom: 96 }}>
        <header className="header">
          <div className="header-top">
            <div className="header-left">
              <h2>Dashboard</h2>
              <p>Unified experience across pages</p>
            </div>
            {/* Mobile/Tablet Logout Button - Only visible on mobile/tablet */}
            <button
              className="mobile-logout-btn"
              onClick={() => {
                // clear all cookies then navigate to login/root
                const allCookies = Cookies.get();
                for (const cookieName in allCookies) {
                  Cookies.remove(cookieName);
                }
                navigate('/');
              }}
            >
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
          <div className="header-right">
            {isDashboard && (
              <div className="search-bar">
                <span className="search-icon">
                  {loading ? '⏳' : '🔍'}
                </span>
                <input 
                  type="text" 
                  placeholder={loading ? "Searching..." : "Search job requests... (Press Enter)"} 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </header>
        <div className="dashboard-content">
          {/* ✅ Pass navigation state to children */}
          {React.cloneElement(children, { 
            searchResults: location.state?.searchResults || [],
            searchQuery: location.state?.searchQuery || '',
            fromSearch: location.state?.fromSearch || false
          })}
        </div>
      </div>
    </div>
  );
}

export default Layout;