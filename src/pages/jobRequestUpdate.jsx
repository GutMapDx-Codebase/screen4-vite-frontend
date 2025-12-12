import "./css/profile.css";
import React, { useState } from "react";
import { message, Tooltip } from "antd";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie'

function JobRequestDetails() {
  const [currentSignatureField, setCurrentSignatureField] = useState("");
  const practitionerId = Cookies.get('id')
  const navigate = useNavigate()
  const token = Cookies.get("Token")
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isError, setIsError] = useState(false);
    const [isloading, setIsLoading] = useState(false);
  // const [formData, setFormData] = useState({ donorSignature: "" });
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const [clientDetails,setClientDetails] = useState()
  const [donorOpen, setIsDonorOpen] = useState(false);
  const [donorConcentOpen, setIsDonorConcentOpen] = useState(false);
  const [collectorOpen, setIsCollectorOpen] = useState(false);
  const [collectorCertificationOpen, setIsCollectorCerificationOpen] =
    useState(false);

    const [accepted,setAccepted] = useState(false)
    const { id } = useParams();
   
    const formatDateTimeLocal = (isoString) => {
      if (!isoString) return '';
      return new Date(isoString).toISOString().slice(0, 16); 
    };
    
    const formatDateOnly = (isoString) => {
      if (!isoString) return '';
      return new Date(isoString).toISOString().split('T')[0]; 
    };
    
    useEffect(() => {
      const fetchScreen4Data = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getjobrequest/${id}`);
    
          if (!response.ok) {
            throw new Error("Failed to fetch job request data");
          }
    
          const data = await response.json();
          setAccepted(data.isAccepted)
    
          if (data.data) {
            setFormData(data.data); 
          } else {
            throw new Error("Job request not found");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
    
      fetchScreen4Data();
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

    // useEffect(() => {
    //     const fetchScreen4Data = async () => {
    //       try {
    //         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getjobrequest/${id}`);
      
    //         if (!response.ok) {
    //           throw new Error("Failed to fetch job request data");
    //         }
      
    //         const data = await response.json();
    //         setAccepted(data.isAccepted)
      
    //         if (data.data) {
    //           setFormData(data.data); // ✅ Set form data directly from API response
    //         } else {
    //           throw new Error("Job request not found");
    //         }
    //       } catch (error) {
    //         console.log(error.message);
    //       }
    //     };
      
    //     fetchScreen4Data();
    //   }, [id]); 
      

  const handleAddComment = (field) => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      setFormData((prev) => {
        const updatedFormData = { ...prev, [field]: comment };
        return updatedFormData;
      });
    }
  };

  const pad = (data) => {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "400px",
            height: "200px",
            border: "1px solid #ccc",
            cursor: "crosshair",
            touchAction: "none",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div style={{ marginTop: "10px" }}>
          <button
            type="button"
            onClick={clearCanvas}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={closeSignaturePadWithoutSave}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              closeSignaturePad(data);
            }}
            style={{
              padding: "5px 10px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save & Close
          </button>
        </div>
      </div>
    );
  };

  const specificFields = [
    "DrugsandAlcoholUrineTest",
    "DrugsandAlcoholOralTest",
    "BreathAlcoholOnlyTest",
    "DrugsOnlyTest",
  ];
  const openSignaturePad = () => {
    setIsSignaturePadOpen(true);
    setTimeout(initializeCanvas, 0); // Initialize canvas after it renders
  };
  const openSignaturePad2 = (fieldName) => {
    setCurrentSignatureField(fieldName);
    setIsSignaturePadOpen(true);
    setTimeout(initializeCanvas, 0);
  };
  

  const closeSignaturePad = (mydata) => {
    setIsSignaturePadOpen(false);

    // Save canvas content as a data URL
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL();
    console.log(mydata);
    setFormData((prevData) => ({ ...prevData, [mydata]: signatureData }));
    setIsDonorOpen(false);
    setIsCollectorOpen(false);
    setIsDonorConcentOpen(false);
    setIsCollectorCerificationOpen(false);
  };
  const closeSignaturePadWithoutSave = () => {
    setIsSignaturePadOpen(false);

    // Save canvas content as a data URL
    const canvas = canvasRef.current;
    // const signatureData = canvas.toDataURL();
    // setFormData((prevData) => ({ ...prevData, donorSignature: signatureData }));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clears the entire canvas
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const getTouchPos = (touchEvent) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    const x = (touch.clientX - rect.left);
    const y = (touch.clientY - rect.top);
    return { x, y };
  };

  const handleTouchStart = (e) => {
    if (!canvasRef.current || !contextRef.current) return;
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleTouchMove = (e) => {
    if (!isDrawing) return;
    if (!canvasRef.current || !contextRef.current) return;
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const handleTouchEnd = (e) => {
    if (!canvasRef.current || !contextRef.current) return;
    e.preventDefault();
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const [formData, setFormData] = useState({
    jobReferenceNo: "",
    dateAndTimeOfCollection: "",
    location: "",
    customer: "",
    nameOfOnsiteContact: "",
    contactOfTelephoneNo: "",
    numberOfDonors: "",
    TypeOfTest: "",
    callOutType: "",
    reasonForTest: "",

    date: "",
    collectionOfficerName: "",
    arrivalTime: "",
    departureTime: "",
    waitingTime: "",
    mileage: "",
    samplesMailed: "",
    breathAlcoholTestsCompleted: "",
    drugTestsCompleted: "",
    nonZeroBreathAlcoholTests: "",
    nonNegativeSamples: "",
    notes: "",
    facilities: {
      privateSecureRoom: false,
      wcFacilities: false,
      handWashing: false,
      securedWindows: false,
      emergencyExits: false,
      translatorRequired: false,
    },
    onsiteSignature: "",
    officerSignature: "",
    author: "",
    rev: "",
    alcoholTestResult: "",
    secondBreathTest: "",
    drugKitType: "",
    nonNegativeSamples: "",
    laboratoryAddress: "",
    sampleDeliveryMethod: "",
    flightVessel: "",
  });
  // useEffect(async () => {
  //   const selectedValue = formData.customer; // Assuming this is the selected value from the dropdown
    
  //     const emailMatch = selectedValue.match(/\(([^)]+)\)/); // extract email from "Ali (ali@gmail.com)"
  //     const selectedEmail = emailMatch ? emailMatch[1] : null;
    
  //     setFormData((prev) => ({
  //       ...prev,
  //       customer: selectedValue,
  //     }));
    
  //     if (!selectedEmail) return;
    
  //     try {
  //       const res = await fetch(
  //         `${import.meta.env.VITE_API_BASE_URL}/getcustomerbyemail?email=${selectedEmail}`
  //       );
  //       const data = await res.json();
  //       setClientDetails(data)
  //     } catch (err) {
  //       console.error("Failed to fetch customer details:", err);
  //     }
  // },[formData])

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const selectedValue = formData.customer;
  
      const emailMatch = selectedValue.match(/\(([^)]+)\)/); // extract email
      const selectedEmail = emailMatch ? emailMatch[1] : null;
  
      setFormData((prev) => ({
        ...prev,
        customer: selectedValue,
      }));
  
      if (!selectedEmail) return;
  
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/getcustomerbyemail?email=${selectedEmail}`
        );
        const data = await res.json();
        setClientDetails(data);
      } catch (err) {
        console.error("Failed to fetch customer details:", err);
      }
    };
  
    fetchCustomerDetails(); // call the async function inside
  
  }, [formData.customer]);
  
  const getFormattedDate = () => {
    const today = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" };
    return today.toLocaleDateString("en-GB", options);
  };



  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      let updatedData;

      // Check if the input belongs to facilities (nested object)
      if (name in prevData.facilities) {
        updatedData = {
          ...prevData,
          facilities: {
            ...prevData.facilities,
            [name]: checked, // Update checkbox inside facilities
          },
        };
      } else {
        updatedData = {
          ...prevData,
          [name]: type === "checkbox" ? checked : value.toString(),
        };
      }

      console.log(updatedData); // Logs the updated state immediately
      return updatedData;
    });
  };



const handleSubmit = async (e) => {
  setIsLoading(true);
    e.preventDefault();
    try {
      const url = formData._id 
        ? `${import.meta.env.VITE_API_BASE_URL}/updatejobrequest/${formData._id}`  // Update API
        : `${import.meta.env.VITE_API_BASE_URL}/addscreenforjobrequestform`;  // Create API
  
      const method = formData._id ? "PUT" : "POST"; // Use PUT for update, POST for new form
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const baseMsg = formData._id ? "Form updated successfully!" : "Form submitted successfully!";
        message.success(baseMsg);
        if (result?.emailStatus) {
          message.info(result.emailStatus);
        }
      } else {
        message.error(result.message || "Failed to process form.");
      }
  
      // Reset form after submission
      setFormData({
        jobReferenceNo: "",
        dateAndTimeOfCollection: "",
        location: "",
        customer: "",
        nameOfOnsiteContact: "",
        contactOfTelephoneNo: "",
        numberOfDonors: "",
        TypeOfTest: "",
        callOut: "",
        date: "",
        collectionOfficerName: "",
        arrivalTime: "",
        departureTime: "",
        waitingTime: "",
        mileage: "",
        samplesMailed: "",
        breathAlcoholTestsCompleted: "",
        drugTestsCompleted: "",
        nonZeroBreathAlcoholTests: "",
        nonNegativeSamples: "",
        notes: "",
        facilities: {
          privateSecureRoom: false,
          wcFacilities: false,
          handWashing: false,
          securedWindows: false,
          emergencyExits: false,
          translatorRequired: false,
        },
        onsiteSignature: "",
        officerSignature: "",
        author: "",
        rev: "",
        alcoholTestResult: "",
        secondBreathTest: "",
        drugKitType: "",
        nonNegativeSamples: "",
        laboratoryAddress: "",
        sampleDeliveryMethod: "",
      });
      navigate("/jobrequests")
      // window.close();
    } catch (error) {
      console.error("Error: ", error);
      message.error("Submission failed due to server error.");
    }
    setIsLoading(false);

    
  };
  

  const handleAccept = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    
    console.log("Sending data:", { practitionerId }); // Debugging
    
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/jobrequestAccept/${id}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({acceptedBy: practitionerId }) // ✅ Ensure correct JSON structure
      });
      
      const result = await response.json();
      
      if (response.ok) {
        message.success("Form Accepted!");
      } else {
        message.error(result.message || "Failed to process form.");
      }
      navigate("/jobrequests")
      // window.close();
    } catch (error) {
      console.error("Error: ", error);
      message.error("Unable to accept due to server error.");
    }
    setIsLoading(false);
  };

 
  return (
    <>
      {/* <Navbar /> */}
      <div
      className="jobrequestformwrapper"
        style={{
          // display: "flex",
          // justifyContent: "center",
          padding: "20px",
          display: "grid",
          placeItems: "center",
          // alignItems: "center",
          // height: "100vh",
          height: "100%",
          background: "#80c209",
        }}
      >
        
        <div
        className="jobrequestform"
          // onSubmit={handleSubmit}
          style={{
            // marginTop: "1110px",
            background: "#ffffff",
            padding: "60px",
            paddingTop: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "900px",
          }}
        > <Tooltip title="Back">
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
          className="backbtnimg"
            src="/backbtn.png"
            alt="Back"
            style={{ width: '20px', marginTop: '25px' }}
          />
        </div>
      </Tooltip>
          <h2
          className="jobrequestformtitle"
            style={{
              textAlign: "center",
              color: "#80c209",
              padding: "10px",
            }}
          >
            REQUEST - COLLECTION OFFICER & TIMESHEET
          </h2>
          <h4 className="heading">JOB INFORMATION – Workplace</h4>
          <hr />
          <div className="donor">
            {/* Donor's Name */}
            <label>
              Job Reference Number
              {/* <span style={{color: "red"}}>*</span> */}
            </label>
            <input
              className="inputstyle"
              type="text"
              name="jobReferenceNo"
              value={formData.jobReferenceNo}
              onChange={handleChange}
              placeholder="S4/"
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              //   required
            />
          </div>
          <hr />
          <div className="donor">
            {/* Donor's Name */}
            <label>
              Date and time of Collection
              {/* <span style={{color: "red"}}>*</span> */}
            </label>
            <input
              className="inputstyle"
              type="datetime-local"
              name="dateAndTimeOfCollection"
              value={formatDateTimeLocal(formData.dateAndTimeOfCollection)}
              onChange={handleChange}
              placeholder="Enter Donor's Email"
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              //   required
            />
          </div>
          <hr></hr>
          {/* <div
            className="2nd-row"
            style={{ display: "flex", justifyContent: "space-between" }}
          > */}
          <div className="donor">
            <label>Customer</label>
            <input
              className="inputstyle"
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              // required
            />
          </div>
          <hr></hr>
          <div className="donor">
            <label>Location </label>
            <input
              className="inputstyle"
              type="text"
              name="location"
              value={formData.location}
              placeholder="Enter Location"
              onChange={handleChange}
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
            />
          </div>
          <hr></hr>
          
          <div className="donor">
            <label>Name of Onsite Contact</label>
            <input
              className="inputstyle"
              type="text"
              name="nameOfOnsiteContact"
              value={formData.nameOfOnsiteContact}
              onChange={handleChange}
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              // required
            />
          </div>
          <hr></hr>
          <div className="donor">
            <label>Contact telephone no.</label>
            <input
              className="inputstyle"
              type="text"
              name="contactOfTelephoneNo"
              value={formData.contactOfTelephoneNo}
              onChange={handleChange}
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              // required
            />
          </div>
          <hr></hr>
         
         
          {/* <div className="donor">
            <label>Call-out Type</label>
            <select
              className="inputstyle"
              name="callOutType"
              value={formData.callOutType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select call-out type
              </option>
              <option value="Unplanned">Unplanned</option>
              <option value="Pre-Planned">Pre-Planned</option>
            </select>
          </div>
          <hr></hr> */}
          <div className="donor">
            <label>Reason for Test</label>
            <select
              className="inputstyle"
              name="reasonForTest"
              value={formData.reasonForTest}
              onChange={handleChange}
              disabled={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
            >
              <option value="" disabled>
                Select reason
              </option>
              <option value="For Cause">For Cause</option>
              <option value="Random">Random</option>
              <option value="Pre-Employment">Pre-Employment</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>
          <hr></hr>
          <div className="donor">
            <label>Type Of Test</label>
            <select
              className="inputstyle"
              name="TypeOfTest"
              value={formData.TypeOfTest}
              onChange={handleChange}
              disabled={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
            >
              <option value="" disabled>
                Select a test type
              </option>
              <option value="Breath Alcohol">Breath Alcohol</option>
              <option value="Urine POCT / BtL">Urine POCT / BtL</option>
              <option value="Oral Fluid POCT / BtL">
                Oral Fluid POCT / BtL
              </option>
              <option value="Non-Neg samples back to lab for confirmation">
                Non-Neg samples back to lab for confirmation
              </option>
            </select>
          </div>
          <hr></hr>
          <div className="donor">
            <label>Number of donors</label>
            <input
              className="inputstyle"
              readOnly={token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53"}
              type="number"
              name="numberOfDonors"
              value={formData.numberOfDonors}
              onChange={handleChange}
              // required
            />
          </div>
          <hr></hr>
          <div className="donor">
            <label>Flight/Vessel</label>
            <input
              className="inputstyle"
              type="text"
              name="flightVessel"
              value={formData.flightVessel}
              onChange={handleChange}

            />
            {/* <input
              className="inputstyle"
              type="text"
              name="nameOfOnsiteContact"
              value={formData.nameOfOnsiteContact}
              onChange={handleChange}
            /> */}
          </div>
          <hr></hr>
          <h4 className="heading">The Onsite contact must:</h4>
          <ul>
            <li>
              must verify the arrival, departure & waiting times of the
              Collection Officer
            </li>
            <li>Sign the box below.</li>
          </ul>


          

          <h4 className="heading">CUSTOMER SPECIFIC INFORMATION – Workplace</h4>

          {/* <table border="1">
            <tbody>
              
              <tr>
                <td colSpan="2">
                  <strong>CUSTOMER</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>ALCOHOL – Customer Cut Off Level</strong>
                </td>
                <td>35ug / 100ml</td>
              </tr>
              <tr>
                <td>
                  <strong>Alcohol Test Result (Numeric Only)</strong>
                </td>
                <td>
                  <input
                    type="number"
                    name="alcoholTestResult"
                    value={formData.alcoholTestResult}
                    onChange={handleChange}
                    placeholder="Enter result"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Second Breath Test Required?</strong>
                </td>
                <td>
                  <label>
                    <input
                      type="radio"
                      name="secondBreathTest"
                      value="Yes"
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="secondBreathTest"
                      value="No"
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </td>
              </tr>

              
              <tr>
                <td>
                  <strong>DRUGS</strong>
                </td>
                <td>
                  <select
                    name="drugKitType"
                    value={formData.drugKitType}
                    onChange={handleChange}
                  >
                    <option value="">Select Kit Type</option>
                    <option value="Urine">
                      Urine (POCT 10 Panel cup / BtL)
                    </option>
                    <option value="Oral Fluid">
                      Oral Fluid (POCT 9NR / Oral-Eze BtL)
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Non-Negative Samples Sent to Lab?</strong>
                </td>
                <td>
                  <label>
                    <input
                      type="radio"
                      name="nonNegativeSamples"
                      value="Yes"
                      onChange={handleChange}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="nonNegativeSamples"
                      value="No"
                      onChange={handleChange}
                    />{" "}
                    No
                  </label>
                </td>
              </tr>

            
              <tr>
                <td colSpan="2">
                  <strong>ADDITIONAL INFORMATION</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <ul>
                    <li>
                      <strong>Refusal:</strong> Make client aware, fully
                      complete, and sign the 'Refusal' form.
                    </li>
                    <li>
                      <strong>Shy Bladder:</strong> Follow the SOP, complete and
                      sign the 'Shy Bladder' Form.
                    </li>
                  </ul>
                </td>
              </tr>

             
              <tr>
                <td>
                  <strong>LABORATORY ADDRESS</strong>
                </td>
                <td>
                  <input
                    type="text"
                    name="laboratoryAddress"
                    value={formData.laboratoryAddress}
                    onChange={handleChange}
                    placeholder="Enter lab address"
                  />
                </td>
              </tr>

            
              <tr>
                <td>
                  <strong>SAMPLES BACK TO LAB</strong>
                </td>
                <td>
                  <input
                    type="text"
                    name="sampleDeliveryMethod"
                    value={formData.sampleDeliveryMethod}
                    onChange={handleChange}
                    placeholder="Enter method & details of delivery"
                  />
                </td>
              </tr>

           
              <tr>
                <td colSpan="2">
                  <strong>SUPERVISION/CONTROL</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>The Client’s Onsite Contact Should:</strong>
                </td>
                <td>
                  <ul>
                    <li>Always remain with the Collection Officer.</li>
                    <li>OR, be nearby and available to assist if required.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>The Collection Officer is responsible for:</strong>
                </td>
                <td>
                  <ul>
                    <li>
                      Ensuring all Screen4 processes are followed correctly.
                    </li>
                    <li>Ensuring no intervention from the donor.</li>
                    <li>Ensuring donor is not left alone at any time.</li>
                    <li>
                      Ensuring donor does not eat, drink, smoke, or consume
                      substances during the testing period.
                    </li>
                    <li>
                      Promptly communicating results to Screen4 Operations.
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table> */}

<table border="1">
            <tbody>
              {/* CUSTOMER SECTION */}
              <tr>
                <td colSpan="1">
                  <strong className="heading">CUSTOMER</strong>
                </td>
                <td>{formData.customer}</td>
              </tr>
              <tr>
                <td>
                  <strong className="heading">ALCOHOL – Customer Cut Off Level</strong>
                </td>
                <td>{clientDetails?.cutOffLevels}</td>
              </tr>
              {/* <tr>
                <td>
                  <strong>Alcohol Test Result (Numeric Only)</strong>
                </td>
                <td>
                  <input
                    type="number"
                    name="alcoholTestResult"
                    value={formData.alcoholTestResult}
                    onChange={handleChange}
                    placeholder="Enter result"
                  />
                </td>
              </tr> */}
                     <tr>
  <td><strong className="heading">Second Breath Test Required?</strong></td>
  <td>
    {/* <label>
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
    </label> */}
    {clientDetails?.secondBreathTestRequired}
  </td>
</tr>

<tr>
  <td><strong className="heading">Drugs (Kit Type)</strong></td>
  <td>
    {/* <select
      value={client.drugKitType}
      onChange={(e) => setClient({ ...client, drugKitType: e.target.value })}
    >
      <option value="" disabled>Select Kit Type</option>
      <option value="Urine">Urine (POCT 10 Panel cup / BtL)</option>
      <option value="Oral Fluid">Oral Fluid (POCT 9NR / Oral-Eze BtL)</option>
    </select> */}
    {clientDetails?.drugKitType}
  </td>
</tr>

<tr>
  <td><strong className="heading">Non-Negative Samples to Lab?</strong></td>
  <td>
    {/* <label>
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
    </label> */}
    {clientDetails?.nonNegativeSamplesToLab}
  </td>
</tr>

              {/* ADDITIONAL INFORMATION (STATIC TEXT) */}
              <tr>
                <td colSpan="2">
                  <strong className="heading">ADDITIONAL INFORMATION</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <ul>
                    <li>
                      <strong>Refusal:</strong> Make client aware, fully
                      complete, and sign the 'Refusal' form.
                    </li>
                    <li>
                      <strong>Shy Bladder:</strong> Follow the SOP, complete and
                      sign the 'Shy Bladder' Form.
                    </li>
                  </ul>
                </td>
              </tr>

              {/* LABORATORY SECTION */}
              <tr>
                <td>
                  <strong className="heading">LABORATORY ADDRESS</strong>
                </td>
                <td>
                  {/* <input
                    type="text"
                    name="laboratoryAddress"
                    value={formData.laboratoryAddress}
                    onChange={handleChange}
                    placeholder="Enter lab address"
                  /> */}{clientDetails?.laboratoryAddress}
                </td>
              </tr>

              {/* SAMPLES DELIVERY */}
              <tr>
                <td>
                  <strong className="heading">SAMPLES BACK TO LAB</strong>
                </td>
                <td>
                  {/* <input
                    type="text"
                    name="sampleDeliveryMethod"
                    value={formData.sampleDeliveryMethod}
                    onChange={handleChange}
                    placeholder="Enter method & details of delivery"
                  /> */}
                  {clientDetails?.sampleDeliveryMethod}
                </td>
              </tr>

              {/* SUPERVISION/CONTROL SECTION (STATIC TEXT) */}
              <tr>
                <td colSpan="2">
                  <strong className="heading">SUPERVISION/CONTROL</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="heading">The Client’s Onsite Contact Should:</strong>
                </td>
                <td>
                  <ul>
                    <li>Always remain with the Collection Officer.</li>
                    <li>OR, be nearby and available to assist if required.</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <strong className="heading">The Collection Officer is responsible for:</strong>
                </td>
                <td>
                  <ul>
                    <li>
                      Ensuring all Screen4 processes are followed correctly.
                    </li>
                    <li>Ensuring no intervention from the donor.</li>
                    <li>Ensuring donor is not left alone at any time.</li>
                    <li>
                      Ensuring donor does not eat, drink, smoke, or consume
                      substances during the testing period.
                    </li>
                    <li>
                      Promptly communicating results to Screen4 Operations.
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>


          <h4 className="heading">
            TIMESHEET (Collection Officer to complete, Onsite Contact to sign)
          </h4>

         
            <table border="1">
              <tbody>
                <tr>
                  <td>Date</td>
                  <td>
                    <input
                      type="date"
                      name="date"
                      // value={formatDateTimeLocal(formData.date)}
                      value={formatDateOnly(formData.date)}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                <td>Collection Officer's Name</td>
                  <td>
                    <input
                      type="text"
                      name="collectionOfficerName"
                      value={formData.collectionOfficerName}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Arrival Time</td>
                  <td>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Waiting Time</td>
                  <td>
                    <input
                      type="text"
                      name="waitingTime"
                      value={formData.waitingTime}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                <td>Date & Time Samples Mailed</td>
                  <td>
                    <input
                      type="datetime-local"
                      name="samplesMailed"
                      value={formData.samplesMailed}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Mileage</td>
                  <td>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Number of Breath Alcohol Tests Completed</td>
                  <td>
                    <input
                      type="number"
                      name="breathAlcoholTestsCompleted"
                      value={formData.breathAlcoholTestsCompleted}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                <td>Number of Drug Tests Completed</td>
                  <td>
                    <input
                      type="number"
                      name="drugTestsCompleted"
                      value={formData.drugTestsCompleted}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Number of ‘Non Zero’ Breath Alcohol Tests</td>
                  <td>
                    <input
                      type="number"
                      name="nonZeroBreathAlcoholTests"
                      value={formData.nonZeroBreathAlcoholTests}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                <td>Number of Non-Negative Samples Sent to Laboratory</td>
                  <td>
                    <input
                      type="number"
                      name="nonNegativeSamples"
                      value={formData.nonNegativeSamples}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <strong className="heading">ONSITE CONTACT SIGNATURE</strong>
                  </td>
                </tr>
                <tr>
                  <td>Notes (e.g. travel/donor/facility issues)</td>
                  <td colSpan="1">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <strong className="heading ">Facilities Check (tick box)</strong>
                  </td>
                </tr>
                <tr className="facilitiesCheck">
                  <td colSpan="2">
                    <label>
                      <input
                        type="checkbox"
                        name="privateSecureRoom"
                        checked={formData.facilities.privateSecureRoom}
                        onChange={handleChange}
                      />
                      Private & Secure Room / Collection Area
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="wcFacilities"
                        checked={formData.facilities.wcFacilities}
                        onChange={handleChange}
                      />
                      Suitable WC Facilities, +1 Door Access/Egress
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="handWashing"
                        checked={formData.facilities.handWashing}
                        onChange={handleChange}
                      />
                      Suitable Hand Washing Facilities
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="securedWindows"
                        checked={formData.facilities.securedWindows}
                        onChange={handleChange}
                      />
                      Secured Windows if at Ground Level
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="emergencyExits"
                        checked={formData.facilities.emergencyExits}
                        onChange={handleChange}
                      />
                      Onsite Emergency Exits / Assembly Points
                    </label>
                    <br />
                    <label>
                      <input
                        type="checkbox"
                        name="translatorRequired"
                        checked={formData.facilities.translatorRequired}
                        onChange={handleChange}
                      />
                      Translator (if required)
                    </label>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <strong className="heading">COLLECTION OFFICER SIGNATURE</strong>
                  </td>
                </tr>
                <tr>
                  <td>Onsite Contact Signature</td>
                  <td>
                  <div >
{/*                   
                     <input
                    className="inputstyle"
                    type="text"
                    name="onsiteSignature"
                    value=""//{formData.onsiteSignature}
                    placeholder=""
                    // onClick={() => openSignaturePad2("onsiteSignature")}
                    onChange={handleChange}
                    style={{ width: "152px", margin: "0px",cursor: "pointer",
                      backgroundImage: `url(${formData.onsiteSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",height:"30px" }}
         
                  /> */}
                   <input
                    className="inputstyle"
                    type="text"
                    name="onsiteSignature"
                    value=""//{formData.onsiteSignature}
                    placeholder=""
                    onClick={() => openSignaturePad2("onsiteSignature")}
                    onChange={handleChange}
                    style={{ width: "152px", margin: "0px",cursor: "pointer",
                      backgroundImage: `url(${formData.onsiteSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",height:"30px" }}
         
                  />
                </div>
                {/* {isSignaturePadOpen && isSignaturePadOpen && pad(currentSignatureField) && (
      pad("onsiteSignature")
      )} */}
      {isSignaturePadOpen && pad(currentSignatureField)}

                  </td>
                 
                </tr>
                <tr>
                <td>Collection Officer Signature</td>
                  <td>
                  
                     <input
                    className="inputstyle"
                    type="text"
                    name="officerSignature"
                    value=""
                    placeholder=""
                    onClick={() => openSignaturePad2("officerSignature")}
                    onChange={handleChange}
                    style={{ width: "152px", margin: "0px",cursor: "pointer",
                      backgroundImage: `url(${formData.officerSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",height:"30px" }}
         
                  />
                  </td>
                </tr>
              </tbody>
            </table>
       
          <div className="note">
            <strong className="heading">** CO to NOTE **:</strong>
            <ul>
              <li>This page & Chain of Custody Form</li>
              <li>Refusal, Shy Bladder Forms etc.</li>
            </ul>
            <p>
              are to be emailed to{" "}
              <a href="mailto:operations@screen4.org">operations@screen4.org</a>{" "}
              ASAP after the collection is completed.
            </p>
          </div>



         { !isloading ? 
         (token ==="dskgfsdgfkgsdfkjg35464154845674987dsf@53" || formData?.isAccepted ? <button
            type="submit"
            className="createjob2"
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "10px",
              background: "#80c209",
            //   background: "#80c209",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Update
          </button> : 

          // {
            // accepted ?
            <button
            className="createjob2"
            type="submit"
            onClick={handleAccept}
            style={{
              width: "100%",
              padding: "10px",
              background: "#80c209",
            //   background: "#80c209",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Accept
          </button>
          //  : null
        // }
          ) : <div style={{width:"100%",display: "flex",justifyContent:"center"}}><img src="/empty.gif" style={{width:"130px",}}/></div>}
        </div>
      </div>
    </>
  );
}

export default JobRequestDetails;
