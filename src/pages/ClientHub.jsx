import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/navbar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./css/ClientHub.css";

const PortalCard = ({ title, icon = "✦", children }) => (
  <div className="portal-card">
    <h3 className="card-title">
      <span>{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

function ClientHub() {
  const [jobPackFile, setJobPackFile] = useState(null);
  const [donorInfoFile, setDonorInfoFile] = useState(null);
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const clientEmailQuery = searchParams.get("email") || "";

  const [tab, setTab] = useState(0);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(clientId || "");
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    primaryEmail: "",
    laboratoryAddress: "",
    secondBreathTestRequired: "No",
    drugKitType: "",
    nonNegativeSamplesToLab: "No",
    samplesBackToLabMethod: "",
    cocForm: false,
    resultsSent: false,
  });

  const selectedClient = useMemo(
    () => clients.find((c) => c._id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getclients`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setClients(list);

        if (clientEmailQuery && !selectedClientId) {
          const matched = list.find((c) => c.emails?.includes(clientEmailQuery));
          if (matched) setSelectedClientId(matched._id);
        }
        if (!clientEmailQuery && !selectedClientId && list[0]) {
          setSelectedClientId(list[0]._id);
        }
      } catch (e) {
        console.error("Failed to fetch clients", e);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getjobrequests?status=all`);
        const data = await res.json();
        setJobRequests(Array.isArray(data.data) ? data.data : []);
      } catch (e) {
        console.error("Failed to fetch jobs", e);
      }
    };

    setLoading(true);
    Promise.all([fetchClients(), fetchJobs()]).finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    if (!selectedClient) return [];
    const clientName = selectedClient.name || selectedClient.companyName;
    const clientEmail = selectedClient.emails || selectedClient.email;
    return jobRequests.filter((j) => {
      const matchesName = j.customer?.toLowerCase().includes((clientName || "").toLowerCase());
      const matchesEmail = j.customer?.includes(clientEmail) || false;
      return matchesName || matchesEmail;
    });
  }, [jobRequests, selectedClient]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved data:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getStatusBadge = (job) => {
    if (job.isCompleted) return "status-completed";
    if (job.isAccepted) return "status-accepted";
    return "status-pending";
  };

  const getStatusText = (job) => {
    if (job.isCompleted) return "Completed";
    if (job.isAccepted) return "Accepted";
    return "Pending";
  };

  const tabs = ["Overview", "Contacts & Preferences", "Job Packs", "Job Requests", "Emails"];

  return (
    <div className="client-hub-portal">
      <Navbar />
      
      <div className="portal-container">
        {/* Header */}
        <div className="portal-header">
          <h1 className="portal-title">Client Portal</h1>
          <p className="portal-subtitle">Manage client information, preferences, and job requests</p>
        </div>

        {/* Client Selector */}
        <div className="client-selector-portal">
          <label className="selector-label">Select Client</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="client-dropdown"
          >
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name || c.companyName} {c.emails ? `(${c.emails})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Tabs */}
        <div className="portal-tabs">
          {tabs.map((tabName, index) => (
            <button
              key={index}
              className={`portal-tab ${tab === index ? 'active' : ''}`}
              onClick={() => setTab(index)}
            >
              {tabName}
            </button>
          ))}
        </div>

        {loading && <div className="portal-loading">Loading client data...</div>}
        
        {!loading && selectedClient && (
          <>
            {/* Overview Tab */}
            {tab === 0 && (
              <PortalCard title="Client Overview" icon="👤">
                <div className="overview-grid">
                  <div className="overview-item">
                    <div className="overview-label">Client Name</div>
                    <div className="overview-value">{selectedClient.name || selectedClient.companyName}</div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-label">Primary Email</div>
                    <div className="overview-value">{selectedClient.emails || "-"}</div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-label">Cut Off Level</div>
                    <div className="overview-value">{selectedClient.cutOffLevels || "-"}</div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-label">Default Lab</div>
                    <div className="overview-value">{selectedClient.laboratoryAddress || "-"}</div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-label">Contact Number</div>
                    <div className="overview-value">{selectedClient.contact || "-"}</div>
                  </div>
                  
                  <div className="overview-item">
                    <div className="overview-label">Client Since</div>
                    <div className="overview-value">
                      {selectedClient.createdAt ? new Date(selectedClient.createdAt).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>
              </PortalCard>
            )}

            {/* Contacts & Preferences Tab */}
            {tab === 1 && (
              <PortalCard title="Contacts & Preferences" icon="⚙️">
                {!isEditing ? (
                  <>
                    <div className="preferences-grid">
                      <div className="preference-item">
                        <div className="overview-label">Primary Email</div>
                        <div className="overview-value">{selectedClient.emails || "-"}</div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="overview-label">Second Breath Test Required</div>
                        <div className="overview-value">{selectedClient.secondBreathTestRequired || "-"}</div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="overview-label">Drug Kit Type</div>
                        <div className="overview-value">{selectedClient.drugKitType || "-"}</div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="overview-label">Non-Negative Samples to Lab</div>
                        <div className="overview-value">{selectedClient.nonNegativeSamplesToLab || "-"}</div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="overview-label">Laboratory Address</div>
                        <div className="overview-value">{selectedClient.laboratoryAddress || "-"}</div>
                      </div>
                      
                      <div className="preference-item">
                        <div className="overview-label">Samples Back To Lab (Method)</div>
                        <div className="overview-value">{selectedClient.sampleDeliveryMethod || "-"}</div>
                      </div>
                    </div>
                    
                    <div className="portal-buttons">
                      <button className="portal-btn primary" onClick={handleEdit}>
                        ✏️ Edit Preferences
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="portal-form">
                      <div>
                        <label className="form-label">Primary Email</label>
                        <input
                          type="email"
                          name="primaryEmail"
                          value={formData.primaryEmail}
                          onChange={handleChange}
                          className="form-field"
                          placeholder="Enter primary email"
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Laboratory Address</label>
                        <input
                          type="text"
                          name="laboratoryAddress"
                          value={formData.laboratoryAddress}
                          onChange={handleChange}
                          className="form-field"
                          placeholder="Enter laboratory address"
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Second Breath Test Required</label>
                        <select
                          name="secondBreathTestRequired"
                          value={formData.secondBreathTestRequired}
                          onChange={handleChange}
                          className="form-field"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="form-label">Drug Kit Type</label>
                        <input
                          type="text"
                          name="drugKitType"
                          value={formData.drugKitType}
                          onChange={handleChange}
                          className="form-field"
                          placeholder="Enter drug kit type"
                        />
                      </div>
                      
                      <div>
                        <label className="form-label">Non-Negative Samples to Lab</label>
                        <select
                          name="nonNegativeSamplesToLab"
                          value={formData.nonNegativeSamplesToLab}
                          onChange={handleChange}
                          className="form-field"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="form-label">Samples Back To Lab (Method)</label>
                        <input
                          type="text"
                          name="samplesBackToLabMethod"
                          value={formData.samplesBackToLabMethod}
                          onChange={handleChange}
                          className="form-field"
                          placeholder="Enter delivery method"
                        />
                      </div>
                    </div>
                    
                    <div className="portal-buttons">
                      <button className="portal-btn primary" onClick={handleSave}>
                        💾 Save Changes
                      </button>
                      <button className="portal-btn secondary" onClick={() => setIsEditing(false)}>
                        ❌ Cancel
                      </button>
                    </div>
                  </>
                )}
              </PortalCard>
            )}

            {/* Job Packs Tab */}
            {tab === 2 && (
              <PortalCard title="Job Packs & Donor Info" icon="📁">
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                  Upload and manage standard job pack PDFs and donor information sheets
                </p>
                
                <div className="file-upload-section">
                  <label className="file-btn">
                    📄 Upload Job Pack
                    <input 
                      type="file" 
                      hidden 
                      onChange={e => setJobPackFile(e.target.files[0])} 
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  
                  <label className="file-btn">
                    📋 Upload Donor Info
                    <input 
                      type="file" 
                      hidden 
                      onChange={e => setDonorInfoFile(e.target.files[0])} 
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
                
                {(jobPackFile || donorInfoFile) && (
                  <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <h4 style={{ color: '#ffffff', marginBottom: '10px' }}>Uploaded Files:</h4>
                    {jobPackFile && (
                      <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        📄 {jobPackFile.name}
                      </div>
                    )}
                    {donorInfoFile && (
                      <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📋 {donorInfoFile.name}
                      </div>
                    )}
                  </div>
                )}
              </PortalCard>
            )}

            {/* Job Requests Tab */}
            {tab === 3 && (
              <PortalCard title="Job Requests" icon="📋">
                {filteredJobs.length === 0 ? (
                  <div className="empty-state">
                    No job requests found for this client
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="portal-table">
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>Date & Time</th>
                          <th>Session Info</th>
                          <th>COC Form</th>
                          <th>Lab Results</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <tr key={job._id}>
                            <td>{job.jobReferenceNo}</td>
                            <td>
                              <span className={`status-badge ${getStatusBadge(job)}`}>
                                {getStatusText(job)}
                              </span>
                            </td>
                            <td>{job.location}</td>
                            <td>
                              {job.dateAndTimeOfCollection 
                                ? new Date(job.dateAndTimeOfCollection).toLocaleString() 
                                : "-"
                              }
                            </td>
                            <td>{job.sessionInfo || "-"}</td>
                            <td>
                              {job.cocFormUrl ? (
                                <a href={job.cocFormUrl} target="_blank" rel="noopener noreferrer" className="table-link">
                                  View
                                </a>
                              ) : "-"}
                            </td>
                            <td>
                              {job.labResultsUrl ? (
                                <a href={job.labResultsUrl} target="_blank" rel="noopener noreferrer" className="table-link">
                                  View
                                </a>
                              ) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </PortalCard>
            )}

            {/* Emails Tab */}
            {tab === 4 && (
              <PortalCard title="Email History" icon="✉️">
                <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                  Communication history with collectors, clients, and donors
                </p>
                
                <div style={{ overflowX: 'auto' }}>
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Type</th>
                        <th>Timestamp</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>collector@email.com</td>
                        <td>Job Assigned</td>
                        <td>2025-10-02 10:00</td>
                        <td>
                          <button className="portal-btn secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            🔄 Resend
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>client@email.com</td>
                        <td>COC Form Sent</td>
                        <td>2025-10-02 10:05</td>
                        <td>
                          <button className="portal-btn secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            🔄 Resend
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>donor@email.com</td>
                        <td>Lab Results Sent</td>
                        <td>2025-10-02 10:10</td>
                        <td>
                          <button className="portal-btn secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            🔄 Resend
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </PortalCard>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClientHub;