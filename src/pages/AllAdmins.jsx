import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { message } from "antd";
import { Button, Popconfirm } from 'antd';
import './css/Collectors.css'; // Reuse Collectors CSS

const AllAdmins = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const navigate = useNavigate();
  const token = Cookies.get("Token");

  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("Token");
    // Only admin can access this page
    if (!token || token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const deleteAdmin = async (adminId) => {
    setIsDeleting(true);
    setDeletedId(adminId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deleteadmin/${adminId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Admin deleted successfully");
        fetchAdmins();
      } else {
        message.error(result.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      message.error("Something went wrong");
    }
    setIsDeleting(false);
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getadmins`);
      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data);
        setAdmins([]);
        return;
      }

      setAdmins(data);
      setFilteredAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    filterAdmins(searchQuery);
  }, [searchQuery, admins]);

  const filterAdmins = (query) => {
    if (!query) {
      setFilteredAdmins(admins);
      return;
    }

    const filtered = admins.filter((a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterAdmins(query);
  };

  const handleAdminClick = async (id) => {
    navigate(`/addadmin/${id}`);
  };

  return (
    <div className="collectors-container">
      <Navbar />
      
      {/* Main Content */}
      <div className="collectors-main">
        {/* Header Section */}
        <div className="collectors-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <span className="title-icon">👨‍💼</span>
                All Admins
              </h1>
              <p className="page-subtitle">Manage and monitor all admin accounts</p>
              <div className="collectors-count">
                <span className="count-badge">{admins.length}</span>
                Total Admins
              </div>
            </div>

            {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
              <Link to="/addadmin" className="add-collector-btn">
                <span className="btn-icon">➕</span>
                Add New Admin
              </Link>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search admins by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading admins...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={fetchAdmins} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredAdmins.length > 0 ? (
            <div className="collectors-grid">
              {filteredAdmins.map((admin, index) => (
                <div
                  key={admin._id}
                  className="collector-card"
                  onClick={() => handleAdminClick(admin._id)}
                >
                  <div className="card-header">
                    <div className="collector-avatar">
                      {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="collector-info">
                      <h3 className="collector-name">{admin.name}</h3>
                      <p className="collector-email">{admin.email}</p>
                    </div>
                    <div className="card-actions">
                      {isDeleting && admin._id === deletedId ? (
                        <div className="deleting-state">
                          <div className="deleting-spinner"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <Popconfirm
                          title="Delete Admin"
                          description="Are you sure you want to delete this admin? This action cannot be undone."
                          onConfirm={(e) => {
                            deleteAdmin(admin._id);
                            e?.stopPropagation();
                          }}
                          onCancel={(e) => {
                            e?.stopPropagation();
                          }}
                          okText="Yes, Delete"
                          cancelText="Cancel"
                          okType="danger"
                        >
                          <button
                            className="delete-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="delete-icon">🗑️</span>
                            Delete
                          </button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <div className="collector-meta">
                      <span className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className="status-badge active">Active</span>
                      </span>
                      <span className="meta-item">
                        <span className="meta-label">ID</span>
                        <span className="meta-value">{admin._id?.substring(0, 8)}...</span>
                      </span>
                    </div>
                    <div className="view-details">
                      <span className="view-text">Click to view details</span>
                      <span className="arrow-icon">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👨‍💼</div>
              <h3>No Admins Found</h3>
              <p>
                {searchQuery
                  ? "No admins match your search criteria. Try adjusting your search terms."
                  : "No admins have been added yet."}
              </p>
              {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && !searchQuery && (
                <Link to="/addadmin" className="add-first-btn">
                  Add Your First Admin
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAdmins;

