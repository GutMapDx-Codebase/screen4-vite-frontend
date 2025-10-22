import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { message, Popconfirm } from "antd";
import "./css/allClient.css";

const AllClients = () => {
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
        token !== "clientdgf45sdgf89756dfgdhgdf")
    ) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const deleteClient = async (collectorId) => {
    setIsDeleting(true);
    setDeletedId(collectorId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deleteclient/${collectorId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Client deleted successfully");
        fetchClients();
      } else {
        message.error(result.message || "Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      message.error("Something went wrong");
    }
    setIsDeleting(false);
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getclients`);
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
      c.contact.includes(query) ||
      c.emails.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleClientClick = async (id) => {
    // Open client in readonly view (ClientHub). Editing should be explicit via an Edit button.
    navigate(`/clients/${id}`);
  };

  return (
    <div className="all-clients-container">
      <Navbar />
      
      <div className="all-clients-header">
        <h1 className="all-clients-title">
          All Clients
          <span className="client-count-badge">
            {clients.length}
          </span>
        </h1>
        
        {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
          <Link to="/addclient" className="add-client-btn">
            <span>+</span>
            Add New Client
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by customer name, email or contact..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Clients List */}
      <div className="clients-grid">
        {loading ? (
          <div className="loading-state">
            <div className="loading-pulse">Loading clients...</div>
          </div>
        ) : error ? (
          <div className="error-state">
            {error}
          </div>
        ) : filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <div
              key={client._id}
              className="client-card"
              onClick={() => handleClientClick(client._id)}
            >
              <div className="client-header">
                <div style={{ flex: 1 }}>
                  <h3 className="client-name">{client.name}</h3>
                  <p className="client-email">{client.emails}</p>
                  {client.contact && (
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
                      📞 {client.contact}
                    </p>
                  )}
                </div>
                
                <Popconfirm
                  title="Delete Client"
                  description="Are you sure you want to delete this client? This action cannot be undone."
                  onConfirm={(e) => {
                    deleteClient(client._id);
                    e?.stopPropagation();
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <button
                    className="delete-btn"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeleting && client._id === deletedId}
                  >
                    {isDeleting && client._id === deletedId ? "Deleting..." : "Delete"}
                  </button>
                </Popconfirm>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            {searchQuery ? "No clients found matching your search." : "No clients available."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClients;