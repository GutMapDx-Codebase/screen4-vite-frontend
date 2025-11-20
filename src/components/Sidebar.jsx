import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Sidebar({ activeNav, onNav }) {
  const navigate = useNavigate();
  const name = Cookies.get('Name');
  const email = Cookies.get('email');
  const token = Cookies.get('Token');

  // role helpers
  const isClientUser = token === 'clientdgf45sdgf89756dfgdhgdf';
  const isCollectorUser = token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg';

  // determine display name/email with sensible fallbacks
  let displayName = 'Admin User';
  let displayEmail = 'admin@screen14.com';
  if (name) {
    displayName = name;
  } else if (isClientUser) {
    displayName = 'Client User';
  } else if (isCollectorUser) {
    displayName = 'Collector User';
  }

  if (email) {
    displayEmail = email;
  } else if (isClientUser) {
    displayEmail = 'client@screen14.com';
  } else if (isCollectorUser) {
    displayEmail = 'collector@screen14.com';
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : email
    ? email.charAt(0).toUpperCase()
    : 'AD';

  let navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'clients', icon: '👥', label: 'Clients' },
    { id: 'collectors', icon: '✓', label: 'Collectors' },
    { id: 'admins', icon: '👨‍💼', label: 'Admins' },
    { id: 'jobs', icon: '💼', label: 'Jobs' },
    { id: 'reports', icon: '📊', label: 'Reports' },
  ];

  // clients see only Dashboard + Jobs
  if (isClientUser) {
    navItems = [
      { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { id: 'jobs', icon: '💼', label: 'Jobs' },
    ];
  }

  // collectors see only Dashboard + Jobs (Collectors option removed)
  if (isCollectorUser) {
    navItems = [
      { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
      { id: 'jobs', icon: '💼', label: 'Jobs' },
    ];
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">
          <img
            src="blackscreen4.png"
            alt="Screen4 Logo"
            className="sidebar-logo-img"
            style={{
              width: 150,
              borderRadius: 8,
              marginBottom: 6,
              marginLeft: 50,
            }}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav && onNav(item.id)}
            className={`nav-item ${activeNav === item.id ? 'active' : ''} ${
              item.id === 'Clienthub' ? 'clienthub-hover' : ''
            }`}
            aria-label={item.label}
          >
            <span className="nav-icon">
              {item.icon}
            </span>
            <span className="nav-label">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="profile-card">
          <div
            className="profile-avatar"
          >
            {initials}
          </div>
          <div className="profile-info">
            <p className="profile-name">
              {displayName}
            </p>
            <p
              className="profile-email"
            >
              {displayEmail}
            </p>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            // clear all cookies then navigate to login/root
            const allCookies = Cookies.get();
            for (const cookieName in allCookies) {
              Cookies.remove(cookieName);
            }
            navigate('/');
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;