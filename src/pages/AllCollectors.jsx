import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { message } from "antd";
import { Button, Popconfirm } from 'antd';
import './css/Collectors.css'; // New CSS file

const AllClients = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const navigate = useNavigate();
  const token = Cookies.get("Token");

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (
      !token ||
      (token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53" &&
        token !== "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg" &&
        token !== "clientdgf45sdgf@89756dfgdhg&%df")
    ) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const deleteCollector = async (collectorId) => {
    setIsDeleting(true);
    setDeletedId(collectorId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deletecollector/${collectorId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Collector deleted successfully");
        fetchClients();
      } else {
        message.error(result.message || "Failed to delete collector");
      }
    } catch (error) {
      console.error("Error deleting collector:", error);
      message.error("Something went wrong");
    }
    setIsDeleting(false);
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getcollectors`);
      if (!response.ok) {
        throw new Error("Failed to fetch client data");
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data);
        setClients([]);
        return;
      }

      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients(searchQuery);
  }, [searchQuery, clients]);

  const filterClients = (query) => {
    if (!query) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterClients(query);
  };

  const handleClientClick = async (id) => {
    navigate(`/addcollector/${id}`);
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
                <span className="title-icon">👥</span>
                All Collectors
              </h1>
              <p className="page-subtitle">Manage and monitor all collector accounts</p>
              <div className="collectors-count">
                <span className="count-badge">{clients.length}</span>
                Total Collectors
              </div>
            </div>

            {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
              <Link to="/addcollector" className="add-collector-btn">
                <span className="btn-icon">➕</span>
                Add New Collector
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
              placeholder="Search collectors by name or email..."
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
              <p>Loading collectors...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={fetchClients} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="collectors-grid">
              {filteredClients.map((client, index) => (
                <div
                  key={client._id}
                  className="collector-card"
                  onClick={() => handleClientClick(client._id)}
                >
                  <div className="card-header">
                    <div className="collector-avatar">
                      {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="collector-info">
                      <h3 className="collector-name">{client.name}</h3>
                      <p className="collector-email">{client.email}</p>
                    </div>
                    <div className="card-actions">
                      {isDeleting && client._id === deletedId ? (
                        <div className="deleting-state">
                          <div className="deleting-spinner"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <Popconfirm
                          title="Delete Collector"
                          description="Are you sure you want to delete this collector? This action cannot be undone."
                          onConfirm={(e) => {
                            deleteCollector(client._id);
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
                        <span className="meta-value">{client._id?.substring(0, 8)}...</span>
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
              <div className="empty-icon">👥</div>
              <h3>No Collectors Found</h3>
              <p>
                {searchQuery
                  ? "No collectors match your search criteria. Try adjusting your search terms."
                  : "No collectors have been added yet."}
              </p>
              {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && !searchQuery && (
                <Link to="/addcollector" className="add-first-btn">
                  Add Your First Collector
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllClients;