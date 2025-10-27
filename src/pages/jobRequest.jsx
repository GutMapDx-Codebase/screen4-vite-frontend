import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { message, Pagination, Popconfirm, Spin } from "antd";
import './css/JobRequests.css'; // New CSS file

const JobRequests = () => {
  const [client, setClient] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [acceptedById, setAcceptedById] = useState();
  const [jobRequesId, setJobRequestId] = useState();
  const [cocId, setCocId] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("Token");
  const clientId = Cookies.get("id");
  const collectorId = Cookies.get("id");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailId, setEmailId] = useState(null);
const isClient = token==='clientdgf45sdgf89756dfgdhgdf'
  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  useEffect(() => {
    token === "clientdgf45sdgf89756dfgdhgdf" && setSelectedTab("Completed");
  }, [token]);

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

  const deleteJobRequest = async (collectorId) => {
    setIsDeleting(true);
    setDeletedId(collectorId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deletejobrequest/${collectorId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Job Request deleted successfully");
        fetchScreen4Data();
      } else {
        message.error(result.message || "Failed to delete Job Request");
      }
    } catch (error) {
      console.error("Error deleting Job Request:", error);
      message.error("Something went wrong");
    }
    setIsDeleting(false);
  };

  const fetchAcceptedById = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getcollectorcocform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch acceptedBy ID");
      }

      const data = await response.json();
      return data._id;
    } catch (error) {
      console.error("Error fetching acceptedBy ID:", error);
    }
  };

  const fetchScreen4Data = async (pageNumber = 1, currentTab = selectedTab, query = searchQuery) => {
    if(isClient){
      currentTab='Completed'
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getjobrequests?id=${clientId}&status=${currentTab.toLowerCase()}&page=${pageNumber}&limit=${limit}&id=${collectorId}&token=${encodeURIComponent(token.toString())}&search=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error("Failed to fetch job requests");

      const data = await response.json();
      setClient(data.data || []);
      setFilteredClients(data.data || []);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
      setPage(data.currentPage);
      if (token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg") {
        filterClients();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token !== "clientdgf45sdgf89756dfgdhgdf") {
      fetchScreen4Data(page, selectedTab, searchQuery);
    }
  }, [page, selectedTab]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // const fetchScreen4Databyclients = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/getjobrequestsbyclients/${clientId}`
  //     );
  //     if (!response.ok) {
  //       if (response.status === 404) {
  //         setError("No job requests found for this client.");
  //       } else if (response.status === 500) {
  //         throw new Error("Failed to fetch client data");
  //       }
  //     }
  //     const data = await response.json();
  //     setClient(data.data || []);
  //     setFilteredClients(data.data || []);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // if (token !== "clientdgf45sdgf89756dfgdhgdf") {
      fetchScreen4Data(page, selectedTab, searchQuery);
    // } else {
    //   fetchScreen4Databyclients();
    // }
  }, []);

  const filterClients = (tab, query) => {
    let filtered = client;
    if (tab === "Accepted") {
      filtered = client.filter((c) => {
        if (token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg") {
          return String(c?.acceptedBy) === String(collectorId);
        }
        return c?.isAccepted && !c?.isCompleted;
      });
    } else if (tab === "Completed") {
      filtered = client.filter((c) => {
        if (token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg") {
          return c?.isCompleted && String(c?.acceptedBy) === String(collectorId);
        }
        return c?.isAccepted && c?.isCompleted;
      });
    }

    filtered = filtered.filter(
      (c) =>
        c.customer?.toLowerCase().includes(query) ||
        c.jobReferenceNo?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query) ||
        c.dateAndTimeOfCollection?.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  useEffect(() => {
    filterClients(selectedTab, searchQuery);
  }, [client, selectedTab, searchQuery]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setPage(1);
    fetchScreen4Data(1, tab, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setPage(1);
    fetchScreen4Data(1, selectedTab, query);
  };

  // Function to view COC forms
  const viewCOCForms = async (jobId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getcocforms/${jobId}`
      );
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        navigate(`/job-coc-forms/${jobId}`);
      } else {
        message.info("No COC forms found for this job");
      }
    } catch (error) {
      console.error("Error fetching COC forms:", error);
      message.error("Failed to fetch COC forms");
    }
  };

  const showFormSelectionModal = async (id) => {
    const modal = Modal.confirm({
      title: 'Select Form Type',
      content: 'Please select which form you want to fill:',
      okText: 'COC Form',
      cancelText: 'Refusal Form',
      onOk: () => {
        // Redirect to COC form
        navigate(`/job-coc-forms/${id}`);
      },
      onCancel: () => {
        // Redirect to Refusal form
        navigate(`/refusalform/${id}`);
      }
    });
  };

  const handleClientClick = async (id) => {
    if (selectedTab === 'Pending' && token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg') {
      try {
        const collectorFormId = await fetchAcceptedById(id);
        if (collectorFormId) {
          // Show modal to choose between COC and Refusal form
          showFormSelectionModal(id);
        } else {
          navigate(`/jobrequest/${id}`);
        }
      } catch (error) {
        console.error("Error navigating:", error);
        navigate(`/jobrequest/${id}`);
      }
    } else if (selectedTab === 'Pending') {
      navigate(`/jobrequest/${id}`);
    } else if (selectedTab === 'Accepted') {
      try {
        const collectorFormId = await fetchAcceptedById(id);
        console.log('fetchAcceptedById for job', id, 'returned', collectorFormId);
        if (collectorFormId) {
          navigate(`/dashboard/${collectorFormId}`);
        } else {
          // If no collector-specific form id is returned, fall back to opening
          // the COC form route directly for collectors (helps when backend
          // doesn't return the expected id).
          if (token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg') {
            console.warn('No collectorFormId returned — falling back to COC form route');
            navigate(`/coc-form/${id}?collectorId=${collectorId}`);
          } else {
            console.error('Collector Form ID not found');
          }
        }
      } catch (error) {
        console.error("Error navigating:", error);
        // On error, allow collectors to still open the COC form directly
        if (token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg') {
          navigate(`/coc-form/${id}?collectorId=${collectorId}`);
        }
      }
    }
  };

  const handleSendEmail = async (client, event) => {
    setSendingEmail(true);
    setEmailId(client._id);
    event.stopPropagation();

    if (client.isEmailed) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sendscreenemailtodonor/${client._id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setFilteredClients((prevClients) =>
        prevClients.map((c) =>
          c._id === client._id ? { ...c, isEmailed: true } : c
        )
      );
    } catch (err) {
      console.error(err.message);
    }
    setSendingEmail(false);
  };

  return (
    <div className="job-requests-container">
      <Navbar />
      <div className="job-requests-main">
        {/* Header Section */}
        <div className="requests-header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <span className="title-icon">📋</span>
                Job Requests
              </h1>
              <p className="page-subtitle">Manage and track all job requests</p>
              <div className="requests-count">
                <span className="count-badge">{totalItems || 0}</span>
                Total {selectedTab} Requests
              </div>
            </div>

            {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
              <Link to="/screen4testform2" className="create-request-btn">
                <span className="btn-icon">➕</span>
                Create Job Request
              </Link>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        {token !== "clientdgf45sdgf89756dfgdhgdf" && (
          <div className="tabs-section">
            <div className="tabs-container">
              {["Pending", "Accepted", "Completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Search by customer, job reference number, or location..."
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
              <p>Loading {selectedTab} Job Requests...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={() => fetchScreen4Data()} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : filteredClients.length > 0 ? (
            <>
              <div className="requests-grid">
                {filteredClients.map((client, index) => (
                  <div
                    key={client._id}
                    className="request-card"
                    onClick={() => handleClientClick(client._id)}
                  >
                    <div className="card-header">
                      <div className="request-info">
                        <div className="info-row">
                          <span className="info-label">Job Reference:</span>
                          <span className="info-value">{client.jobReferenceNo}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Customer:</span>
                          <span className="info-value">{client.customer}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Collector:</span>
                          <span className="info-value">{client.collector?.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Collection Time:</span>
                          <span className="info-value">
                            {new Date(client.dateAndTimeOfCollection).toLocaleString("en-US", {
                              timeZone: "UTC",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                        {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                          <div className="info-row">
                            <span className="info-label">Form Status:</span>
                            <span className="info-value" style={{ color: client.refusalForm ? 'red' : client.cocForm ? 'green' : 'orange' }}>
                              {client.refusalForm ? 'Refusal Form Filled' : client.cocForm ? 'COC Form Filled' : 'No Form Filled'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="card-actions">
                        {/* Accepted Tab Actions */}
                        {selectedTab === "Accepted" && (
                          <div className="action-buttons">
                            <button
                              onClick={(e) => { navigate(`/jobrequest/${client._id}`); e.stopPropagation() }}
                              className="action-btn primary"
                            >
                              Update Timesheet
                            </button>
                            <button
                              onClick={(e) => { navigate(`/refusalform/${client._id}`); e.stopPropagation() }}
                              className="action-btn secondary"
                            >
                              Refusal Form
                            </button>
                          </div>
                        )}

                        {/* Pending Tab Actions */}
                        {selectedTab === "Pending" && token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                          <div className="action-buttons">
                            {isDeleting && client._id === deletedId ? (
                              <div className="deleting-state">
                                <div className="deleting-spinner"></div>
                                <span>Deleting...</span>
                              </div>
                            ) : (
                              <Popconfirm
                                title="Delete Job Request"
                                description="Are you sure you want to delete this job request? This action cannot be undone."
                                onConfirm={(e) => {
                                  deleteJobRequest(client._id);
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
                                  className="action-btn danger"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="btn-icon">🗑️</span>
                                  Delete
                                </button>
                              </Popconfirm>
                            )}
                          </div>
                        )}

                        {/* Completed Tab Actions */}
                        {selectedTab === "Completed" && (
                          <div className="action-buttons">
                            {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                              <>
                                {sendingEmail && client._id === emailId ? (
                                  <div className="sending-state">
                                    <div className="sending-spinner"></div>
                                    <span>Sending...</span>
                                  </div>
                                ) : (
                                  <button
                                    className={`action-btn ${client.isEmailed ? 'disabled' : 'primary'}`}
                                    onClick={(event) => handleSendEmail(client, event)}
                                    disabled={client.isEmailed}
                                  >
                                    <span className="btn-icon">📧</span>
                                    {client.isEmailed ? "Email Sent" : "Send Email"}
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => window.open(`/jobrequest/${client._id}`, '_blank')}
                              className="action-btn secondary"
                            >
                              Job Request
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const collectorFormId = await fetchAcceptedById(client._id);
                                  if (collectorFormId) {
                                    window.open(`/dashboard/${collectorFormId}`, '_blank');
                                  }
                                } catch (error) {
                                  console.error("Error navigating:", error);
                                }
                              }}
                              className="action-btn secondary"
                            >
                              COC Form
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="status-indicator">
                        <span className={`status-badge ${selectedTab.toLowerCase()}`}>
                          {selectedTab}
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

              {/* Pagination */}
              <div className="pagination-section">
                <Pagination
                  current={page}
                  total={totalItems}
                  pageSize={limit}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Job Requests Found</h3>
              <p>
                {searchQuery
                  ? "No job requests match your search criteria. Try adjusting your search terms."
                  : `No ${selectedTab.toLowerCase()}  found.`}
              </p>
              {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && !searchQuery && (
                <Link to="/screen4testform2" className="create-first-btn">
                  Create Your First Job Request
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobRequests;