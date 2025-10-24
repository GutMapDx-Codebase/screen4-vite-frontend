import "./css/profile.css";
import './css/clientDetails.css';
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { message, Tooltip } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './css/Practitioner.css'
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
 

function Screen4Details() {
  const navigate = useNavigate()
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [isloading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isError, setIsError] = useState(false);
  // const [formData, setFormData] = useState({ donorSignature: "" });
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const [donorOpen, setIsDonorOpen] = useState(false);
  const [declarationOpen, setIsdeclarationopen] = useState(false);
  const [donorConcentOpen, setIsDonorConcentOpen] = useState(false);
  const [ConcentOpen, setisconcentOpen] = useState(false);
  const [collectorOpen, setIsCollectorOpen] = useState(false);
  const [collectorCertificationOpen, setIsCollectorCerificationOpen] = useState(false);


  const pad = (data) => {
    return <div
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
        width:"60%",
        color:"#000000 !important"
      }}
      >
      <canvas
        ref={canvasRef}
        style={{
          // width: "400px",
          height: "200px",
          border: "1px solid #ccc",
          cursor: "crosshair",
          width:"100%",
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawingTouch}
        onTouchMove={drawTouch}
        onTouchEnd={finishDrawingTouch}
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
          onClick={() => { closeSignaturePad(data) }}
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
  }

  const openSignaturePad = () => {
    setIsSignaturePadOpen(true);
    setTimeout(initializeCanvas, 0); // Initialize canvas after it renders
  };

  const closeSignaturePad = (mydata) => {
    setIsSignaturePadOpen(false);

    // Save canvas content as a data URL
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL();
    console.log(mydata)
    setFormData((prevData) => ({ ...prevData, [mydata]: signatureData }));
    setIsDonorOpen(false)
    setIsCollectorOpen(false)
    setIsDonorConcentOpen(false)
    setisconcentOpen(false)
    setIsCollectorCerificationOpen(false)
    setIsdeclarationopen(false)
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

  // Touch support for mobile/tablets
  const getTouchPos = (touchEvent) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDrawingTouch = (e) => {
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawTouch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawingTouch = (e) => {
    e.preventDefault();
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  const handleBarcodePhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, barcodeImage: reader.result }));
      message.success("Barcode photo captured");
    };
    reader.readAsDataURL(file);
  };





  const specificFields = [
    "DrugsandAlcoholUrineTest",
    "DrugsandAlcoholOralTest",
    "BreathAlcoholOnlyTest",
    "DrugsOnlyTest",
  ];
  function formatDate(dateInput) {
    if (!dateInput) {
      return null; // Handle null or undefined inputs
    }

    // Convert the input to a Date object
    const date = new Date(dateInput);

    // Check if the conversion is valid
    if (isNaN(date.getTime())) {
      return null; // Return null for invalid dates
    }

    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  const [formData, setFormData] = useState({
    cocRefNo: "",
    donorName: "",
    donorEmail: "",
    gcalicno: "",
    dob: "",
    companyName: "",
    reasonForTest: "", // Default reason
    location: "",
    flight: "",
    idsource: "",
    gender: "",
    barcodeno: "",
    barcodeImage: "",
    refno: "",
    dateoftest: "",
    alcohoDeclaration: "",
    donorSignature: "",
    donorDate: "",
    test1: "",
    test1BaracResult1: "",
    test1BaracResult2: "",
    test2: "",
    test2BaracResult1: "",
    test2BaracResult2: "",
    collectorName: "",
    collectorRemarks: "",
    collectorSignature: "",
    collectorDate: "",
    donorConcent: "",
    donorDeclaration: "",
    donorConcentDate: "",
    medicationDate1: "",
    medicationDate2: "",
    medicationDate3: "",
    medicationDate4: "",
    medicationType1: "",
    medicationType2: "",
    medicationType3: "",
    medicationType4: "",
    medicationDosage1: "",
    medicationDosage2: "",
    medicationDosage3: "",
    medicationDosage4: "",
    collectionTime: "",
    resultReadTime: "",
    temperature: "",
    lotno: "",
    expDate: "",
    adulterationTestPassed: "",
    adulterationRemarks: "",

    AlcoholScreen: "",
    AlcoholConfirm: "",
    AmphetaminesScreen: "",
    AmphetaminesConfirm: "",
    BenzodiazepinesScreen: "",
    BenzodiazepinesConfirm: "",
    BuprenorphineScreen: "",
    BuprenorphineConfirm: "",
    BloodScreen: "",
    BloodConfirm: "",
    OtherScreen: "",
    OtherConfirm: "",
    CocaineScreen: "",
    CocaineConfirm: "",
    KetamineScreen: "",
    KetamineConfirm: "",
    MaritimeScreen: "",
    MaritimeConfirm: "",
    MDMAScreen: "",
    MDMAConfirm: "",
    MethadoneScreen: "",
    MethadoneConfirm: "",
    MethamphetamineScreen: "",
    MethamphetamineConfirm: "",
    MorphineScreen: "",
    MorphineConfirm: "",
    NetworkScreen: "",
    NetworkConfirm: "",
    OpiatesScreen: "",
    OpiatesConfirm: "",
    SSRIScreen: "",
    SSRIConfirm: "",
    TCAScreen: "",
    TCAConfirm: "",
    THCScreen: "",
    THCConfirm: "",

    donorCertificationName: "",
    donorCertificationSignature: "",
    donorCertificationDate: "",
    collectorCertificationName: "",
    collectorCertificationSignature: "",
    collectorCertificationDate: "",
    recieveInitial: "",
    recieveName: "",
    recieveDate: "",
    specimenBottle: "",
    fatalFlaws: "",
    specimenBottleComment: "",
    fatalFlawsComment: "",
    DrugsandAlcoholUrineTest: false,
    DrugsandAlcoholOralTest: false,
    BreathAlcoholOnlyTest: false,
    DrugsOnlyTest: false,
  });
  const handleAddComment = (field) => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      setFormData((prev) => ({ ...prev, [field]: comment })); // Save the comment for the field
    }
  };
  useEffect(() => {
    const fetchScreen4Data = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getscreen4data/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        const data = await response.json();


        // setFormData(data.data); // Set the form data with the found object
        // setFormData((prevData) => ({
        //   ...prevData,
        //   companyName: data.data.companyName,
        //   flight: data.data.flight,
        //   location: data.data.location,
        //   refno: data.data.refno,
        //   dateoftest: new Date(data.data.dateoftest),
        //   reasonForTest: data.data.reasonForTest,
        // }))
        setFormData((prevData) => ({
          ...prevData,
          ...data.data, // base: set all fields from API
          companyName: data.data.companyName,
          flight: data.data.flight,
          location: data.data.location,
          refno: data.data.refno,
          dateoftest: data.data.dateoftest
            ? new Date(data.data.dateoftest).toISOString().slice(0, 16)
            : '',
          reasonForTest: data.data.reasonForTest,
        }));



      } catch (error) {
        setError(error.message); // Handle error if something goes wrong
        console.log(error.message);
      }
    };

    fetchScreen4Data();
  }, [id]); // Dependency on id ensures the effect runs when the id changes

  if (!formData && !error) {
    return <div>Loading...</div>; // Display a loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error message
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    console.log(value, checked);
    setFormData((prevData) => {
      if (checked) {
        // Add the selected value
        return {
          ...prevData,
          reasonForTest: [...prevData.reasonForTest, value],
        };
      } else {
        // Remove the unselected value
        return {
          ...prevData,
          reasonForTest: prevData.reasonForTest.filter(
            (item) => item !== value
          ),
        };
      }
    });
  };

  // const handleChange = async (e) => {
  //   const { name, value, type, checked } = e.target;
  //   console.log(e.target)
  //   // console.log(checked)
  //   await setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: type === "checkbox" ? checked : value.toString(),
  //   }));
  // };
  // const handleChange = async (e) => {
  //   const { name, value, type, checked } = e.target;
  //   console.log(e.target)
  //   // console.log(checked)
  //   await setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value.toString(),
  //   }));
  // };

  //   const handleChange = async (e) => {
  //     const { name, value, type, checked } = e.target;
  //     setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: type === "checkbox" ? checked : value.toString(),
  //     }));
  //     console.log(formData.BloodConfirm)
  // };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
      return updatedData;
    });
  };
  //   const handleChange = async (e) => {
  //     const { name, value, type, checked } = e.target;

  //     await setFormData((prevData) => ({
  //         ...prevData,
  //         [name]: type === "checkbox" ? checked : 
  //                 type === "number" ? value.toString() ://Number(value) : 
  //                 type === "date" ? value.toString() : value.toString()//new Date(value) : value,
  //     }));
  // };




  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Form Data Submitted: ", formData);
  //   try {
  //     const response = await fetch(
  //       // `${import.meta.env.VITE_API_BASE_URL}/addscreen4data`,
  //       `${import.meta.env.VITE_API_BASE_URL}/addscreen4data`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );

  //     const result = await response.json();

  //     if (response.ok) {
  //       message.success("Form submitted successfully!");
  //     } else {
  //       message.error(result.message || "Failed to submit form.");
  //     }

  //     // Reset form
  //     setFormData({
  //       donorName: "",
  //       dob: "",
  //       companyName: "",
  //       reasonForTest: "Pre-Employment",
  //       location: "",
  //       sampleDate: "",
  //       adulterationCheck: false,
  //       drugTests: [],
  //       consent: false,
  //     });
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     message.error("Submission failed due to server error.");
  //   }
  // };


  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);

    const apiUrl = id//formData._id
      ? `${import.meta.env.VITE_API_BASE_URL}/updatescreen4data/${id}`//formData._id}` // Update endpoint
      : `${import.meta.env.VITE_API_BASE_URL}/addscreen4data`; // Add endpoint

    try {
      const response = await fetch(apiUrl, {
        method: id ? "PUT" : "POST", // PUT for update, POST for add
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          id ? "Form updated successfully!" : "Form submitted successfully!"
        );
      } else {
        message.error(result.message || "Failed to process form.");
      }

      // Reset form if adding new data
      if (id) {
        setFormData({
          donorName: "",
          dob: "",
          companyName: "",
          reasonForTest: "Pre-Employment",
          location: "",
          sampleDate: "",
          adulterationCheck: false,
          drugTests: [],
          consent: false,
        });
      }
      navigate('/jobrequests')
      // window.close()
    } catch (error) {
      console.error("Error: ", error);
      message.error("Submission failed due to server error.");
    }
    setIsLoading(false)
  };

  // Example of populating form data for update
  const handleEdit = (dataToEdit) => {
    setFormData(dataToEdit);
  };

  // const handleDownloadPDF = async () => {
  //   const element = document.querySelector(".COCform"); // Target the form container

  //   if (!element) {
  //     console.error("Form element not found");
  //     return;
  //   }

  //   const canvas = await html2canvas(element, {
  //     scale: 2, // Increase resolution
  //     backgroundColor: null, // Remove background shadow
  //     logging: true, // Enable logging for debugging
  //     useCORS: true, // Enable cross-origin resource sharing
  //   });

  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("ClientDetails.pdf");
  // };
const handleDownloadPDF = async () => {
  const element = document.querySelector(".COCform"); // Target the form container

  if (!element) {
    console.error("Form element not found");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2, // Increase resolution
    backgroundColor: null, // Remove background shadow
    logging: true, // Enable logging for debugging
    useCORS: true, // Enable cross-origin resource sharing
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Height of the image

  let yOffset = 0; // Initial Y offset for the first page

  // Check if the image height exceeds the page height
  if (imgHeight > pdfHeight) {
    const numPages = Math.ceil(imgHeight / pdfHeight); // Number of pages needed

    for (let i = 0; i < numPages; i++) {
      if (i > 0) {
        pdf.addPage(); // Add a new page if it's not the first one
      }

      pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, imgHeight);
      yOffset += pdfHeight; // Increment Y offset for the next page
    }
  } else {
    // If content fits in one page
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
  }

  pdf.save("ClientDetails.pdf");
};

  return (
    <>
      {/* <Navbar /> */}
      <div className="container"
        style={{
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="COCform"
          style={{
            // marginTop: "1750px",
            background: "#ffffff",
            padding: "60px",
            paddingTop: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
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
            CHAIN OF CUSTODY FORM FOR SPECIMEN ANALYSIS
          </h2>
          <hr />
          <div className="donor">
            {/* Donor's Name */}
            <label>Donor's Name</label>
            <input
              className="inputstyle"
              type="text"
              name="donorName"
              style={{ marginLeft: '0px' }}
              value={formData.donorName}
              onChange={handleChange}
              placeholder="Enter Donor's Name"
              required
            />
          </div> <hr />
          <div className="donor">
            {/* Donor's Name */}
            <label>Donor's Email<span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="inputstyle"
              type="email"
              name="donorEmail"
              value={formData.donorEmail}
              onChange={handleChange}
              placeholder="Enter Donor's Email"
              required
            />
          </div>
          <hr></hr>
          <div
            className="second-row"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="donor">
              {/* GCAA LIC No */}
              <label
              // style={{ width: "180px" }}
              >
                CAA LIC No{" "}
                <span style={{ fontSize: "10px" }}>(if applicable)</span>:
              </label>
              <input
                className="inputstyle"
                type="number"
                name="gcalicno"
                value={formData.gcalicno}
                placeholder="Enter CAA LIC No"
                onChange={handleChange}
              // style={{ width: "39%" }}
              />
            </div>
            <div className="donor">
              {/* Date of Birth */}
              <label>Date of Birth</label>
              <input
                className="inputstyle"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                // style={{ width: "99%" }}
                required
              />
            </div>
          </div>
          <hr></hr>
          <div
            className="main-container"
            style={{ display: "flex", columnGap: "0px" }}
          >
            <div className="inner1" style={{}}>
              <div className="donor">
                {/* Company Name */}
                <label
                // style={{ width: "137px" }}
                >Company Name</label>
                <input
                  className="inputstyle"
                  style={{
                    //  marginLeft: "15px", 
                    //  width: "190px" 
                  }}
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                />
              </div>
              

              <div className="donor">
                {/* Location */}

                <label>Location</label>
                <input
                  className="inputstyle"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter Location"
                />
              </div>
              <div className="donor">
                {/* Flight/Vessel */}
                <label>Flight/Vessel</label>
                <input
                  className="inputstyle"
                  type="text"
                  name="flight"
                  value={formData.flight}
                  onChange={handleChange}
                  placeholder="Enter Flight / Vessel"
                />
              </div>
              {/* <span style={{ fontSize: "6px" }}>Check donor identity and record ID source here, e.g. passport (with number) OR supervisor’s signature and PRINTED name.</span> */}
              <div className="donor">
                {/* ID Source */}
                <label>ID Source/No</label>
                <input
                  className="inputstyle"
                  type="text"
                  name="idsource"
                  value={formData.idsource}
                  onChange={handleChange}
                  placeholder="Enter ID Source"
                />
              </div>
              {/* <label style={{ marginLeft: "0px" }}>
                <input
                  type="checkbox"
                  name="gender"
                  value="M"
                  checked={formData.gender}
                  onChange={handleChange}
                />
                M
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="checkbox"
                  name="gender"
                  value="F"
                  checked={!formData.gender}
                  onChange={handleChange}
                />
                F
              </label> */}
              <label style={{ marginLeft: "0px" }}>
                <input
                  className="radioinput"
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === "M"}
                  onChange={handleChange}
                />
                M
              </label>
              <label className="Flabel">
                <input
                  className="radioinput"
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === "F"}
                  onChange={handleChange}
                />
                F
              </label>
            </div>
            {/* Reason for Test */}
            {/* <div className="inner2" style={{ marginLeft: "45px" }}>
              <label style={{ marginBottom: "20px", display: "block" }}>
                Reason for Test
              </label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "9px",
                }}
              >
                <label style={{ margin: "0" }}>
                  <input
                    type="radio"
                    name="reasonForTest"
                    value="Pre-Employment"
                    checked={formData.reasonForTest === "Pre-Employment"}
                    onChange={handleChange}
                  />
                  Pre-Employment
                </label>
                <label>
                  <input
                    type="radio"
                    name="reasonForTest"
                    value="Random"
                    checked={formData.reasonForTest === "Random"}
                    onChange={handleChange}
                  />
                  Random
                </label>
                <label>
                  <input
                    type="radio"
                    name="reasonForTest"
                    value="For Cause"
                    checked={formData.reasonForTest === "For Cause"}
                    onChange={handleChange}
                  />
                  For Cause
                </label>
                <label>
                  <input
                    type="radio"
                    name="reasonForTest"
                    value="Follow-up"
                    checked={formData.reasonForTest === "Follow-up"}
                    onChange={handleChange}
                  />
                  Follow-up
                </label>
              </div>
            </div> */}
            <div className="inner2" style={{ marginLeft: "45px" }}>
              <label className="reasonlabel" style={{ marginBottom: "10px", display: "block", fontWeight: "bold" }}>
                Reason for Test
              </label>
              <div className="reason-radio-group">
                {["Pre-Employment", "Random", "For Cause", "Follow-up"].map((reason) => (
                  <label key={reason}>
                    <input
                      type="radio"
                      name="reasonForTest"
                      value={reason}
                      checked={formData.reasonForTest === reason}
                      onChange={handleChange}
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>



            <div className="inner3">
              <div className="donor">
                {/* BAR CODE NUMBER */}
                <label>BAR CODE NUMBER</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center",flexDirection: formData.barcodeImage && "column" }}>
                {!formData.barcodeImage &&  <input
                    className="inputstyle"
                    type="text"
                    name="barcodeno"
                    value={formData.barcodeno}
                    onChange={handleChange}
                  />}
                {formData.barcodeImage && (
                  <img src={formData.barcodeImage} alt="barcode" style={{ marginTop: "6px", maxWidth: "120px" }} />
                )}
                  <label className="createjob2" style={{ padding: "6px 10px", cursor: "pointer",borderRadius:"10px",backgroundColor:"#80c209",fontSize:"10px",textAlign:"center" }}>
                    Upload
                    <input type="file" accept="image/*" capture="environment" onChange={handleBarcodePhoto} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
              <hr></hr>
              <div className="donor">
                {/* REF NO/JOB NO:*/}
                <label>REF NO/JOB NO:</label>
                <input
                  className="inputstyle"
                  // style={{ width: "35%", marginLeft: "0px" }}
                  type="text"
                  name="cocRefNo"
                  value={formData.cocRefNo}
                  onChange={handleChange}
                />
              </div>
              <hr></hr>
              <div className="donor">
                {/* DATE OF TEST: */}
                <label
                // style={{ width: "180px" }}
                >DATE OF TEST:</label>
                {/* <input
                  className="inputstyle"
                  style={{ width: "36%", marginLeft: "0px" }}
                  type="date"
                  name="dateoftest"
                  value={formData.dateoftest}
                  onChange={handleChange}
                  required
                /> */}
                <input
                  className="inputstyle"
                  // style={{ width: "36%", marginLeft: "0px" }}
                  type="date"
                  name="dateoftest"
                  value={formData.dateoftest ? new Date(formData.dateoftest).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                  required
                />

              </div>
            </div>
          </div>
          <hr />
          <div
            class="second-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              class="second-container-part1"
              style={{
                // width: "35.5%",
                border: "1px solid black",
                padding: "10px",
              }}
            >
              <h5>RESIDUAL MOUTH ALCOHOL DECLARATION</h5>
              <p style={{ fontSize: "10.5px" }}>
                Have you in the last 20 minutes smoked and/or consumed an
                alcoholic drink or used a product containing alcohol such as
                mouthwash
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label
                  className="yesnolabel"
                  style={{
                    marginRight: "10px",

                    fontSize: "14px",
                  }}
                >
                  Yes
                  <input
                    type="radio"
                    name="alcohoDeclaration"
                    value="Yes"
                    checked={formData.alcohoDeclaration === 'Yes'}
                    onChange={handleChange}
                    className="radioyesno"
                  />
                </label>
                <label
                  className="yesnolabel"
                  style={{
                    marginRight: "10px",

                    fontSize: "14px",
                  }}
                >
                  No
                  <input
                    type="radio"
                    name="alcohoDeclaration"
                    value="No"
                    className="radioyesno"
                    checked={formData.alcohoDeclaration === 'No'}
                    onChange={handleChange}
                  />
                </label>
                <span
                  style={{
                    marginLeft: "auto",
                    width: "100px",
                    fontSize: "14px",
                  }}
                >
                  Please tick
                </span>
              </div>

              <p style={{ fontSize: "10.5px" }}>
                I understand that any of the above may artificially increase the
                result of the breath test that I am about to take.
              </p>
              {/* <div className="second-row" style={{ display: "flex",justifyContent:"space-between" }}> */}
              <div className="donor">
                {/* GCAA LIC No */}
                <label style={{ fontSize: "11px", fontWeight: "bold" }}>
                  Donor's Signature{" "}
                </label>
                {/* <input
                  className="inputstyle"
                  type="image"
                  name="donorSignature"
                  value=''
                  placeholder=""
                  onChange={handleChange}
                  style={{
                    width: "156px",
                   margin: "0px",
                   cursor: "pointer",
                   backgroundImage: `url(${formData.donorSignature})`,
                   backgroundSize: "contain",
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "center",
                   height: "30px", // Adjust height to fit the signature image
                 }}
                  required
                />
              </div> */}
                <input
                  className="inputstyle"
                  type="text"
                  name="donorSignature"
                  value=""
                  placeholder=""
                  onClick={() => { openSignaturePad(); setIsDonorOpen(true) }}
                  style={{
                    width: "156px",
                    margin: "0px",
                    cursor: "pointer",
                    backgroundImage: `url(${formData.donorSignature})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "30px", // Adjust height to fit the signature image
                  }}
                  readOnly
                />
                {isError && isError === 'donorSignature' && (
                  <p style={{ color: "red", padding: "5px", fontSize: "12px", marginTop: "5px" }}>
                    Please fill donor signature
                  </p>
                )}


              </div>
              {isSignaturePadOpen && donorOpen && (
                pad("donorSignature")
              )}
              <div className="donor">
                {/* Date of Birth */}
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    // marginLeft: "10px",
                    // marginRight: "10px",
                    margin: "0px",
                  }}
                >
                  Date
                </label>
                <input
                  className="inputstyle"
                  type="date"
                  name="donorDate"
                  value={formatDate(formData.donorDate)}
                  onChange={handleChange}
                  // style={{ width: "39%" }}
                  required
                />
              </div>
              {/* </div> */}
            </div>
            <div
              class="second-container-part2"
              style={{
                // width: "58.8%",
                border: "1px solid black",
                padding: "10px",
              }}
            >
              <h5>
                I certify that I have conducted Breath Alcohol testing on the
                above named individual, the results of which are recorded below:
              </h5>

              <div
                className="second-row"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    width: "110px",
                    marginTop: "18px",
                  }}
                >
                  Local Time
                </p>
                <div className="donor">
                  <label
                    style={{
                      //  width: "45px", 
                      fontSize: "12px", margin: "0px"
                    }}
                  >
                    Test 1.
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test1"
                    value={formData.test1}
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      // width: "85px",
                      margin: "0px"
                    }}
                    required
                  />
                </div>
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      // marginLeft: "10px",
                      // marginRight: "-10px",
                    }}
                  >
                    BrAC Result
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test1BaracResult1"
                    value={formData.test1BaracResult1}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      // marginLeft: "10px",
                      // marginRight: "-10px",
                    }}
                  >
                    BrAC Result
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test1BaracResult2"
                    value={formData.test1BaracResult2}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
                <p style={{ paddingLeft: "10px" }}></p>
              </div>
              <div
                className="second-row"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    width: "110px",
                    marginTop: "18px",
                  }}
                >
                  Local Time
                </p>
                <div className="donor">
                  <label
                    style={{
                      //  width: "45px",
                      fontSize: "12px", margin: "0px"
                    }}
                  >
                    Test 2.
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test2"
                    value={formData.test2}
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      //  width: "85px",
                      margin: "0px"
                    }}
                    required
                  />
                </div>
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      // marginLeft: "10px",
                      // marginRight: "-10px",
                    }}
                  >
                    BrAC Result
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test2BaracResult1"
                    value={formData.test2BaracResult1}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      // marginLeft: "10px",
                      // marginRight: "-10px",
                    }}
                  >
                    BrAC Result
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="test2BaracResult2"
                    value={formData.test2BaracResult2}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
                <p style={{ paddingLeft: "10px" }}></p>
              </div>
              <div
                className="second-row"
                style={{ display: "flex" }}
              >
                <div className="donor">
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      //// width: "130px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    Collector Name:{" "}
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="collectorName"
                    value={formData.collectorName}
                    placeholder=""
                    onChange={handleChange}
                    // style={{ width: "142px", margin: "0px" }}
                    required
                  />
                </div>
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      // marginLeft: "31px",
                      // marginRight: "10px",
                    }}
                  >
                    Remarks
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="collectorRemarks"
                    value={formData.collectorRemarks}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
              </div>
              <div
                className="second-row"
              // style={{ display: "flex", justifyContent: "space-around" }}
              >
                <div className="donor">
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      //// width: "130px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    Collector Signature:{" "}
                  </label>
                  {/* <input
                    className="inputstyle"
                    type="image"
                    name="collectorSignature"
                    value=""
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      width: "156px",
                     margin: "0px",
                     cursor: "pointer",
                     backgroundImage: `url(${formData.collectorSignature})`,
                     backgroundSize: "contain",
                     backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     height: "30px", // Adjust height to fit the signature image
                   }}
                    required
                  /> */}
                  <input
                    className="inputstyle"
                    type="text"
                    onClick={() => { openSignaturePad(); setIsCollectorOpen(true) }}
                    name="collectorSignature"
                    value=""
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      // width: "152px",
                      margin: "0px", cursor: "pointer",
                      backgroundImage: `url(${formData.collectorSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center", height: "30px"
                    }}

                  />
                </div>
                {isSignaturePadOpen && collectorOpen && (
                  pad("collectorSignature")
                )}
                <div className="donor">
                  {/* Date of Birth */}
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      // marginLeft: "10px",
                      // marginRight: "10px",
                    }}
                  >
                    Date
                  </label>
                  <input
                    className="inputstyle"
                    type="date"
                    name="collectorDate"
                    value={formData.collectorDate}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="third-row" style={{ marginBottom: "10px" }}>
            <p style={{ fontSize: "12px" }}>
              {" "}
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                DONOR CONSENT TO TEST AND SPECIFIC DECLARATION
              </span>{" "}
              I hereby consent to providing a sample of breath, saliva, urine
              hair or blood to the collector and if required for it to be
              screened in my presence, if necessary, and if required by my
              employer / potential future employer, for the analysis to be
              performed at an off site laboratory. I also consent to the results
              of the analysis being communicated in writing to my employer /
              potential future employer and for them to use this information for
              any purpose connected to my employment / application for
              employment{" "}
              <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                I declare that I have read and understood the Donor Information
                Sheet relating to the test.
              </span>
            </p>
            <div class="" className="donor-consent-row">
              <div className="donor">
                {/* GCAA LIC No */}
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    // width: "120px",
                  }}
                >
                  Donor Consent{" "}
                </label>
                {/* <input
                  className="inputstyle"
                  type="text"
                  name="donorConcent"
                  value={formData.donorConcent}
                  placeholder=""
                  onChange={handleChange}
                  style={{ margin: "0px", width: "150px" }}
                  required
                /> */}
                <input
                  className="inputstyle"
                  type="text"
                  name="donorConcent"
                  value=""
                  placeholder=""
                  onClick={() => { openSignaturePad(); setisconcentOpen(true) }}
                  style={{
                    // width: "156px",
                    margin: "0px",
                    cursor: "pointer",
                    backgroundImage: `url(${formData.donorConcent})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "30px", // Adjust height to fit the signature image
                  }}
                  readOnly
                />
                {isError && isError === 'donorConcent' && (
                  <p style={{ color: "red", padding: "5px", fontSize: "12px", marginTop: "5px" }}>
                    Please fill donor signature
                  </p>
                )}


              </div>
              {isSignaturePadOpen && ConcentOpen && (
                pad("donorConcent")
              )}

              <div
                class="box"
                style={{
                  border: "1px solid black",
                  // marginLeft: "15px",
                  padding: "3px",
                  // width: "90%",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    margin: "0px",
                    paddingLeft: "10px",
                  }}
                >
                  I am satisfied that the test has been completed in line with
                  stated process.
                </p>
                <div
                  className="second-row"
                // style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="donor">
                    {/* GCAA LIC No */}
                    <label
                      style={{
                        // width: "130px",
                        fontSize: "11px",
                        fontWeight: "bold",
                      }}
                    >
                      Donor Declaration:{" "}
                    </label>
                    {/* <input
                      className="inputstyle"
                      type="text"
                      name="donorDeclaration"
                      value={formData.donorDeclaration}
                      placeholder=""
                      onChange={handleChange}
                      style={{ width: "152px", margin: "0px", height: "5px" }}
                      required
                    /> */}
                    <input
                      className="inputstyle"
                      type="text"
                      name="donorDeclaration"
                      value=""
                      placeholder=""
                      onClick={() => { openSignaturePad(); setIsdeclarationopen(true) }}
                      style={{
                        width: "156px",
                        margin: "0px",
                        cursor: "pointer",
                        backgroundImage: `url(${formData.donorDeclaration})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        height: "30px", // Adjust height to fit the signature image
                      }}
                      readOnly
                    />
                    {isError && isError === 'donorDeclaration' && (
                      <p style={{ color: "red", padding: "5px", fontSize: "12px", marginTop: "5px" }}>
                        Please fill donor signature
                      </p>
                    )}


                  </div>
                  {isSignaturePadOpen && declarationOpen && (
                    pad("donorDeclaration")
                  )}

                  <div className="donor">
                    <label
                      style={{
                        // width: "25px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        // marginLeft: "10px",
                        // marginRight: "10px",
                      }}
                    >
                      Date
                    </label>
                    <input
                      className="inputstyle"
                      type="date"
                      name="donorConcentDate"
                      value={formData.donorConcentDate}
                      onChange={handleChange}
                      style={{
                        //  width: "69%",
                        height: "5px"
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table className="table-one">
            {/* <tr>
              <hr style={{ marginTop: "25px" }} />
              <table className="table-one" style={{ marginTop: "0px" }}>
                <tr>
                  <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                      <h4>What test type is required?</h4>
                      <tr>
                        <th>Test Name</th>
                        <th>Include</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specificFields.map((field, index) => (
                        <tr key={index}>
                          <td style={{ border: "1px solid black", padding: "8px" }}>{field === 'DrugsandAlcoholUrineTest' ? ' Drugs and Alcohol (Urine & Breath)' : field === 'DrugsandAlcoholOralTest' ? 'Drugs and Alcohol (Oral Fl & Breath)' : field === 'BreathAlcoholOnlyTest' ? 'Breath Alcohol Only' : field === 'DrugsOnlyTest' ? 'Drugs Only ' : field}</td>
                          <td style={{ border: "1px solid black", padding: "8px" }}>

                            <input
                              type="checkbox"
                              name={field}
                              checked={formData[field]}
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </tr>
                <tr>
                  <td colspan="3" className="form-description">
                    <caption>Medication</caption>
                    Give details of any medication, nutritional or fitness
                    supplements taken within the last 14 days. If none, write
                    'NONE'.
                  </td>
                </tr>
                <tr>
                <th>
                    Date Taken
                    {formData.DrugsandAlcoholUrineTest === true || formData.DrugsandAlcoholOralTest === true
                      // ? (
                      //   <span style={{ color: "red" }}>*</span>
                      // ) : null
                    }
                  </th>
                  <th>
                    Type/Description
                    {
                      formData.DrugsandAlcoholUrineTest === true || formData.DrugsandAlcoholOralTest === true
                      //  ? (
                      //   <span style={{ color: "red" }}>*</span>
                      // ) : null
                    }
                  </th>
                  <th>
                    Dosage
                    {formData.DrugsandAlcoholUrineTest === true || formData.DrugsandAlcoholOralTest === true
                      // ? (
                      //   <span style={{ color: "red" }}>*</span>
                      // ) : null
                    }
                  </th>

                </tr>
                <tr>
                  <td>
                    <input
                      className="noborder"
                      type="date"
                      name="medicationDate1"
                      value={formData.medicationDate1}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationType1"
                      value={formData.medicationType1}
                      onChange={handleChange}
                    // required={formData.DrugsandAlcoholUrineTest !== "" || formData.DrugsandAlcoholOralTest !== ""}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationDosage1"
                      value={formData.medicationDosage1}
                      onChange={handleChange}
                    // required={formData.DrugsandAlcoholUrineTest !== "" || formData.DrugsandAlcoholOralTest !== ""}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      className="noborder"
                      type="date"
                      name="medicationDate2"
                      value={formData.medicationDate2}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationType2"
                      value={formData.medicationType2}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationDosage2"
                      value={formData.medicationDosage2}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      className="noborder"
                      type="date"
                      name="medicationDate3"
                      value={formData.medicationDate3}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationType3"
                      value={formData.medicationType3}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationDosage3"
                      value={formData.medicationDosage3}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      className="noborder"
                      type="date"
                      name="medicationDate4"
                      value={formData.medicationDate4}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationType4"
                      value={formData.medicationType4}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      className="noborder"
                      type="text"
                      name="medicationDosage4"
                      value={formData.medicationDosage4}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              </table>
            </tr> */}

            <thead>
              <h4>Test Details</h4>
              <tr>
                <th>Test Method</th>
                <th>Technology</th>
                <th>Cut Off Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {formData.testMethods?.join(', ') || 'N/A'}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {formData.testingTechnology?.join(', ') || 'N/A'}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {formData.cutOffLevels || 'N/A'}
                </td>
              </tr>
            </tbody>

          </table>
          <div class="row5">
            <div
              className="head"
              style={{
                // border: "1px solid black",
                // borderBottom: "none",
                width: "98.7%",
                height: "30px",
                fontSize: "15px",
                fontWeight: "bold",
                paddingLeft: "10px",
              }}
            >
              Adulteration Check
            </div>
            <div className="adulteration-body">
              <div
                className="bone"
                style={{
                  border: "1px solid black",
                  // borderRight: "none",
                  // width: "30%",
                  // height: "100px",
                }}
              >
                <div className="donor" style={{ marginLeft: "5px" }}>
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      width: "40%",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Collection Time:{" "}
                  </label>
                  <input
                    className="inputstyle explabel"
                    type="text"
                    name="collectionTime"
                    value={formData.collectionTime}
                    placeholder=""
                    onChange={handleChange}
                    style={{ width: "102px", margin: "0px", height: "5px" }}
                    required
                  />
                </div>
                <div className="donor" style={{ marginLeft: "5px" }}>
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      width: "40%",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Result Read Time:{" "}
                  </label>
                  <input
                    className="inputstyle explabel"
                    type="text"
                    name="resultReadTime"
                    value={formData.resultReadTime}
                    placeholder=""
                    onChange={handleChange}
                    style={{ width: "102px", margin: "0px", height: "5px" }}
                    required
                  />
                </div>
                <div class="row"></div>
                <h5 style={{ marginLeft: "3px" }}>
                  Temperature 32 - 38˚{" "}
                  <label
                    style={{
                      // marginRight: "10px",
                      // marginLeft: "10px",
                      width: "100px",
                      fontSize: "14px",
                    }}
                  >
                    Yes
                    <input
                      className="radioinput"
                      type="radio"
                      name="temperature"
                      value="Yes"
                      checked={formData.temperature === 'Yes'}
                      onChange={handleChange}
                    />
                  </label>
                  <label
                    style={{
                      marginRight: "10px",
                      width: "100px",
                      fontSize: "14px",
                    }}
                  >
                    No
                    <input
                      className="radioinput"
                      type="radio"
                      name="temperature"
                      value="No"
                      checked={formData.temperature === 'No'}
                      onChange={handleChange}
                    />
                  </label>
                </h5>
              </div>
              <div class="btwo myb" style={{ minHeight: "100px" }}>
                <div
                  class="row1"
                  style={{ minHeight: "50px", borderBottom: "1px solid black" }}
                >
                  <div class="lotexprow" style={{ display: "flex" }}>
                    <div
                      class=""
                      style={{
                        minHeight: "50px",
                        width: "50%",
                        // borderRight: "1px solid black",
                      }}
                    >
                      <div
                        className="donor"
                        style={{ marginLeft: "15px", marginTop: "10px" }}
                      >
                        {/* GCAA LIC No */}
                        <label
                          style={{
                            width: "20%",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Lot No.{" "}
                        </label>
                        <input
                          className="inputstyle explabel"
                          type="number"
                          name="lotno"
                          value={formData.lotno}
                          placeholder=""
                          onChange={handleChange}
                          style={{
                            width: "72px",
                            margin: "0px",
                            height: "5px",
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div class="" style={{ minHeight: "50px", width: "50%" }}>
                      <div
                        className="donor"
                        style={{
                          marginLeft: "15px",
                          // marginLeft: "10px", 
                          marginTop: "10px"
                        }}
                      >
                        {/* GCAA LIC No */}
                        <label
                          className="explabel"
                          style={{
                            width: "20%",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          Exp Date{" "}
                        </label>
                        <input
                          className="inputstyle explabel"
                          type="date"
                          name="expDate"
                          value={formData.expDate}
                          placeholder=""
                          onChange={handleChange}
                          style={{
                            width: "52px",
                            margin: "0px",
                            height: "5px",
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row2" style={{ minHeight: "50px" }}>
                  <h5 style={{ marginLeft: "5px", marginTop: "10px" }}>
                    Adulteration Test Passed
                    <label
                      style={{
                        marginRight: "10px",
                        marginLeft: "20px",
                        width: "100px",
                        fontSize: "14px",
                      }}
                    >
                      Yes
                      <input
                        className="radioinput"
                        type="radio"
                        name="adulterationTestPassed"
                        value="Yes"
                        checked={formData.adulterationTestPassed === 'Yes'}
                        onChange={handleChange}
                      />
                    </label>
                    <label
                      style={{
                        marginRight: "10px",
                        width: "100px",
                        fontSize: "14px",
                      }}
                    >
                      No
                      <input
                        className="radioinput"
                        type="radio"
                        name="adulterationTestPassed"
                        value="No"
                        checked={formData.adulterationTestPassed === 'No'}
                        onChange={handleChange}
                      />
                    </label>
                  </h5>
                </div>
              </div>
              <div
                class="bthree"
                style={{
                  border: "1px solid black",
                  // borderLeft: "none",
                  // width: "30%",
                  minHeight: "100px",
                }}
              >
                <div
                  className=""
                  style={{
                    padding: "10px",
                    marginLeft: "5px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* GCAA LIC No */}
                  <label
                    className="remarks"
                    style={{
                      //// width: "130px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Remarks / Drug Test Result
                  </label>
                  <input

                    className="inputstyle remarksinput"
                    type="text"
                    name="adulterationRemarks"
                    value={formData.adulterationRemarks}
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      width: "50%",
                      margin: "0px", height: "5px"
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                border: "1px solid black",
              }}
            >
              <thead>
                <tr>
                  <th
                    colSpan="6"
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    Laboratory Tests (Please tick tests required)
                  </th>
                  <th
                    colSpan="1"
                    style={{ border: "1px solid black", padding: "8px" }}
                  ></th>
                  <th
                    colSpan="1"
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    Screen
                  </th>
                  <th
                    colSpan="1"
                    style={{ border: "1px solid black", padding: "8px" }}
                  >
                    Confirm
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["", "screen", "confirm", "", "Methamphetamine"],
                  ["Alcohol", "", "", "Cocaine", "Morphine"],
                  ["Amphetamines", "", "", "Ketamine", "Network Rail Std"],
                  [
                    "Benzodiazepines",
                    "",
                    "",
                    "Maritime Std",
                    "Opiates",
                  ],
                  ,
                  ["Buprenorphine", "", "", "MDMA", "SSRI"],
                  ["Blood", "", "", "Methadone", "TCA"],
                  ["Other (Please Specify)", "", "", "", "THC"],
                ].map(([leftTest, a, b, rightTest, c], index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {leftTest}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {a}
                      {index !== 0 && (<input
                        type="checkbox"
                        name={`${leftTest.split(" ")[0]}Screen`}
                        checked={formData[`${leftTest.split(" ")[0]}Screen`] || false}
                        onChange={handleChange}
                      />)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {b}
                      {index !== 0 && (<input
                        type="checkbox"
                        name={`${leftTest.split(" ")[0]}Confirm`}
                        checked={formData[`${leftTest.split(" ")[0]}Confirm`] || false}
                        onChange={handleChange}
                      />)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {rightTest}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {a}
                      {index !== 0 && index !== 7 && (<input
                        type="checkbox"
                        name={`${rightTest.split(" ")[0]}Screen`}
                        checked={formData[`${rightTest.split(" ")[0]}Screen`] || false}
                        onChange={handleChange}
                      />)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {b}
                      {index !== 0 && index !== 7 && (<input
                        type="checkbox"
                        name={`${rightTest.split(" ")[0]}Confirm`}
                        checked={formData[`${rightTest.split(" ")[0]}Confirm`] || false}
                        onChange={handleChange}
                      />)}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {c}
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    >{<input
                      type="checkbox"
                      name={`${c.split(" ")[0]}Screen`}
                      checked={formData[`${c.split(" ")[0]}Screen`] || false}
                      onChange={handleChange}
                    />}</td>
                    <td
                      style={{ border: "1px solid black", padding: "8px" }}
                    >{<input
                      type="checkbox"
                      name={`${c.split(" ")[0]}Confirm`}
                      checked={formData[`${c.split(" ")[0]}Confirm`] || false}
                      onChange={handleChange}
                    />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="myb seventh-row">
            <div
              class="third-row"
              style={{ marginBottom: "10px", padding: "10px" }}
            >
              <div class="" style={{ borderBottom: "1px solid black" }}>
                <h5 style={{ fontWeight: "bold", fontSize: "15px" }}>
                  DONOR CONSENT TO TEST AND SPECIFIC DECLARATION
                </h5>
              </div>
              <p style={{ fontSize: "12px" }}>
                {" "}
                I certify that the specimens accompanying this form are my own
                and were provided by me to the collector. The specimens were
                split and sealed with tamper-proof seals in my presence and the
                information provided on this form and on the labels is correct.
                I consent to the specimens being submitted to a laboratory for
                testing. I understand the results of the test will only be made
                available to the organisation requesting the test or their
                authorised representatives.
                <span style={{ fontWeight: "bold", fontSize: "13px" }}>
                  I am satisfied that the test has been completed in line with
                  stated process.
                </span>
              </p>
              <div className="donorConcentToTest">
                <div className="donor">
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      // width: "60px",
                    }}
                  >
                    Name{" "}
                  </label>
                  {/* <input
                    className="inputstyle"
                    type="text"
                    name="donorCertificationName"
                    value={formData.donorCertificationName}
                    placeholder=""
                    onChange={handleChange}
                    style={{ margin: "0px", width: "150px" }}
                    required
                  /> */}
                  <input
                    className="inputstyle"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    placeholder="Enter Donor's Name"
                    required
                  />
                </div>
                <div className="donor" >
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      // width: "80px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Signature{" "}
                  </label>
                  {/* <input
                    className="inputstyle"
                    type="image"
                    name="donorCertificationSignature"
                    value=''
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      width: "156px",
                     margin: "0px",
                     cursor: "pointer",
                     backgroundImage: `url(${formData.donorCertificationSignature})`,
                     backgroundSize: "contain",
                     backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     height: "30px", // Adjust height to fit the signature image
                   }}
                    required
                  />
                </div> */}
                  <input
                    className="inputstyle"
                    type="text"
                    name="donorCertificationSignature"
                    value=""//{formData.donorCertificationSignature}
                    placeholder=""
                    onChange={handleChange}
                    onClick={() => { openSignaturePad(); setIsDonorConcentOpen(true) }}
                    style={{
                      // width: "152px",
                      // marginLeft: "30px",
                      cursor: "pointer",
                      backgroundImage: `url(${formData.donorCertificationSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center", height: "30px"
                    }}

                  />
                </div>
                {isSignaturePadOpen && donorConcentOpen && (
                  pad("donorCertificationSignature")
                )}
                <div className="donor" >
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      // marginLeft: "10px",
                      // marginRight: "10px",
                    }}
                  >
                    Date
                  </label>
                  <input
                    className="inputstyle"
                    type="date"
                    name="donorCertificationDate"
                    value={formData.donorCertificationDate}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="myb eightth-row"
            style={{ marginTop: "70px", marginBottom: "20px" }}
          >
            <div
              class="third-row"

              style={{ marginBottom: "10px", padding: "10px" }}
            >
              <div class="" style={{ borderBottom: "1px solid black" }}>
                <h5 style={{ fontWeight: "bold", fontSize: "15px" }}>
                  Collector Certification
                </h5>
              </div>
              <p style={{ fontSize: "12px" }}>
                {" "}
                I certify that the specimen identified on this form is that
                provided to me by the donor providing the certification above,
                that it bears the identification as set forth above and that it
                has been collected in accordance with the instructions provided.
              </p>
              <div class="" className="donorConcentToTest">
                {/* //style={{ display: "flex" }}> */}
                <div className="donor">
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      // width: "60px",
                    }}
                  >
                    Name{" "}
                  </label>
                  <input
                    className="inputstyle"
                    type="text"
                    name="collectorCertificationName"
                    value={formData.collectorCertificationName}
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      margin: "0px",
                      //  width: "150px"
                    }}
                    required
                  />
                </div>
                <div className="donor" >
                  {/* GCAA LIC No */}
                  <label
                    style={{
                      // width: "80px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    Signature{" "}
                  </label>
                  {/* <input
                    className="inputstyle"
                    type="image"
                    name="collectorCertificationSignature"
                    value=""
                    placeholder=""
                    onChange={handleChange}
                    style={{
                      width: "156px",
                     margin: "0px",
                     cursor: "pointer",
                     backgroundImage: `url(${formData.collectorCertificationSignature})`,
                     backgroundSize: "contain",
                     backgroundRepeat: "no-repeat",
                     backgroundPosition: "center",
                     height: "30px", // Adjust height to fit the signature image
                   }}
                    required
                  /> */}
                  <input
                    className="inputstyle"
                    type="text"
                    name="collectorCertificationSignature"
                    value=""//{formData.collectorCertificationSignature}
                    placeholder=""
                    onClick={() => { openSignaturePad(); setIsCollectorCerificationOpen(true) }}
                    onChange={handleChange}
                    style={{
                      // width: "152px", 
                      margin: "0px", cursor: "pointer",
                      backgroundImage: `url(${formData.collectorCertificationSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center", height: "30px"
                    }}

                  />
                </div>
                {isSignaturePadOpen && collectorCertificationOpen && (
                  pad("collectorCertificationSignature")
                )}
                <div className="donor" >
                  <label
                    style={{
                      // width: "25px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      // marginLeft: "10px",
                      // marginRight: "10px",
                    }}
                  >
                    Date
                  </label>
                  <input
                    className="inputstyle"
                    type="date"
                    name="collectorCertificationDate"
                    value={formData.collectorCertificationDate}
                    onChange={handleChange}
                    // style={{ width: "69%" }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="last-row">
            <div class="part1" style={{ padding: "10px", border: "1px solid black", height: "149px", marginBottom: "20px", }}><h5 style={{ fontWeight: "bold", fontSize: "15px" }}>
              Received at Laboratory:
            </h5> <div className="donor" style={{ marginLeft: "5px" }}>
                {/* GCAA LIC No */}
                <label
                  style={{
                    // width: "130px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Initials:{" "}
                </label>
                <input
                  className="inputstyle"
                  type="text"
                  name="recieveInitial"
                  value={formData.recieveInitial}
                  placeholder=""
                  onChange={handleChange}
                  style={{ width: "102px", margin: "0px", height: "5px" }}
                  required
                />
              </div>
              <div className="donor" style={{ marginLeft: "5px" }}>
                {/* GCAA LIC No */}
                <label
                  style={{
                    // width: "130px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Name:{" "}
                </label>
                <input
                  className="inputstyle"
                  type="text"
                  name="recieveName"
                  value={formData.recieveName}
                  placeholder=""
                  onChange={handleChange}
                  style={{ width: "102px", margin: "0px", height: "5px" }}
                  required
                />
              </div>
              <div className="donor" style={{ marginLeft: "5px" }}>
                {/* GCAA LIC No */}
                <label
                  style={{
                    // width: "130px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  Date:{" "}
                </label>
                <input
                  className="inputstyle"
                  type="date"
                  name="recieveDate"
                  value={formData.recieveDate}
                  placeholder=""
                  onChange={handleChange}
                  style={{ width: "102px", margin: "0px", height: "5px" }}
                  required
                />
              </div>
            </div>
            <div class="part2" style={{  border: "1px solid black", height: "150px", marginBottom: "20px",  }}><h5 style={{ fontWeight: "bold", padding: "7px", paddingLeft: "0px", fontSize: "15px" }}>
              Specimen bottle seals intact
            </h5><div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
                <label
                  style={{
                    // marginRight: "10px",
                    // width: "50px",
                    fontSize: "14px",
                  }}
                >
                  Yes
                  <input
                    className="radioyesno"
                    type="radio"
                    name="specimenBottle"
                    value="Yes"
                    checked={formData.specimenBottle === 'Yes'}
                    onChange={handleChange}
                  />
                </label>
                <label
                  style={{
                    // marginRight: "10px",
                    // width: "50px",
                    fontSize: "14px",
                  }}
                >
                  No
                  <input
                    className="radioyesno"
                    type="radio"
                    name="specimenBottle"
                    value="No"
                    checked={formData.specimenBottle === 'No'}
                    onChange={handleChange}
                  />
                </label>
                <span
                  style={{
                    // marginLeft: "auto",
                    // width: "110px",
                     width:"100%",
                    marginLeft: "0px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "green", // Add color to indicate clickable text
                  }}
                  onClick={() => handleAddComment("specimenBottleComment")} // Handle add comment
                  title={formData.specimenBottleComment} // Display the comment on hover
                >
                  {formData.specimenBottleComment ? "update comment" : "add comment"}
                </span>
              </div>
              {/* Display comment below, if available */}
              {formData.specimenBottleComment && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    marginTop: "5px",
                    paddingLeft: "10px",
                  }}
                >
                  Comment: {formData.specimenBottleComment}
                </div>
              )}
            </div>
            <div class="part3" style={{   border: "1px solid black", height: "150px", marginBottom: "20px" }}>
              <h5 style={{ fontWeight: "bold", padding: "7px", paddingLeft: "0px", fontSize: "15px" }}>
              Fatal Flaw
            </h5><div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
                <label
                  style={{
                    // marginRight: "10px",
                    // width: "50px",
                    fontSize: "14px",
                  }}
                >
                  Yes
                  <input
                    className="radioyesno"
                    type="radio"
                    name="fatalFlaws"
                    value="Yes"
                    checked={formData.fatalFlaws === 'Yes'}
                    onChange={handleChange}
                  />
                </label>
                <label
                  style={{
                    // marginRight: "10px",
                    // width: "50px",
                    fontSize: "14px",
                  }}
                >
                  No
                  <input
                    className="radioyesno"
                    type="radio"
                    name="fatalFlaws"
                    value="No"
                    checked={formData.fatalFlaws === 'No'}
                    onChange={handleChange}
                  />
                </label>
                <span
                  style={{
                    // marginLeft: "auto",
                    // width: "110px",
                    width:"100%",
                    marginLeft: "0px",
                    fontSize: "14px",
                    cursor: "pointer",
                    color: "green", // Add color to indicate clickable text
                  }}
                  onClick={() => handleAddComment("fatalFlawsComment")} // Handle add comment
                  title={formData.fatalFlawsComment} // Display the comment on hover
                >
                  {formData.fatalFlawsComment ? "update comment" : "add comment"}
                </span>
              </div>
              {/* Display comment below, if available */}
              {formData.fatalFlawsComment && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    marginTop: "5px",
                    paddingLeft: "10px",
                  }}
                >
                  Comment: {formData.fatalFlawsComment}
                </div>
              )}
            </div>
          </div>


          {/* Submit Button */}
          {/* {formData.isUpdated !== true ?
            (!isloading ? <button
              className="createjob2"
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                background: "#80c209",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Update
            </button> : <div style={{width:"100%",display: "flex",justifyContent:"center"}}><img src="/empty.gif" style={{width:"130px",}}/></div>) : null}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => navigate('/refusalform')}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              Go to Refusal Form
            </button>
          </div> */}
          {/* Submit Button */}
{formData.isUpdated !== true ? (
  !isloading ? (
    <button
      className="createjob2"
      type="submit"
      style={{
        width: "100%",
        padding: "10px",
        background: "#80c209",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Update
    </button>
  ) : (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <img src="/empty.gif" style={{ width: "130px" }} />
    </div>
  )
) : null}

{/* Abort Test Section */}
<div style={{ marginTop: "30px", textAlign: "center" }}>
  <label
    style={{
      fontWeight: "bold",
      fontSize: "16px",
      marginRight: "10px",
      color: "#333",
    }}
  >
    Abort Test:
  </label>

  <select
    onChange={(e) => {
      if (e.target.value) navigate(e.target.value);
    }}
    style={{
      padding: "10px 15px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "16px",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      color: "#333",
    }}
  >
    <option value="">Select Form</option>
    <option value="/refusalform">Donor Refusal Form</option>
    <option value="/shybladder">Shy Bladder Form</option>
    <option value="/shylung">Shy Lung Form</option>
  </select>
</div>
<button type="button" onClick={handleDownloadPDF} style={{ marginTop: "20px" }}>
      Download PDF
    </button>

        </form>
      </div>
    </>
  );
}

export default Screen4Details;