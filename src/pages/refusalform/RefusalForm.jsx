import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from 'antd';
import ReactSignatureCanvas from 'react-signature-canvas';
import './refusalform.css';

const RefusalForm = () => {
  const { jobId } = useParams(); // if route is /refusalform/:jobId

  // Form state
  const [failReason, setFailReason] = useState("");
  const [refuseReason, setRefuseReason] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorTime, setDonorTime] = useState("");
  const [donorDate, setDonorDate] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerTime, setOfficerTime] = useState("");
  const [officerDate, setOfficerDate] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [witnessTime, setWitnessTime] = useState("");
  const [witnessDate, setWitnessDate] = useState("");
  const [witnessRole, setWitnessRole] = useState("");

  const [formData, setFormData] = useState({
    document: '',
    rev: '',
    docRef: '',
    date: '',
  });

  // signature refs
  const donorSigRef = useRef();
  const officerSigRef = useRef();
  const witnessSigRef = useRef();

  // locked state after sign
  const [donorLocked, setDonorLocked] = useState(false);
  const [officerLocked, setOfficerLocked] = useState(false);
  const [witnessLocked, setWitnessLocked] = useState(false);

  // modal state
  const [activeSig, setActiveSig] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (formData.completed) {
      alert("This Chain of Custody form is completed and cannot be edited.");
    }
  }, [formData.completed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openSigModal = (who) => {
    if (who === 'donor' && donorLocked) return;
    if (who === 'officer' && officerLocked) return;
    if (who === 'witness' && witnessLocked) return;
    setActiveSig(who);
  };

  const handleSaveSig = () => {
    if (activeSig === 'donor') setDonorLocked(true);
    if (activeSig === 'officer') setOfficerLocked(true);
    if (activeSig === 'witness') setWitnessLocked(true);
    setActiveSig(null);
  };

  const getSignatureData = (ref) => {
    if (!ref.current || ref.current.isEmpty()) return null;
    return ref.current.getCanvas().toDataURL('image/png');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");

    const donorSignature = getSignatureData(donorSigRef);
    const officerSignature = getSignatureData(officerSigRef);
    const witnessSignature = getSignatureData(witnessSigRef);

    const payload = {
      jobId,
      failReason,
      refuseReason,
      donor: { name: donorName, time: donorTime, date: donorDate, signature: donorSignature },
      officer: { name: officerName, time: officerTime, date: officerDate, signature: officerSignature },
      witness: { name: witnessName, time: witnessTime, date: witnessDate, role: witnessRole, signature: witnessSignature },
      meta: formData,
    };

    try {
      setSubmitting(true);
      const base = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.101:1338";
      const res = await fetch(`${base.replace(/\/$/, '')}/refusalform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setStatusMsg(`Failed to save form (${res.status}): ${text}`);
        return;
      }

      setStatusMsg("Form saved successfully.");
      console.log('Form submitted', await res.json());
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to save form - please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container refusal-form">
      <div className="form-header">
        <div>
          <h3>Failure to Provide / Refusal to Consent to the Provision of a Sample</h3>
          <p className="form-desc">
            I understand that I have been requested by my Employer to consent to and provide an appropriate sample(s) in accordance with their Drug and Alcohol policy.
          </p>
          {jobId && <p className="job-info">Job ID: <b>{jobId}</b></p>}
        </div>
        <div className="logo-box">
          <img
            src="https://screen4.org/wp-content/uploads/2023/02/Screen4-RGB.png"
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

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label className="bold-label">
            <span className="bullet-point">&bull;</span> I have failed to provide an appropriate sample of <b>Breath / Urine / Oral fluid</b> because:
          </label>
          <div className="delete-note">(Delete if not applicable)</div>
          <textarea rows="3" className="large-textarea" value={failReason} onChange={e => setFailReason(e.target.value)} required />
        </div>

        <div className="form-section">
          <label className="bold-label">
            <span className="bullet-point">&bull;</span> I DO NOT consent to provide a sample of <b>Breath / Urine / Oral fluid</b> because:
          </label>
          <div className="delete-note">(Delete if not applicable)</div>
          <textarea rows="3" className="large-textarea" value={refuseReason} onChange={e => setRefuseReason(e.target.value)} required />
        </div>

        <div className="table-section">
          {/* Donor */}
          <table className="refusal-table">
            <tbody>
              <tr>
                <th>Donor's Name</th><th>Time</th><th>Date</th>
              </tr>
              <tr>
                <td><input type="text" value={donorName} onChange={e => setDonorName(e.target.value)} required /></td>
                <td><input type="time" value={donorTime} onChange={e => setDonorTime(e.target.value)} required /></td>
                <td><input type="date" value={donorDate} onChange={e => setDonorDate(e.target.value)} required /></td>
              </tr>
              <tr><th colSpan="3">Donor's Signature</th></tr>
              <tr>
                <td colSpan="3">
                  <div className="signature-preview" onClick={() => openSigModal('donor')}>
                    {donorLocked
                      ? <img src={getSignatureData(donorSigRef)} alt="Donor Signature" />
                      : <span>Click to Sign</span>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Officer */}
          <table className="refusal-table">
            <tbody>
              <tr>
                <th>Collection Officer's Name</th><th>Time</th><th>Date</th>
              </tr>
              <tr>
                <td><input type="text" value={officerName} onChange={e => setOfficerName(e.target.value)} required /></td>
                <td><input type="time" value={officerTime} onChange={e => setOfficerTime(e.target.value)} required /></td>
                <td><input type="date" value={officerDate} onChange={e => setOfficerDate(e.target.value)} required /></td>
              </tr>
              <tr><th colSpan="3">Collection Officer's Signature</th></tr>
              <tr>
                <td colSpan="3">
                  <div className="signature-preview" onClick={() => openSigModal('officer')}>
                    {officerLocked
                      ? <img src={getSignatureData(officerSigRef)} alt="Officer Signature" />
                      : <span>Click to Sign</span>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Witness */}
          <table className="refusal-table">
            <tbody>
              <tr>
                <th>Witness Name</th><th>Time</th><th>Date</th>
              </tr>
              <tr>
                <td><input type="text" value={witnessName} onChange={e => setWitnessName(e.target.value)} required /></td>
                <td><input type="time" value={witnessTime} onChange={e => setWitnessTime(e.target.value)} required /></td>
                <td><input type="date" value={witnessDate} onChange={e => setWitnessDate(e.target.value)} required /></td>
              </tr>
              <tr>
                <th>Job Role / Position</th><th colSpan="2">Witness Signature</th>
              </tr>
              <tr>
                <td><input type="text" className="witness-role-input" value={witnessRole} onChange={e => setWitnessRole(e.target.value)} required /></td>
                <td colSpan="2">
                  <div className="signature-preview" onClick={() => openSigModal('witness')}>
                    {witnessLocked
                      ? <img src={getSignatureData(witnessSigRef)} alt="Witness Signature" />
                      : <span>Click to Sign</span>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer-note">
          <b>Collection Officer:</b> Please attach this form to the white copy of the Chain of Custody Form.
        </div>

        <div className="footer-table-wrap">
          <table className="footer-table">
            <tbody>
              <tr>
                <td>Document:</td>
                <td><input type="text" name="document" value={formData.document} onChange={handleChange} /></td>
                <td>Rev:</td>
                <td><input type="text" name="rev" value={formData.rev} onChange={handleChange} /></td>
              </tr>
              <tr>
                <td>Doc Ref:</td>
                <td><input type="text" name="docRef" value={formData.docRef} onChange={handleChange} /></td>
                <td>Date:</td>
                <td><input type="date" name="date" value={formData.date} onChange={handleChange} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {statusMsg && (
          <div className={`submit-status ${statusMsg.includes('Failed') ? 'error' : 'success'}`}>{statusMsg}</div>
        )}

        <button type="submit" className="submit-btn-green" disabled={submitting}>
          {submitting ? 'Saving...' : 'Submit'}
        </button>
      </form>

      {/* Signature Modal */}
      <Modal
        open={!!activeSig}
        onCancel={() => setActiveSig(null)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          <h4>Sign below</h4>
          {activeSig === 'donor' && <ReactSignatureCanvas ref={donorSigRef} penColor="#000" canvasProps={{ width: 400, height: 150, className: 'signature-pad' }} />}
          {activeSig === 'officer' && <ReactSignatureCanvas ref={officerSigRef} penColor="#000" canvasProps={{ width: 400, height: 150, className: 'signature-pad' }} />}
          {activeSig === 'witness' && <ReactSignatureCanvas ref={witnessSigRef} penColor="#000" canvasProps={{ width: 400, height: 150, className: 'signature-pad' }} />}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => {
              if (activeSig === 'donor') donorSigRef.current.clear();
              if (activeSig === 'officer') officerSigRef.current.clear();
              if (activeSig === 'witness') witnessSigRef.current.clear();
            }}>Clear</button>
            <button style={{ marginLeft: '10px' }} onClick={handleSaveSig}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RefusalForm;
