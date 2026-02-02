import "./css/profile.css";
import './css/clientDetails.css';
import React, { useState } from "react";
import Navbar from "../components/navbar";
import { message, Tooltip } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import './css/Practitioner.css'
import Cookies from 'js-cookie';

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const defaultFormData = {
  cocRefNo: "",
  donorName: "",
  donorEmail: "",
  gcalicno: "",
  dob: "",
  companyName: "",
  reasonForTest: "",
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
  test1Time: "",
  test2: "",
  test2BaracResult1: "",
  test2BaracResult2: "",
  test2Time: "",
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
};

// Generate next unique COC reference using existing forms
const deriveNextCocRef = (baseRef, forms = []) => {
  const base = baseRef || "COC";
  let maxSuffix = 0;
  forms.forEach((form) => {
    const ref = form?.cocRefNo || form?.refno || "";
    if (typeof ref !== "string") return;
    if (!ref.startsWith(base)) return;
    const tail = ref.slice(base.length);
    const match = tail.match(/^-?(\d+)$/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!Number.isNaN(num)) {
        maxSuffix = Math.max(maxSuffix, num);
      }
    }
  });
  const next = maxSuffix + 1;
  return `${base}-${next}`;
};


function Screen4Details() {
  const navigate = useNavigate();
  const location = useLocation();
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
        width: "60%",
        color: "#000000 !important"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          // width: "400px",
          height: "200px",
          border: "1px solid #ccc",
          cursor: "crosshair",
          width: "100%",
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

    // Format the date as DD/MM/YY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year

    return `${day}/${month}/${year}`;
  }

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  function formatDateForInput(dateInput) {
    if (!dateInput) {
      return "";
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [formData, setFormData] = useState(() => ({ ...defaultFormData }));
  // Track existing COC document id (if any) so we can update the same document
  const [existingCocId, setExistingCocId] = useState(null);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [isNewFormInstance, setIsNewFormInstance] = useState(false);
  const [allCocForms, setAllCocForms] = useState([]); // Store all COC forms for this job/collector
  const [jobStatus, setJobStatus] = useState(null); // Track job status for edit restrictions
  const [jobRequestData, setJobRequestData] = useState(null); // Store job request data for test type checking
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
        const urlParams = new URLSearchParams(location.search);
        const collectorId = urlParams.get('collectorId');
        const formIdParam = urlParams.get('formId');
        const isNewFlag = urlParams.get('newForm') === 'true';

        const token = Cookies.get("Token");
        console.log(token)
        // ✅ DETERMINE USER TYPE
        let userType = null // Default
        if (token == "dskgfsdgfkgsdfkjg35464154845674987dsf@53") {
          userType = 'admin';
        } else if (token == "clientdgf45sdgf89756dfgdhgdf") {
          userType = 'client';
        } else {
          // Check cookies or other methods to distinguish client vs admin
          userType = 'collector'; // For this example, assume collector if not admin

        }

        console.log('🔄 Fetching COC data for:', {
          jobId: id,
          userType: userType,
          collectorId: collectorId
        });

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        let response = await fetch(`${baseUrl}/getcocforms/${id}`);

        if (!response.ok && collectorId) {
          console.log('Primary getcocforms failed, trying collector-specific endpoint');
          response = await fetch(`${baseUrl}/getcollectorcocform/${id}/${collectorId}`);
        }





        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Success:', data);

          const normalizeToArray = (value) => {
            if (!value) return [];
            if (Array.isArray(value)) return value;
            if (typeof value === 'object') return [value];
            return [];
          };

          let cocForms = normalizeToArray(data?.data ?? data);

          // ✅ Fallback to collector-specific fetch if nothing found
          if ((!cocForms || cocForms.length === 0) && collectorId) {
            try {
              const byCollectorUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorcocform/${id}/${collectorId}`;
              console.log('🔎 Trying collector-specific endpoint:', byCollectorUrl);
              const resp2 = await fetch(byCollectorUrl);
              if (resp2.ok) {
                const data2 = await resp2.json();
                cocForms = normalizeToArray(data2?.data ?? data2);
              }
            } catch (e) {
              console.warn('Collector-specific fetch failed', e);
            }
          }

          // ✅ Extra fallback some backends expose
          if ((!cocForms || cocForms.length === 0) && collectorId) {
            try {
              const altUrl = `${import.meta.env.VITE_API_BASE_URL}/getcollectorformbyjob/${id}?collectorId=${collectorId}`;
              console.log('🔎 Trying alternative endpoint:', altUrl);
              const resp3 = await fetch(altUrl);
              if (resp3.ok) {
                const data3 = await resp3.json();
                cocForms = normalizeToArray(data3?.data ?? data3);
              }
            } catch (e) {
              console.warn('Alternative endpoint fetch failed', e);
            }
          }

          const resolvedForms = Array.isArray(cocForms) ? cocForms.filter(Boolean) : [];
          setAllCocForms(resolvedForms); // Store all forms for dropdown/selector
          // ✅ Fetch job request data to auto-populate fields
          let jobRequestData = null;
          try {
            const jobResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getjobrequest/${id}`);
            if (jobResponse.ok) {
              const jobResult = await jobResponse.json();
              if (jobResult.success && jobResult.data) {
                jobRequestData = jobResult.data;
                // Capture job status for permission enforcement
                setJobStatus(jobResult.data?.status || jobResult.data?.jobStatus || null);
                // ✅ Store job request data in state for test type checking
                setJobRequestData(jobResult.data);
              }
            }
          } catch (jobError) {
            console.error("Error fetching job request data:", jobError);
          }

          const baseRefNo = jobRequestData?.jobReferenceNo || id || 'COC';
          const nextCocRef = deriveNextCocRef(baseRefNo, resolvedForms);

          // ✅ AUTO-POPULATE COLLECTOR NAME from job request collector IDs or URL
          let collectorName = '';

          // Try to get collector IDs from job request data first, then fall back to URL parameter
          let collectorIds = [];

          if (jobRequestData && jobRequestData.collectorid) {
            // Use collector IDs from job request data
            collectorIds = Array.isArray(jobRequestData.collectorid)
              ? jobRequestData.collectorid
              : [jobRequestData.collectorid];
            console.log('📋 Using collector IDs from job request data:', collectorIds);
          } else if (collectorId) {
            // Fallback: Use collector ID from URL parameter
            collectorIds = [collectorId];
            console.log('📋 Using collector ID from URL parameter:', collectorIds);
          }

          if (collectorIds.length > 0) {
            try {
              // Fetch collector details for each ID
              const collectorPromises = collectorIds.map(async (id) => {
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getcollector/${id}`);
                  if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Fetched collector data:', data);
                    return data?.name || data?.collectorName || data?.fullName || '';
                  }
                  console.warn(`❌ Failed to fetch collector ${id}: ${response.status}`);
                  return '';
                } catch (error) {
                  console.warn(`❌ Error fetching collector ${id}:`, error);
                  return '';
                }
              });

              const collectorNames = await Promise.all(collectorPromises);
              collectorName = collectorNames.filter(name => name).join(', ');

              console.log('🔍 Collector Name Auto-populated:', collectorName);
            } catch (error) {
              console.error('❌ Could not auto-populate collector name:', error);
            }
          } else {
            console.log('⚠️ No collector ID found in job request data or URL parameters');
          }

          let selectedForm = null;
          if (formIdParam) {
            selectedForm = resolvedForms.find((form) => {
              const candidateId = form?._id || form?.id || form?.formId || form?.documentId;
              return candidateId && String(candidateId) === String(formIdParam);
            });
          }

          if (!selectedForm && !formIdParam && resolvedForms.length > 0) {
            selectedForm = resolvedForms[0];
          }

          if (selectedForm) {
            // Existing COC form - merge with job request data
            setFormData({
              ...defaultFormData,
              ...selectedForm,
              // Always use job request data for these fields (they should match the job request)
              cocRefNo: selectedForm.cocRefNo || jobRequestData?.jobReferenceNo || "",
              location: jobRequestData?.location || selectedForm.location || "",
              companyName: jobRequestData?.companyName || jobRequestData?.customer || jobRequestData?.company || selectedForm.companyName || selectedForm.company || "",
              reasonForTest: jobRequestData?.reasonForTest || selectedForm.reasonForTest || "",
              flight: jobRequestData?.flightVessel || selectedForm.flight || "",
              // ✅ AUTO-POPULATE COLLECTOR NAME if not already set
              collectorName: selectedForm.collectorName || collectorName || "",
            });
            const existingId = selectedForm?._id || selectedForm?.id || selectedForm?.formId || null;
            setExistingCocId(existingId);
            setCurrentFormId(existingId || formIdParam || null);
            setIsNewFormInstance(false);
          } else {
            // New COC form - initialize with job request data
            const initialFormData = { ...defaultFormData };
            if (jobRequestData) {
              initialFormData.cocRefNo = nextCocRef || jobRequestData.jobReferenceNo || "";
              initialFormData.location = jobRequestData.location || "";
              initialFormData.companyName = jobRequestData.companyName || jobRequestData.customer || jobRequestData.company || "";
              initialFormData.reasonForTest = jobRequestData.reasonForTest || "";
              initialFormData.flight = jobRequestData.flightVessel || "";
            }
            // ✅ AUTO-POPULATE COLLECTOR NAME for new forms
            initialFormData.collectorName = collectorName || "";

            if (isNewFlag) {
              setFormData(initialFormData);
              setExistingCocId(null);
              setCurrentFormId(formIdParam || null);
              setIsNewFormInstance(true);
            } else if (resolvedForms.length === 0) {
              setFormData(initialFormData);
              setExistingCocId(null);
              setCurrentFormId(null);
              setIsNewFormInstance(false);
            }
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


  }, [id, location.search]);

  console.log('Form Data:', formData);




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

    const urlParams = new URLSearchParams(location.search);
    const collectorId = urlParams.get('collectorId');
    const jobRequestId = id;

    const tokenNow = Cookies.get('Token');
    const isAdminNow = tokenNow === 'dskgfsdgfkgsdfkjg35464154845674987dsf@53';
    const isCollectorNow = tokenNow === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg';
    const alreadySubmitted = formData?.isUpdated === true;
    const isJobCompletedNow = isJobCompleted;

    // Permission checks:
    // - If already submitted: only admin can update
    if (alreadySubmitted && !isAdminNow) {
      message.error('Only admin can edit/update this COC after submission.');
      return;
    }
    // - If job is completed: only admin may edit
    if (isJobCompletedNow && !isAdminNow) {
      message.error('Job is completed. Only admin can edit/add COC forms.');
      return;
    }
    // - If not submitted yet: collector or admin (with collector context) can submit
    if (!alreadySubmitted) {
      if ((!isCollectorNow || !collectorId) && !isAdminNow) {
        message.error('Only collectors or admins can submit COC forms.');
        return;
      }
    }

    setIsLoading(true);

    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/updatescreen4data/${id}`;

    try {
      const dataToSubmit = {
        ...formData,
        collectorId: collectorId,
        jobRequestId: jobRequestId,
        formId: currentFormId,
        isNewForm: isNewFormInstance,
      };

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

        // ✅ Send email to client after COC form submission
        try {
          const emailResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/sendscreenemailtoclient/${jobRequestId}`,
            {
              method: "POST",
            }
          );

          const emailResult = await emailResponse.json().catch(() => ({}));

          if (emailResponse.ok) {
            if (emailResult?.emailStatus) {
              message.info(emailResult.emailStatus);
            } else {
              message.info("Client email queued.");
            }
          } else {
            console.warn("Email to client failed:", emailResult?.message || "Unknown error");
            message.warning("COC form saved, but client email failed. Please retry.");
          }
        } catch (emailErr) {
          console.error("Error sending email to client:", emailErr);
          message.warning("COC form saved, but client email failed. Please retry.");
        }

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

  // Determine user role from token
  const token = Cookies.get("Token");
  const isAdminUser = token === 'dskgfsdgfkgsdfkjg35464154845674987dsf@53';
  const isCollectorUser = token === 'collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg';
  const urlParamsRO = new URLSearchParams(location.search);
  const collectorIdQuery = urlParamsRO.get('collectorId');
  const isJobCompleted = (() => {
    if (!jobStatus) return false;
    const normalized = String(jobStatus).toLowerCase();
    return ["completed", "complete", "done", "closed", "finished"].some((flag) => normalized.includes(flag));
  })();
  // Breath-only flow: skip requiring adulteration/drug-test fields
  // Check if the job request specified "Breath Alcohol" as the test type
  const isBreathOnly = jobRequestData?.TypeOfTest === "Breath Alcohol";

  // Editing rules:
  // - Before first submission (isUpdated !== true): collector (with collectorId in URL) can edit
  // - After submission (isUpdated === true): ONLY admin can edit
  // - Collector can ALWAYS add new COC forms (even if previous ones are submitted)
  const isSubmitted = formData?.isUpdated === true;
  const canEdit = isAdminUser || (!isSubmitted && Boolean(collectorIdQuery) && isCollectorUser && !isJobCompleted);
  const canAddNewForm = isAdminUser || (isCollectorUser && Boolean(collectorIdQuery) && !isJobCompleted); // Collector blocked if job completed
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
            position: 'relative'
          }}
        >
          {!canEdit && !canAddNewForm && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'transparent',
                pointerEvents: 'auto',
                zIndex: 5,
              }}
            />
          )}
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

          {/* COC Form Selector and Add New Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
            flexWrap: 'wrap',
            gap: '10px',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Select COC Form:
              </label>
              <select
                value={currentFormId || (allCocForms.length > 0 && allCocForms[0] ? (allCocForms[0]?._id || allCocForms[0]?.id || '') : '')}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (selectedId === 'new') {
                    const urlParams = new URLSearchParams(location.search);
                    const collectorId = urlParams.get('collectorId');
                    const newFormId = `new-${Date.now()}`;
                    navigate(`/coc-form/${id}?collectorId=${collectorId}&formId=${newFormId}&newForm=true`);
                  } else if (selectedId) {
                    const urlParams = new URLSearchParams(location.search);
                    const collectorId = urlParams.get('collectorId');
                    navigate(`/coc-form/${id}?collectorId=${collectorId}&formId=${selectedId}`);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
              >
                {allCocForms.length === 0 && (
                  <option value="">No COC forms found - Click 'Add Another COC Form' to create</option>
                )}
                {allCocForms.map((form, idx) => {
                  const formId = form?._id || form?.id || form?.formId || `form-${idx}`;
                  const formLabel = form?.donorName
                    ? `COC Form - ${form.donorName}`
                    : `COC Form ${idx + 1}`;
                  return (
                    <option key={formId} value={formId}>
                      {formLabel}
                    </option>
                  );
                })}
                <option value="new" style={{ fontWeight: 'bold', color: '#80c209' }}>
                  + Add New COC Form
                </option>
              </select>
            </div>
            {canAddNewForm && (
              <button
                type="button"
                onClick={() => {
                  const urlParams = new URLSearchParams(location.search);
                  const collectorId = urlParams.get('collectorId');
                  const newFormId = `new-${Date.now()}`;
                  navigate(`/coc-form/${id}?collectorId=${collectorId}&formId=${newFormId}&newForm=true`);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#80c209',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  marginTop: '28px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 15
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#6fa008';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#80c209';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                + Add Another COC Form
              </button>
            )}
          </div>

          {/* Read-only notice when form is locked for non-admin users */}
          {!canEdit && (
            <div style={{ margin: '10px 0 20px', padding: '12px 14px', background: '#fffbe6', border: '1px solid #ffe58f', color: '#ad6800', borderRadius: '6px' }}>
              This COC form is locked. Only admins can edit it. Collectors or clients can add and fill a new COC form, but they cannot update this existing form..
            </div>
          )}

          <fieldset disabled={!canEdit} style={{ border: 'none', padding: 0, margin: 0, opacity: !canEdit ? 0.65 : 1 }}>

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
                  value={formatDateForInput(formData.dob)}
                  onChange={handleChange}
                  // style={{ width: "99%" }}
                  required
                />
                {formData.dob && (
                  <div style={{ fontSize: "10px", marginTop: "4px", color: "#555" }}>DD/MM/YY: {formatDate(formData.dob)}</div>
                )}
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
                    readOnly
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
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
                        disabled
                        style={{ cursor: "not-allowed" }}
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
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexDirection: formData.barcodeImage && "column" }}>
                    {!formData.barcodeImage && <input
                      className="inputstyle"
                      type="text"
                      name="barcodeno"
                      value={formData.barcodeno}
                      onChange={handleChange}
                    />}
                    {formData.barcodeImage && (
                      <img src={formData.barcodeImage} alt="barcode" style={{ marginTop: "6px", maxWidth: "120px" }} />
                    )}
                    <label className="createjob2" style={{ padding: "6px 10px", cursor: "pointer", borderRadius: "10px", backgroundColor: "#80c209", fontSize: "10px", textAlign: "center" }}>
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
                    readOnly
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
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
                    value={formatDateForInput(formData.dateoftest)}
                    onChange={handleChange}
                    required
                  />
                  {formData.dateoftest && (
                    <div style={{ fontSize: "10px", marginTop: "4px", color: "#555" }}>DD/MM/YY: {formatDate(formData.dateoftest)}</div>
                  )}

                </div>
              </div>
            </div>
            <hr />
            <div className="alcohol-test-flex-container">
              {/* Left Side: Declaration */}
              <div className="alcohol-test-left">
                <div className="declaration-container">
                  <h5 className="declaration-title">RESIDUAL MOUTH ALCOHOL DECLARATION</h5>
                  <p className="declaration-text">
                    Have you in the last 20 minutes smoked and/or consumed an
                    alcoholic drink or used a product containing alcohol such as
                    mouthwash?
                  </p>

                  <div className="yes-no-group">
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="alcohoDeclaration"
                        value="Yes"
                        checked={formData.alcohoDeclaration === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="alcohoDeclaration"
                        value="No"
                        checked={formData.alcohoDeclaration === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>

                  <p className="declaration-text" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                    I understand that any of the above may artificially increase the
                    result of the breath test that I am about to take.
                  </p>

                  <div className="declaration-footer">
                    <div className="input-block">
                      <label>Donor's Signature</label>
                      <div
                        className="signature-input-box"
                        onClick={() => { openSignaturePad(); setIsDonorOpen(true) }}
                        style={{
                          backgroundImage: `url(${formData.donorSignature})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          height: "60px"
                        }}
                      >
                        {!formData.donorSignature && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                      </div>
                      {isError && isError === 'donorSignature' && (
                        <p style={{ color: "red", fontSize: "11px", marginTop: "4px" }}>
                          Please provide donor signature
                        </p>
                      )}
                    </div>

                    <div className="input-block">
                      <label>Date</label>
                      <input
                        className="premium-input"
                        type="date"
                        name="donorDate"
                        value={formatDateForInput(formData.donorDate)}
                        onChange={handleChange}
                        required
                      />
                      {formData.donorDate && (
                        <div style={{ fontSize: "10px", marginTop: "4px", color: "#888" }}>Formatted: {formatDate(formData.donorDate)}</div>
                      )}
                    </div>
                  </div>
                </div>
                {isSignaturePadOpen && donorOpen && (
                  pad("donorSignature")
                )}
              </div>

              {/* Right Side: Results */}
              <div className="alcohol-test-right">
                <div className="alcohol-test-container" style={{ height: '100%', marginTop: '0' }}>
                  <h5 className="alcohol-test-title">
                    I certify that I have conducted Breath Alcohol testing on the
                    above named individual, the results of which are recorded below:
                  </h5>

                  <div className="alcohol-results-grid">
                    {/* Test 1 Row */}
                    <div className="alcohol-test-row">
                      <div className="test-label">Test 1.</div>
                      <div className="input-block">
                        <label>Local Time</label>
                        <input
                          className="premium-input"
                          type="time"
                          name="test1Time"
                          value={formData.test1Time}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-block">
                        <label>BrAC Result</label>
                        <input
                          className="premium-input"
                          type="text"
                          name="test1BaracResult1"
                          value={formData.test1BaracResult1}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="input-block">
                        <label>BAC Result</label>
                        <input
                          className="premium-input"
                          type="text"
                          name="test2BaracResult2" // Keeping original name to maintain compatibility
                          value={formData.test2BaracResult2}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    {/* Test 2 Row */}
                    <div className="alcohol-test-row">
                      <div className="test-label">Test 2.</div>
                      <div className="input-block">
                        <label>Local Time</label>
                        <input
                          className="premium-input"
                          type="time"
                          name="test2Time"
                          value={formData.test2Time}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-block">
                        <label>BrAC Result</label>
                        <input
                          className="premium-input"
                          type="text"
                          name="test2BaracResult1"
                          value={formData.test2BaracResult1}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="input-block">
                        <label>BAC Result</label>
                        <input
                          className="premium-input"
                          type="text"
                          name="test2BaracResult2"
                          value={formData.test2BaracResult2}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="collector-info-row" style={{ gridTemplateColumns: '1fr 1fr', padding: '15px' }}>
                    <div className="input-block">
                      <label>Collector Name</label>
                      <input
                        className="premium-input"
                        type="text"
                        name="collectorName"
                        value={formData.collectorName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input-block">
                      <label>Remarks</label>
                      <input
                        className="premium-input"
                        type="text"
                        name="collectorRemarks"
                        value={formData.collectorRemarks}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="input-block">
                      <label>Collector Signature</label>
                      <div
                        className="signature-input-box"
                        onClick={() => { openSignaturePad(); setIsCollectorOpen(true) }}
                        style={{
                          backgroundImage: `url(${formData.collectorSignature})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      >
                        {!formData.collectorSignature && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                      </div>
                    </div>
                    <div className="input-block">
                      <label>Date</label>
                      <input
                        className="premium-input"
                        type="date"
                        name="collectorDate"
                        value={formatDateForInput(formData.collectorDate)}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {isSignaturePadOpen && collectorOpen && (
                    pad("collectorSignature")
                  )}
                </div>
              </div>
            </div>
            <div className="premium-card">
              <div className="declaration-title">DONOR CONSENT TO TEST AND SPECIFIC DECLARATION</div>
              <p className="declaration-text">
                I hereby consent to providing a sample of breath, saliva, urine
                hair or blood to the collector and if required for it to be
                screened in my presence, if necessary, and if required by my
                employer / potential future employer, for the analysis to be
                performed at an off site laboratory. I also consent to the results
                of the analysis being communicated in writing to my employer /
                potential future employer and for them to use this information for
                any purpose connected to my employment / application for
                employment
                <span style={{ display: 'block', marginTop: '10px', fontWeight: 'bold' }}>
                  I declare that I have read and understood the Donor Information Sheet relating to the test.
                </span>
              </p>

              <div className="consent-footer">
                <div className="input-block">
                  <label>Donor Consent Signature</label>
                  <div
                    className="signature-input-box"
                    onClick={() => { openSignaturePad(); setisconcentOpen(true) }}
                    style={{
                      backgroundImage: `url(${formData.donorConcent})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    {!formData.donorConcent && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                  </div>
                  {isError && isError === 'donorConcent' && (
                    <p style={{ color: "red", fontSize: "11px", marginTop: "4px" }}>
                      Please fill donor signature
                    </p>
                  )}
                </div>
              </div>
              {isSignaturePadOpen && ConcentOpen && (
                pad("donorConcent")
              )}
            </div>

            <div className="premium-card">
              <p className="declaration-text" style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                I am satisfied that the test has been completed in line with stated process.
              </p>
              <div className="consent-footer">
                <div className="input-block">
                  <label>Donor Declaration</label>
                  <div
                    className="signature-input-box"
                    onClick={() => { openSignaturePad(); setIsdeclarationopen(true) }}
                    style={{
                      backgroundImage: `url(${formData.donorDeclaration})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    {!formData.donorDeclaration && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                  </div>
                  {isError && isError === 'donorDeclaration' && (
                    <p style={{ color: "red", fontSize: "11px", marginTop: "4px" }}>
                      Please fill donor signature
                    </p>
                  )}
                </div>
                {isSignaturePadOpen && declarationOpen && (
                  pad("donorDeclaration")
                )}

                <div className="input-block">
                  <label>Date</label>
                  <input
                    className="premium-input"
                    type="date"
                    name="donorConcentDate"
                    value={formatDateForInput(formData.donorConcentDate)}
                    onChange={handleChange}
                    required
                  />
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
            {/* ✅ Only show Adulteration Check section if NOT breath-only test */}
            {!isBreathOnly && (
              <div className="premium-card" style={{ marginTop: '20px' }}>
                <div className="declaration-title">Adulteration Check</div>
                <div className="adulteration-grid">
                  <div className="input-block">
                    <label>Collection Time</label>
                    <input
                      className="premium-input"
                      type="time"
                      name="collectionTime"
                      value={formData.collectionTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-block">
                    <label>Result Read Time</label>
                    <input
                      className="premium-input"
                      type="time"
                      name="resultReadTime"
                      value={formData.resultReadTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-block">
                    <label>Lot No.</label>
                    <input
                      className="premium-input"
                      type="text"
                      name="lotno"
                      value={formData.lotno}
                      placeholder="Enter Lot No."
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-block">
                    <label>Exp Date</label>
                    <input
                      className="premium-input"
                      type="date"
                      name="expDate"
                      value={formatDateForInput(formData.expDate)}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="adulteration-footer-grid">
                  <div className="input-block">
                    <label>Temperature 32 - 38˚</label>
                    <div className="yes-no-group" style={{ padding: '10px' }}>
                      <label className="yes-no-label">
                        <input
                          type="radio"
                          name="temperature"
                          value="Yes"
                          checked={formData.temperature === 'Yes'}
                          onChange={handleChange}
                          required
                        />
                        Yes
                      </label>
                      <label className="yes-no-label">
                        <input
                          type="radio"
                          name="temperature"
                          value="No"
                          checked={formData.temperature === 'No'}
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div className="input-block">
                    <label>Adulteration Test Passed</label>
                    <div className="yes-no-group" style={{ padding: '10px' }}>
                      <label className="yes-no-label">
                        <input
                          type="radio"
                          name="adulterationTestPassed"
                          value="Yes"
                          checked={formData.adulterationTestPassed === 'Yes'}
                          onChange={handleChange}
                          required
                        />
                        Yes
                      </label>
                      <label className="yes-no-label">
                        <input
                          type="radio"
                          name="adulterationTestPassed"
                          value="No"
                          checked={formData.adulterationTestPassed === 'No'}
                          onChange={handleChange}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="input-block" style={{ marginTop: '15px' }}>
                  <label>Remarks / Drug Test Result</label>
                  <input
                    className="premium-input"
                    type="text"
                    name="adulterationRemarks"
                    value={formData.adulterationRemarks}
                    placeholder="Enter remarks or drug test results"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
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
            <div className="premium-card">
              <div className="declaration-title">DONOR CONSENT TO TEST AND SPECIFIC DECLARATION</div>
              <p className="declaration-text">
                I certify that the specimens accompanying this form are my own
                and were provided by me to the collector. The specimens were
                split and sealed with tamper-proof seals in my presence and the
                information provided on this form and on the labels is correct.
                I consent to the specimens being submitted to a laboratory for
                testing. I understand the results of the test will only be made
                available to the organisation requesting the test or their
                authorised representatives.
                <span style={{ display: 'block', marginTop: '10px', fontWeight: 'bold' }}>
                  I am satisfied that the test has been completed in line with stated process.
                </span>
              </p>

              <div className="consent-footer">
                <div className="input-block">
                  <label>Donor Name</label>
                  <input
                    className="premium-input"
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    placeholder="Enter Donor's Name"
                    required
                  />
                </div>
                <div className="input-block">
                  <label>Donor Signature</label>
                  <div
                    className="signature-input-box"
                    onClick={() => { openSignaturePad(); setIsDonorConcentOpen(true) }}
                    style={{
                      backgroundImage: `url(${formData.donorCertificationSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    {!formData.donorCertificationSignature && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                  </div>
                </div>
                <div className="input-block">
                  <label>Date</label>
                  <input
                    className="premium-input"
                    type="date"
                    name="donorCertificationDate"
                    value={formatDateForInput(formData.donorCertificationDate)}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {isSignaturePadOpen && donorConcentOpen && (
                pad("donorCertificationSignature")
              )}
            </div>

            <div className="premium-card">
              <div className="declaration-title">Collector Certification</div>
              <p className="declaration-text">
                I certify that the specimen identified on this form is that
                provided to me by the donor providing the certification above,
                that it bears the identification as set forth above and that it
                has been collected in accordance with the instructions provided.
              </p>

              <div className="consent-footer">
                <div className="input-block">
                  <label>Collector Name</label>
                  <input
                    className="premium-input"
                    type="text"
                    name="collectorCertificationName"
                    value={formData.collectorCertificationName}
                    placeholder="Enter Collector's Name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-block">
                  <label>Collector Signature</label>
                  <div
                    className="signature-input-box"
                    onClick={() => { openSignaturePad(); setIsCollectorCerificationOpen(true) }}
                    style={{
                      backgroundImage: `url(${formData.collectorCertificationSignature})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    {!formData.collectorCertificationSignature && <span style={{ fontSize: '12px', color: '#999' }}>Click to Sign</span>}
                  </div>
                </div>
                <div className="input-block">
                  <label>Date</label>
                  <input
                    className="premium-input"
                    type="date"
                    name="collectorCertificationDate"
                    value={formatDateForInput(formData.collectorCertificationDate)}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {isSignaturePadOpen && collectorCertificationOpen && (
                pad("collectorCertificationSignature")
              )}
            </div>
            <div className="premium-card">
              <div className="declaration-title">Laboratory & Specimen Details</div>
              <div className="adulteration-footer-grid">
                <div className="input-block">
                  <label>Received at Laboratory Initials</label>
                  <input
                    className="premium-input"
                    type="text"
                    name="recieveInitial"
                    value={formData.recieveInitial}
                    onChange={handleChange}
                    placeholder="Initials"
                  />
                </div>
                <div className="input-block">
                  <label>Received Name</label>
                  <input
                    className="premium-input"
                    type="text"
                    name="recieveName"
                    value={formData.recieveName}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                </div>
                <div className="input-block">
                  <label>Received Date</label>
                  <input
                    className="premium-input"
                    type="date"
                    name="recieveDate"
                    value={formatDateForInput(formData.recieveDate)}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="adulteration-footer-grid" style={{ marginTop: '20px' }}>
                <div className="input-block">
                  <label>Specimen bottle seals intact</label>
                  <div className="yes-no-group" style={{ padding: '10px' }}>
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="specimenBottle"
                        value="Yes"
                        checked={formData.specimenBottle === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="specimenBottle"
                        value="No"
                        checked={formData.specimenBottle === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                    <span
                      style={{ marginLeft: '10px', fontSize: '12px', color: '#80c209', cursor: 'pointer' }}
                      onClick={() => handleAddComment("specimenBottleComment")}
                    >
                      {formData.specimenBottleComment ? "(Update Comment)" : "(Add Comment)"}
                    </span>
                  </div>
                  {formData.specimenBottleComment && (
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Comment: {formData.specimenBottleComment}</p>
                  )}
                </div>

                <div className="input-block">
                  <label>Fatal Flaw</label>
                  <div className="yes-no-group" style={{ padding: '10px' }}>
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="fatalFlaws"
                        value="Yes"
                        checked={formData.fatalFlaws === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="yes-no-label">
                      <input
                        type="radio"
                        name="fatalFlaws"
                        value="No"
                        checked={formData.fatalFlaws === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                    <span
                      style={{ marginLeft: '10px', fontSize: '12px', color: '#80c209', cursor: 'pointer' }}
                      onClick={() => handleAddComment("fatalFlawsComment")}
                    >
                      {formData.fatalFlawsComment ? "(Update Comment)" : "(Add Comment)"}
                    </span>
                  </div>
                  {formData.fatalFlawsComment && (
                    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Comment: {formData.fatalFlawsComment}</p>
                  )}
                </div>
              </div>
            </div>

          </fieldset >

          {/* Submit Button */}
          {
            canEdit && (
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
                  {isSubmitted && isAdminUser ? 'Update (Admin)' : 'Update'}
                </button>
              ) : (
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><img src="/empty.gif" style={{ width: "130px", }} /></div>
              )
            )
          }

          {
            !isMobileOrSmall && (
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
            )
          }

        </form >
      </div >
    </>
  );
}

export default Screen4Details;