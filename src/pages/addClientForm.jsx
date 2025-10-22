import React, { useEffect, useState } from "react";
import { Card, Select, Input, Button, Form, Upload, message, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export default function AddClientForm() {
  const [isloading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [selectedTestMethods, setSelectedTestMethods] = useState([]);
  const [client, setClient] = useState({
    name: "",
    contact: "",
    hqAddress: [{ address: "", contactName: "", contactEmail: "" }],
    operationalBases: [{ address: "", contact: "" }],
    emails: "",
    password: "",
    testMethods: [],
    testingTechnology: [],
    cutOffLevels: "",
    costings: "",
    jobPack: "",
    location: "",
    NameofOnsiteContact: "",
    Contacttelephoneno: "",

    // NEW FIELDS
    secondBreathTestRequired: "No",        // "Yes" or "No"
    drugKitType: "",                        // e.g. "Urine" or "Oral Fluid"
    nonNegativeSamplesToLab: "No",         // "Yes" or "No"
    laboratoryAddress: "",                 // Text
    sampleDeliveryMethod: "",
  });

  const testMethodOptions = [
    "Random Testing",
    "Pre-Employment Testing",
    "Follow up Testing",
    "With Cause Testing",
  ];

  const TypeOfTestOptions = [
    "Breath Alcohol",
    "Urine POCT/BtL",
    "Oral fluid POCT/BtL",
    "Non-Negative Samples to Lab",
  ];

  const testingTechnologyOptions = {
    "Random Testing": [
      "Random - Breath Alcohol",
      "Random - Breath Alcohol and Drug – Urine",
      "Random - Breath Alcohol and Drug – Oral Fluid",
      "Random - Breath Alcohol and Drug - Hair",
    ],
    "Pre-Employment Testing": ["Pre-Employment - Hair Testing"],
    "Follow up Testing": [
      "Follow up - Breath Alcohol",
      "Follow up - Breath Alcohol and Drug – Urine",
      "Follow up - Breath Alcohol and Drug – Oral Fluid",
      "Follow up - Breath Alcohol and Drug - Hair",
    ],
    "With Cause Testing": [
      "With Cause - Breath Alcohol",
      "With Cause - Breath Alcohol and Drug – Urine",
      "With Cause - Breath Alcohol and Drug – Oral Fluid",
      "With Cause - Breath Alcohol and Drug - Hair",
    ],
  };
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/getclients/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        const data = await response.json();

        console.log("Fetched client data:", data); // Check API response structure

        if (!data || typeof data !== "object") {
          console.error("Unexpected response format:", data);
          return;
        }

        // setClient((prev) => ({
        //   ...prev,
        //   ...data, // Merge fetched data with the existing client structure
        // }));
        const { password, ...filteredData } = data;

        setClient((prev) => ({
          ...prev,
          ...filteredData, // Merge fetched data without password
          password: "", // Ensure password remains blank
        }));
      } catch (err) {
        // setError(err.message);
      } finally {
        console.log("final");
        console.log(client);
        // setLoading(false);
      }
    };

    if (id) fetchClients();
  }, [id]);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (
      !token ||
      (token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53" 
       &&
        token !== "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"
       &&
        token !== "clientdgf45sdgf89756dfgdhgdf")
    ) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const addNewSite = () => {
    setClient((prev) => ({
      ...prev,
      hqAddress: [...prev.hqAddress, { address: "", contactName: "", contactEmail: "" }],
    }));
  };

  const updateSiteField = (index, field, value) => {
    setClient((prev) => {
      const updated = [...prev.hqAddress];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, hqAddress: updated };
    });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields(); // <- Triggers Ant Design validations
    } catch (validationError) {
      return; // ❌ Stop if form is invalid
    }
    setIsLoading(true);
    try {
      let jobPackUrl = client.jobPack;
      const fileList = form.getFieldValue("jobPack")?.fileList;

      if (fileList && fileList.length > 0) {
        const file = fileList[0].originFileObj;
        const storageRef = ref(imageDb, `jobpacks/${uuidv4()}_${file.name}`);
        await uploadBytes(storageRef, file);
        jobPackUrl = await getDownloadURL(storageRef);
      }

      const payload = { ...client, jobPack: jobPackUrl };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${client._id ? `updateclient/${client._id}` : "addclient"}`,
        {
          method: client._id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success(client._id ? "Client updated successfully!" : "Client added successfully!");
        navigate("/clients");
      } else {
        message.error("Error: " + data.message);
      }
    } catch (error) {
      message.error("Request failed. Please try again.");
    }
  };

  return (
    <div className="mainaddclient" style={{ padding: 20, display: "grid", placeItems: "center" }}>
      {/* <Card title="Add Client" style={{ width: 1300 }}>
        <Tooltip title="Back">
              <div
                onClick={() => navigate('/jobrequests')}
                style={{
                  cursor: 'pointer',
                  display: 'inline-block',
                  padding: '5px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease',
                }}
                className="back-btn"
              >
                <img
                  src="/backbtn.png"
                  alt="Back"
                  style={{ width: '20px' }}
                />
              </div>
            </Tooltip> */}
            <Card style={{ width: 1300 }}>
  {/* Custom Header */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Tooltip title="Back">
      <div
        onClick={() => navigate('/clients')}
        style={{
          cursor: 'pointer',
          padding: '5px',
          borderRadius: '4px',
          transition: 'background-color 0.3s ease',
        }}
        className="back-btn"
      >
        <img
        className="backbtnimg"
          src="/backbtn.png"
          alt="Back"
          style={{ width: '20px', marginBottom: '10px' }}
        />
      </div>
    </Tooltip>

    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>Add Client</h2>
  </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Client Name">
            <Input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
          </Form.Item>

          <Form.Item label="Contact">
            <Input value={client.contact} onChange={(e) => setClient({ ...client, contact: e.target.value })} />
          </Form.Item>

          {client.hqAddress.map((site, index) => (
            <div key={index} style={{ padding: 10, border: "1px solid #ccc", marginBottom: 15, borderRadius: 6 }}>
              <p>{index === 0 ? "HQ Address" : `Site Address ${index}`}</p>
              <Input.TextArea
                placeholder="Enter address"
                value={site.address}
                onChange={(e) => updateSiteField(index, "address", e.target.value)}
                style={{ marginBottom: 8 }}
              />
              {index !== 0 && (
                <>
                  <Input
                    placeholder="Site Contact Name"
                    value={site.contactName}
                    onChange={(e) => updateSiteField(index, "contactName", e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <Input
                    placeholder="Site Contact Email"
                    value={site.contactEmail}
                    onChange={(e) => updateSiteField(index, "contactEmail", e.target.value)}
                  />
                </>
              )}
            </div>
          ))}

          <Button onClick={addNewSite} style={{ marginBottom: 30 }}>
            + Add Additional Site Address
          </Button>

          {/* <Form.Item label="Main Contact Email Address">
            <Input.TextArea
              value={client.emails}
              onChange={(e) => setClient({ ...client, emails: e.target.value })}
            />
          </Form.Item> */}

<Form.Item
  label="Main Contact Email Address"
  name="emails"
  rules={[
    { required: true, message: "Please input the client's email!" },
    { type: 'email', message: "Enter a valid email address" }
  ]}
>
  <Input.TextArea
    value={client.emails}
    onChange={(e) => setClient({ ...client, emails: e.target.value })}
  />
</Form.Item>


          <Form.Item label="Password">
            <Input.Password
              value={client.password}
              onChange={(e) => setClient({ ...client, password: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Test Methods">
            <Select
              mode="multiple"
              value={client.testMethods}
              onChange={(value) => {
                setClient({ ...client, testMethods: value });
                setSelectedTestMethods(value);
              }}
              placeholder="Select test methods"
            >
              {testMethodOptions.map((method) => (
                <Select.Option key={method} value={method}>
                  {method}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Testing Technologies">
            <Select
              mode="multiple"
              value={client.testingTechnology}
              onChange={(value) => setClient({ ...client, testingTechnology: value })}
              placeholder="Select testing technologies"
            >
              {selectedTestMethods.flatMap((method) => testingTechnologyOptions[method] || []).map((tech) => (
                <Select.Option key={tech} value={tech}>
                  {tech}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Breath Alcohol Cut off Level">
            <Select
              value={client.cutOffLevels}
              onChange={(value) => setClient({ ...client, cutOffLevels: value })}
              placeholder="Select Cut Off Level"
            >
              {['N/A', '0', '8', '22', '35'].map((level) => (
                <Select.Option key={level} value={level}>{level}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Costings">
            <Input
              value={client.costings}
              onChange={(e) => setClient({ ...client, costings: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Location">
            <Input
              value={client.location}
              onChange={(e) => setClient({ ...client, location: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Name of Onsite Contact">
            <Input
              value={client.NameofOnsiteContact}
              onChange={(e) => setClient({ ...client, NameofOnsiteContact: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Contact telephone no.">
            <Input
              value={client.Contacttelephoneno}
              onChange={(e) => setClient({ ...client, Contacttelephoneno: e.target.value })}
            />
          </Form.Item>

           <Form.Item label="Type Of Test">
            <Select
              mode="multiple"
              value={client.TypeOfTestOptions}
              onChange={(value) => {
                setClient({ ...client, TypeOfTestOptions: value });
                setSelectedTestMethods(value);
              }}
              placeholder="Type Of Test"
            >
              {TypeOfTestOptions.map((method) => (
                <Select.Option key={method} value={method}>
                  {method}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Client Details">
  <table style={{ width: "100%" }}>
    <tbody>
          <tr>
  <td><strong>Second Breath Test Required?</strong></td>
  <td>
    <label>
      <input
        type="radio"
        name="secondBreathTestRequired"
        value="Yes"
        checked={client.secondBreathTestRequired === "Yes"}
        onChange={(e) => setClient({ ...client, secondBreathTestRequired: e.target.value })}
      /> Yes
    </label>
    <label style={{ marginLeft: "15px" }}>
      <input
        type="radio"
        name="secondBreathTestRequired"
        value="No"
        checked={client.secondBreathTestRequired === "No"}
        onChange={(e) => setClient({ ...client, secondBreathTestRequired: e.target.value })}
      /> No
    </label>
  </td>
</tr>

<tr>
  <td><strong>Drugs (Kit Type)</strong></td>
  <td>
    <select
     className="drugsselect"
      value={client.drugKitType}
      onChange={(e) => setClient({ ...client, drugKitType: e.target.value })}
    >
      <option value="" disabled>Select Kit Type</option>
      <option value="Urine">Urine (POCT 10 Panel cup / BtL)</option>
      <option value="Oral Fluid">Oral Fluid (POCT 9NR / Oral-Eze BtL)</option>
    </select>
  </td>
</tr>

<tr>
  <td><strong>Non-Negative Samples to Lab?</strong></td>
  <td>
    <label>
      <input
        type="radio"
        name="nonNegativeSamplesToLab"
        value="Yes"
        checked={client.nonNegativeSamplesToLab === "Yes"}
        onChange={(e) => setClient({ ...client, nonNegativeSamplesToLab: e.target.value })}
      /> Yes
    </label>
    <label style={{ marginLeft: "15px" }}>
      <input
        type="radio"
        name="nonNegativeSamplesToLab"
        value="No"
        checked={client.nonNegativeSamplesToLab === "No"}
        onChange={(e) => setClient({ ...client, nonNegativeSamplesToLab: e.target.value })}
      /> No
    </label>
  </td>
</tr>

<tr>
  <td><strong>Laboratory Address</strong></td>
  <td>
    <Input
      value={client.laboratoryAddress}
      onChange={(e) => setClient({ ...client, laboratoryAddress: e.target.value })}
    />
  </td>
</tr>

<tr>
  <td><strong>Samples Back to Lab</strong></td>
  <td>
    <Input
      value={client.sampleDeliveryMethod}
      onChange={(e) => setClient({ ...client, sampleDeliveryMethod: e.target.value })}
    />
  </td>
</tr>
</tbody>
  </table>
</Form.Item>
{/* 

          <Form.Item label="Upload Job Pack Document" name="jobPack" valuePropName="file">
            <Upload beforeUpload={() => false} accept=".pdf,.doc,.docx" maxCount={1}>
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <div style={{ marginTop: "15px", display: "flex", gap: "15px", alignItems: "center" }}>
            <a
              href={client.jobPack}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                backgroundColor: "#80c209",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                marginBottom: "20px"
              }}
            >
              🔍 View Job Pack
            </a>
          </div> */}

<Form.Item label="Upload Job Pack Document" name="jobPack" valuePropName="file">
  <Upload beforeUpload={() => false} accept=".pdf,.doc,.docx" maxCount={1}>
    <Button>Click to Upload</Button>
  </Upload>
</Form.Item>



{(() => {
  const uploadedFile = form.getFieldValue("jobPack");

  // Case 1: show Firebase URL if client.jobPack is saved
  if (client.jobPack) {
    return (
      <div style={{ marginTop: 15, display: "flex", gap: 15 }}>
        <a
          href={client.jobPack}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 16px",
            backgroundColor: "#80c209",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            marginBottom: "20px"
          }}
        >
          🔍 View Saved Job Pack
        </a>
      </div>
    );
  }

  // Case 2: show preview if file is uploaded but not saved
  if (uploadedFile && uploadedFile.originFileObj) {
    const fileURL = URL.createObjectURL(uploadedFile.originFileObj);
    return (
      <div style={{ marginTop: 15, display: "flex", gap: 15 }}>
        <a
          href={fileURL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 16px",
            backgroundColor: "#f0ad4e",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          👁️ Preview Uploaded File
        </a>
      </div>
    );
  }

  // Case 3: no file at all
  return null;
})()}



          <Form.Item>
            {!isloading ? <button className="createjob2" type="submit" style={submitStyle}>
              {client?._id ? "Update" : "Add"}
            </button> :<div style={{width:"100%",display: "flex",justifyContent:"center"}}><img src="/empty.gif" style={{width:"130px",}}/></div>}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

const viewLinkStyle = {
  padding: "8px 16px",
  backgroundColor: "#80c209",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "bold",
};

const downloadLinkStyle = {
  padding: "8px 16px",
  backgroundColor: "#28a745",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "bold",
};

const submitStyle = {
  width: "100%",
  padding: "10px",
  background: "#80c209",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};