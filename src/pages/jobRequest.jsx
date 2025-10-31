import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Cookies from "js-cookie";
import { message, Pagination, Popconfirm, Spin, Modal } from "antd";
import './css/JobRequests.css';

const JobRequests = () => {
  const [client, setClient] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("Token");
  const clientId = Cookies.get("id");
  const collectorId = Cookies.get("id");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailId, setEmailId] = useState(null);
  const [collectorDetailsModal, setCollectorDetailsModal] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const isClient = token === 'clientdgf45sdgf89756dfgdhgdf';
  
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

  // ✅ Delete Job Request
  const deleteJobRequest = async (jobId) => {
    setIsDeleting(true);
    setDeletedId(jobId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/deletejobrequest/${jobId}`, {
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

  // ✅ Fetch Collector COC Form
  const fetchAcceptedById = async (jobId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getcollectorcocform/${jobId}/${collectorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collector COC form");
      }

      const data = await response.json();
      return data.data?._id;
    } catch (error) {
      console.error("Error fetching collector COC form:", error);
      return null;
    }
  };

  // ✅ Fetch Job Details with Collectors
  const fetchJobDetailsWithCollectors = async (jobId) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/getjobrequestwithcollectors/${jobId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch job details");
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching job details:", error);
      message.error("Failed to load job details");
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  // ✅ Handle View Details Click
  const handleViewDetails = async (jobId, event) => {
    event.stopPropagation();
    
    const jobDetails = await fetchJobDetailsWithCollectors(jobId);
    if (jobDetails) {
      setSelectedJobDetails(jobDetails);
      setCollectorDetailsModal(true);
    }
  };

  // ✅ Main Data Fetch Function
  const fetchScreen4Data = async (pageNumber = 1, currentTab = selectedTab, query = searchQuery) => {
    if (isClient) currentTab = "Completed";
    setLoading(true);

    try {
      let url = "";
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      // ✅ Collector portal
      if (token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg") {
        const statusParam = currentTab.toLowerCase();
        url = `${baseUrl}/getjobsbycollector/${collectorId}?status=${statusParam}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch collector jobs");
        
        const data = await response.json();
        
        setClient(data.data || []);
        setFilteredClients(data.data || []);
        setTotalItems(data.count || data.data?.length || 0);
        setTotalPages(1);
        setPage(1);
        
      } else {
        // ✅ Admin/Client flow
        url = `${baseUrl}/getjobrequests?id=${clientId}&status=${currentTab.toLowerCase()}&page=${pageNumber}&limit=${limit}&token=${encodeURIComponent(token.toString())}&search=${encodeURIComponent(query)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch job requests");
        
        const data = await response.json();
        setClient(data.data || []);
        setFilteredClients(data.data || []);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
        setPage(data.currentPage);
      }
    } catch (err) {
      console.error("Error fetching job requests:", err);
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

  useEffect(() => {
    fetchScreen4Data(page, selectedTab, searchQuery);
  }, []);

  // If Layout navigates here with results or a query, use them
  useEffect(() => {
    const state = location.state || {};
    const qFromState = (state.q || "")?.toString();
    const results = Array.isArray(state.searchResults) ? state.searchResults : null;

    const params = new URLSearchParams(location.search);
    const qFromUrl = params.get("q") || "";

    const incomingQuery = (qFromState || qFromUrl).toString().trim().toLowerCase();

    if (results) {
      setClient(results);
      setFilteredClients(results);
      setTotalItems(state.pagination?.totalItems ?? results.length);
      setTotalPages(state.pagination?.totalPages ?? 1);
      setPage(state.pagination?.currentPage ?? 1);
      setSearchQuery(incomingQuery);
    } else if (incomingQuery) {
      setSearchQuery(incomingQuery);
      setPage(1);
      fetchScreen4Data(1, selectedTab, incomingQuery);
    }
  }, [location]);

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

  // ✅ View COC Forms
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

  // ✅ Handle Client Click
  const handleClientClick = async (id) => {
    // ✅ Collector - Pending Jobs
    if (selectedTab === 'Pending' && token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg') {
      navigate(`/jobrequest/${id}`);
      return;
    }

    // ✅ Collector - Accepted Jobs
    if (selectedTab === 'Accepted' && token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg') {
      try {
        const cocFormId = await fetchAcceptedById(id);
        if (cocFormId) {
          navigate(`/dashboard/${cocFormId}`);
        } else {
          navigate(`/coc-form/${id}?collectorId=${collectorId}`);
        }
      } catch (error) {
        console.error("Error navigating:", error);
        navigate(`/coc-form/${id}?collectorId=${collectorId}`);
      }
      return;
    }

    // ✅ Admin / Client: open CHAIN OF CUSTODY form directly when clicking the card
    if (token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" || token === "clientdgf45sdgf89756dfgdhgdf") {
      // include collectorId query if available (collectorId may be same as clientId)
      navigate(`/coc-form/${id}?collectorId=${collectorId}`);
      return;
    }

    // Fallback: open job request edit/view
    navigate(`/jobrequest/${id}`);
  };

  // ✅ Send Email
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

  // ✅ Collector Details Modal Component
  const CollectorDetailsModal = () => {
    if (!selectedJobDetails) return null;

    return (
      <Modal
        title={
          <div className="modal-header">
            <h3>Job Request Details</h3>
            <div className="job-ref">Ref: {selectedJobDetails.jobReferenceNo}</div>
          </div>
        }
        open={collectorDetailsModal}
        onCancel={() => setCollectorDetailsModal(false)}
        footer={[
          <button 
            key="close" 
            className="modal-close-btn"
            onClick={() => setCollectorDetailsModal(false)}
          >
            Close
          </button>
        ]}
        width={600}
        className="collector-details-modal"
      >
        <div className="job-details-content">
          {/* Job Basic Info */}
          <div className="job-basic-info">
            <div className="info-item">
              <label>Customer:</label>
              <span>{selectedJobDetails.customer}</span>
            </div>
            <div className="info-item">
              <label>Location:</label>
              <span>{selectedJobDetails.location}</span>
            </div>
            <div className="info-item">
              <label>Collection Time:</label>
              <span>
                {new Date(selectedJobDetails.dateAndTimeOfCollection).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Collectors Status */}
          <div className="collectors-section">
            <h4>Collectors Status</h4>
            <div className="collectors-list">
              {selectedJobDetails.collectors?.map((collector, index) => (
                <div key={index} className={`collector-item ${collector.status ? 'accepted' : 'pending'}`}>
                  <div className="collector-info">
                    <div className="collector-name">
                      {collector.collectorsId?.name || 'Unknown Collector'}
                    </div>
                    <div className="collector-email">
                      {collector.collectorsId?.email || 'No email'}
                    </div>
                  </div>
                  <div className="collector-status">
                    <span className={`status-badge ${collector.status ? 'accepted' : 'pending'}`}>
                      {collector.status ? '✅ Accepted' : '⏳ Pending'}
                    </span>
                    {collector.status && (
                      <div className="accepted-time">
                        Accepted
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="status-summary">
            <div className="summary-item">
              <span className="label">Total Collectors:</span>
              <span className="value">{selectedJobDetails.collectors?.length || 0}</span>
            </div>
            <div className="summary-item">
              <span className="label">Accepted:</span>
              <span className="value accepted-count">
                {selectedJobDetails.collectors?.filter(c => c.status).length || 0}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Pending:</span>
              <span className="value pending-count">
                {selectedJobDetails.collectors?.filter(c => !c.status).length || 0}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
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
                          <span className="info-label">Location:</span>
                          <span className="info-value">{client.location}</span>
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
                            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                              <button
                               
                                className="action-btn info"
                              >
                                View COC Forms
                              </button>
                            )} */}
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
                        <span 
                          className="view-text"
                          onClick={(e) => handleViewDetails(client._id, e)}
                        >
                          Click to view collector status
                        </span>
                        <span className="arrow-icon">→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Collector Details Modal */}
              <CollectorDetailsModal />

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
                  : `No ${selectedTab.toLowerCase()} found.`}
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