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

  // ✅ UPDATED: Data fetching with collectorId and fallback handling
  // useEffect(() => {
  //   const fetchScreen4Data = async () => {
  //     try {
  //       const urlParams = new URLSearchParams(window.location.search);
  //       const collectorId = urlParams.get('collectorId');
        
  //       if (!collectorId) {
  //         throw new Error("Collector ID is missing from URL");
  //       }

  //       console.log('🔄 Fetching COC data for:', { jobId: id, collectorId });

  //       // ✅ TRY 1: New API endpoint
  //       const primaryUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorcocform/${id}/${collectorId}`;
  //       console.log('🔗 Trying primary API:', primaryUrl);
        
  //       let response = await fetch(primaryUrl);

  //       if (response.status === 404) {
  //         // ✅ TRY 2: Existing working API as fallback
  //         console.log('🔄 Primary API returned 404, trying fallback...');
  //         const fallbackUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorformbyjob/${id}?collectorId=${collectorId}`;
  //         console.log('🔗 Trying fallback API:', fallbackUrl);
          
  //         response = await fetch(fallbackUrl);
  //       }

  //       if (!response.ok) {
  //         // ✅ If both APIs fail, create empty form for user to fill
  //         console.log('📝 No existing COC form found - creating empty form');
  //         setFormData({
  //           companyName: '',
  //           flight: '',
  //           location: '',
  //           refno: '',
  //           dateoftest: '',
  //           reasonForTest: '',
  //           donorName: '',
  //           donorEmail: '',
  //           gender: '',
  //           barcodeno: '',
  //           AlcoholScreen: '',
  //           AlcoholConfirm: '',
  //           AmphetamineScreen: '',
  //           AmphetamineConfirm: '',
  //           BenzodiazepineScreen: '',
  //           BenzodiazepineConfirm: '',
  //           CocaineScreen: '',
  //           CocaineConfirm: '',
  //           MethamphetamineScreen: '',
  //           MethamphetamineConfirm: '',
  //           MorphineScreen: '',
  //           MorphineConfirm: '',
  //           NetworkScreen: '',
  //           NetworkConfirm: '',
  //           OpiatesScreen: '',
  //           OpiatesConfirm: '',
  //           SSRIScreen: '',
  //           SSRIConfirm: '',
  //           TCAScreen: '',
  //           TCAConfirm: '',
  //           THCScreen: '',
  //           THCConfirm: '',
  //           donorCertificationName: '',
  //           donorCertificationSignature: '',
  //           donorCertificationDate: '',
  //           collectorCertificationName: '',
  //           collectorCertificationSignature: '',
  //           collectorCertificationDate: '',
  //           recieveInitial: '',
  //           recieveName: '',
  //           recieveDate: '',
  //           specimenBottle: '',
  //           fatalFlaws: '',
  //           specimenBottleComment: '',
  //           fatalFlawsComment: '',
  //           DrugsandAlcoholUrineTest: false,
  //           DrugsandAlcoholOralTest: false,
  //           BreathAlcoholOnlyTest: false,
  //           DrugsOnlyTest: false
  //         });
  //         setError('No existing COC form found. Please fill out the form below.');
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log('✅ API Success (raw):', data);

  //       // Accept multiple possible response shapes from backend
  //       let cocData = null;

  //       if (!data) {
  //         cocData = null;
  //       } else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
  //         cocData = data.data;
  //       } else if (Array.isArray(data.data) && data.data.length > 0) {
  //         cocData = data.data[0];
  //       } else if (Array.isArray(data) && data.length > 0) {
  //         cocData = data[0];
  //       } else if (typeof data === 'object') {
  //         cocData = data;
  //       }

  //       if (!cocData || Object.keys(cocData).length === 0) {
  //         console.log('⚠️ COC payload empty or not found in API response. Trying /getcocforms fallback...');

  //         try {
  //           const listResp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getcocforms/${id}`);
  //           if (listResp.ok) {
  //             const listData = await listResp.json();
  //             const forms = listData?.data || listData || [];
  //             if (Array.isArray(forms) && forms.length > 0) {
  //               cocData = forms[0];
  //               console.log('✅ Found COC via getcocforms fallback:', cocData);
  //             }
  //           }
  //         } catch (e) {
  //           console.error('Fallback getcocforms failed:', e);
  //         }
  //       }

  //       if (!cocData || Object.keys(cocData).length === 0) {
  //         console.log('⚠️ No COC found after fallback. Showing empty form.');
  //         setError('No existing COC form found. Please fill out the form below.');
  //         return;
  //       }

  //       // Map known field names into local formData (be tolerant to naming differences)
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         ...cocData,
  //         companyName: cocData.companyName || cocData.company || '',
  //         flight: cocData.flight || cocData.flightVessel || '',
  //         location: cocData.location || '',
  //         refno: cocData.refno || cocData.cocRefNo || '',
  //         dateoftest: cocData.dateoftest ? new Date(cocData.dateoftest).toISOString().slice(0, 16) : (cocData.dateoftestRaw || ''),
  //         reasonForTest: cocData.reasonForTest || '',
  //       }));

  //     } catch (error) {
  //       console.error('💥 Fetch error:', error);
  //       setError(error.message);
        
  //       // ✅ Even on error, show empty form
  //       setFormData({
  //         companyName: '',
  //         flight: '',
  //         location: '',
  //         refno: '',
  //         dateoftest: '',
  //         reasonForTest: '',
  //         donorName: '',
  //         donorEmail: '',
  //         gender: '',
  //         barcodeno: '',
  //         AlcoholScreen: '',
  //         AlcoholConfirm: '',
  //         AmphetamineScreen: '',
  //         AmphetamineConfirm: '',
  //         BenzodiazepineScreen: '',
  //         BenzodiazepineConfirm: '',
  //         CocaineScreen: '',
  //         CocaineConfirm: '',
  //         MethamphetamineScreen: '',
  //         MethamphetamineConfirm: '',
  //         MorphineScreen: '',
  //         MorphineConfirm: '',
  //         NetworkScreen: '',
  //         NetworkConfirm: '',
  //         OpiatesScreen: '',
  //         OpiatesConfirm: '',
  //         SSRIScreen: '',
  //         SSRIConfirm: '',
  //         TCAScreen: '',
  //         TCAConfirm: '',
  //         THCScreen: '',
  //         THCConfirm: '',
  //         donorCertificationName: '',
  //         donorCertificationSignature: '',
  //         donorCertificationDate: '',
  //         collectorCertificationName: '',
  //         collectorCertificationSignature: '',
  //         collectorCertificationDate: '',
  //         recieveInitial: '',
  //         recieveName: '',
  //         recieveDate: '',
  //         specimenBottle: '',
  //         fatalFlaws: '',
  //         specimenBottleComment: '',
  //         fatalFlawsComment: '',
  //         DrugsandAlcoholUrineTest: false,
  //         DrugsandAlcoholOralTest: false,
  //         BreathAlcoholOnlyTest: false,
  //         DrugsOnlyTest: false
  //       });
  //     }
  //   };

  //   fetchScreen4Data();
  // }, [id]);


  // ✅ UPDATED: Data fetching for ALL USERS (Client, Admin, Collector)
useEffect(() => {
  const fetchScreen4Data = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const collectorId = urlParams.get('collectorId');
      
      
      // ✅ DETERMINE USER TYPE
      let userType = 'admin'; // Default
      if (collectorId) {
        userType = 'collector';
      } else {
        // Check cookies or other methods to distinguish client vs admin
        const token = Cookies.get("Token");
        if (token === "clientdgf45sdgf89756dfgdhgdf") {
          userType = 'client';
        }
      }
      
      console.log('🔄 Fetching COC data for:', { 
        jobId: id, 
        userType: userType,
        collectorId: collectorId 
      });

      let apiUrl = '';
      
      // ✅ ALL USERS USE SAME API - Get COC forms by job ID
      // Build URL conditionally - if collectorId exists, include it, otherwise use jobId only
      if (collectorId && collectorId !== 'null' && collectorId !== 'undefined') {
        apiUrl = `${import.meta.env.VITE_API_BASE_URL}/getcocforms/${id}/${collectorId}`;
      } else {
        apiUrl = `${import.meta.env.VITE_API_BASE_URL}/getcocforms/${id}`;
      }
      console.log('🔗 API for all users:', apiUrl);

      const response = await fetch(apiUrl);





      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Success:', data);

        let cocData = null;

        // Accept a variety of shapes from API
        if (data && typeof data === 'object' && !Array.isArray(data) && data.data && Array.isArray(data.data) && data.data.length > 0) {
          // API returned { data: [...] } - take first item
          cocData = data.data[0];
        } else if (Array.isArray(data?.data) && data.data.length > 0) {
          // data.data is array - take first item
          cocData = data.data[0];
        } else if (Array.isArray(data) && data.length > 0) {
          // data itself is array - take first item
          cocData = data[0];
        } else if (data && typeof data === 'object' && Object.keys(data).length > 0 && !data.success) {
          // some APIs may return the document directly
          cocData = data;
        }

        // ✅ Fallback to collector-specific fetch if nothing found
        if (!cocData && collectorId) {
          try {
            const byCollectorUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorcocform/${id}/${collectorId}`;
            console.log('🔎 Trying collector-specific endpoint:', byCollectorUrl);
            const resp2 = await fetch(byCollectorUrl);
            if (resp2.ok) {
              const data2 = await resp2.json();
              const maybeData = data2?.data || data2 || null;
              // Handle array case
              if (Array.isArray(maybeData) && maybeData.length > 0) {
                cocData = maybeData[0];
              } else if (maybeData && typeof maybeData === 'object') {
                cocData = maybeData;
              }
            }
          } catch (e) {
            console.warn('Collector-specific fetch failed', e);
          }
        }

        // ✅ Extra fallback some backends expose
        if (!cocData && collectorId) {
          try {
            const altUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorformbyjob/${id}?collectorId=${collectorId}`;
            console.log('🔎 Trying alternative endpoint:', altUrl);
            const resp3 = await fetch(altUrl);
            if (resp3.ok) {
              const data3 = await resp3.json();
              const maybe = data3?.data || data3 || null;
              if (maybe) {
                cocData = Array.isArray(maybe) ? maybe[0] : maybe;
              }
            }
          } catch (e) {
            console.warn('Alternative endpoint fetch failed', e);
          }
        }

        // ✅ POPULATE FORM WITH EXISTING DATA - Only if we have valid data
        if (cocData && typeof cocData === 'object' && !Array.isArray(cocData)) {
          console.log('📦 Setting form data:', cocData);
          setFormData((prevData) => ({
            ...prevData,
            ...cocData,
            companyName: cocData.companyName || cocData.company || prevData.companyName || '',
            flight: cocData.flight || cocData.flightVessel || prevData.flight || '',
            location: cocData.location || prevData.location || '',
            refno: cocData.refno || cocData.cocRefNo || prevData.refno || '',
            dateoftest: cocData.dateoftest ? new Date(cocData.dateoftest).toISOString().slice(0, 16) : (cocData.dateoftestRaw || prevData.dateoftest || ''),
            reasonForTest: (Array.isArray(cocData.reasonForTest) ? cocData.reasonForTest[0] : cocData.reasonForTest) || prevData.reasonForTest || '',
          }));
          console.log('✅ Form populated with existing data for:', userType);
        } else {
          // ✅ NO EXISTING FORM
          console.log('📝 No existing COC form found or invalid data format');
          setError('No COC form has been submitted for this job yet.');
        }
      } else {
        console.log('❌ API returned error');
        setError('Unable to load form data.');
      }

    } catch (error) {
      console.error('💥 Fetch error:', error);
      setError(error.message);
    }
  };

  fetchScreen4Data();


}, [id]);




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

  // ✅ UPDATED: Form submission with collectorId
  // const handleSubmit = async (e) => {
  //   setIsLoading(true)
  //   e.preventDefault();
    
  //   // ✅ ADD: Get collectorId from URL
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const collectorId = urlParams.get('collectorId');
    
  //   const apiUrl = id
  //     ? `${import.meta.env.VITE_API_BASE_URL}/updatescreen4data/${id}`
  //     : `${import.meta.env.VITE_API_BASE_URL}/addscreen4data`;

  //   try {
  //     // ✅ ADD: Include collectorId in form data
  //     const dataToSubmit = {
  //       ...formData,
  //       collectorId: collectorId // Add collector ID
  //     };

  //     const response = await fetch(apiUrl, {
  //       method: id ? "PUT" : "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(dataToSubmit),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       message.success(
  //         id ? "Form updated successfully!" : "Form submitted successfully!"
  //       );
  //     } else {
  //       message.error(result.message || "Failed to process form.");
  //     }

  //     // Reset form if adding new data
  //     if (id) {
  //       setFormData({
  //         donorName: "",
  //         dob: "",
  //         companyName: "",
  //         reasonForTest: "Pre-Employment",
  //         location: "",
  //         sampleDate: "",
  //         adulterationCheck: false,
  //         drugTests: [],
  //         consent: false,
  //       });
  //     }
  //     navigate('/jobrequests')
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     message.error("Submission failed due to server error.");
  //   }
  //   setIsLoading(false)
  // };

 


  // ✅ UPDATED: Form submission - ONLY COLLECTOR CAN SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ✅ GET COLLECTOR ID FROM URL
  const urlParams = new URLSearchParams(window.location.search);
  const collectorId = urlParams.get('collectorId');
  
  // ✅ CHECK IF USER IS COLLECTOR
  if (!collectorId) {
    message.error("Only collectors can submit COC forms. Clients and Admins can only view.");
    return;
  }

  setIsLoading(true);
  
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/updatescreen4data/${id}`;

  try {
    const dataToSubmit = {
      ...formData,
      collectorId: collectorId
    };

    console.log('📤 Submitting form as collector:', collectorId);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    const result = await response.json();

    if (response.ok) {
      message.success("Form saved successfully!");
      navigate('/jobrequests');
    } else {
      message.error(result.message || "Failed to save form.");
    }
  } catch (error) {
    console.error("Error: ", error);
    message.error("Submission failed due to server error.");
  }
  setIsLoading(false);
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
  //   const pdfHeight = pdf.internal.pageSize.getHeight();
  //   const imgHeight = (canvas.height * pdfWidth) / canvas.width; // Height of the image

  //   let yOffset = 0; // Initial Y offset for the first page

  //   // Check if the image height exceeds the page height
  //   if (imgHeight > pdfHeight) {
  //     const numPages = Math.ceil(imgHeight / pdfHeight); // Number of pages needed

  //     for (let i = 0; i < numPages; i++) {
  //       if (i > 0) {
  //         pdf.addPage(); // Add a new page if it's not the first one
  //       }

  //       pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, imgHeight);
  //       yOffset += pdfHeight; // Increment Y offset for the next page
  //     }
  //   } else {
  //     // If content fits in one page
  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
  //   }

  //   pdf.save("ClientDetails.pdf");
  // };



const handleDownloadPDF = async () => {
  // Block downloads on mobile/touch devices or small screens
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || ""
  );
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 992; // treat <992px as non-desktop
  if (isMobileUA || isSmallScreen) {
    try {
      message.warning("COC form download is only available on desktop/laptop.");
    } catch (e) {
      alert("COC form download is only available on desktop/laptop.");
    }
    return;
  }
  const element = document.querySelector(".COCform");

  if (!element) {
    console.error("Form element not found");
    return;
  }

  try {
    // Generate password
    const password = "screen4@2024";

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF with encryption options
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      encryption: {
        userPassword: password,
        ownerPassword: 'Screen4Admin2024',
        userPermissions: ['print', 'copy']
      }
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    
    // Save with encryption
    pdf.save("Secure_ClientDetails.pdf");
    
    // Show password
    alert(`✅ PDF Downloaded Successfully!\n\n📄 File: Secure_ClientDetails.pdf\n🔐 Password: ${password}\n\nUse this password to open the PDF.`);

  } catch (error) {
    console.error("PDF Error:", error);
    alert("❌ Failed to generate PDF. Please try again.");
  }
};

// Determine if current viewer can edit: collectors (with collectorId in URL) can edit; others read-only
const canEdit = Boolean(new URLSearchParams(window.location.search).get('collectorId'));
const isMobileOrSmall = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent || ""
) || (typeof window !== 'undefined' && window.innerWidth < 992);

// ✅ READ-Only fields for Client/Admin
const getFieldProps = (fieldName) => {
  if (!canEdit) {
    return {
      readOnly: true,
      style: { 
        backgroundColor: '#f5f5f5', 
        cursor: 'not-allowed',
        border: '1px solid #d9d9d9'
      }
    };
  }
  return {};
};

// Example usage in form fields:
<input
  className="inputstyle"
  type="text"
  name="donorName"
  value={formData.donorName}
  onChange={handleChange}
  placeholder="Enter Donor's Name"
  required
  {...getFieldProps('donorName')} // ✅ This will make it read-only for client/admin
/>

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
              {/* <span style={{ fontSize: "6px" }}>Check donor identity and record ID source here, e.g. passport (with number) OR supervisor's signature and PRINTED name.</span> */}
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
                  <input
                    className="inputstyle"
                    type="text"
                    name="donorCertificationSignature"
                    value=""
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
            style={{ marginTop: "15px", marginBottom: "20px" }}
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
                  <input
                    className="inputstyle"
                    type="text"
                    name="collectorCertificationSignature"
                    value=""
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
              <div style={{width:"100%",display: "flex",justifyContent:"center"}}><img src="/empty.gif" style={{width:"130px",}}/></div>
            )
          ) : null}

         {!isMobileOrSmall && (
           <button 
  type="button" 
  onClick={handleDownloadPDF}
  style={{
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(40, 167, 69, 0.3)",
    transition: "all 0.3s ease",
    marginBottom: "10px"
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#218838";
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 8px rgba(40, 167, 69, 0.4)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "#28a745";
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 6px rgba(40, 167, 69, 0.3)";
  }}
>
  <span>🔒</span>
  Download Secure PDF
           </button>
         )}

        </form>
      </div>
    </>
  );
}

export default Screen4Details;