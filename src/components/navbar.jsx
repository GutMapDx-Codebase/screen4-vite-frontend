import React, { useEffect, useState } from "react";
import "./css/component.css";
import { GiExitDoor } from "react-icons/gi";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
// import { AiOutlineDashboard } from "react-icons/ai"; // For general dashboard
import { FaUserTie, FaUsers } from "react-icons/fa"; // For Collectors & Clients
// import { HiOutlineUsers } from "react-icons/hi";
import { IoNotificationsSharp } from "react-icons/io5";
import Cookies from "js-cookie";
import {
  MdMedicalInformation,
  MdOutlineAnalytics,
  MdOutlineAppRegistration,
  MdOutlineQueryStats,
  MdOutlineSpaceDashboard,
  MdOutlineWeb,
} from "react-icons/md";
import { FaBowlFood, FaClipboardQuestion, FaKitMedical } from "react-icons/fa6";
import { HiOutlineBriefcase, HiOutlineUser, HiOutlineUsers, HiUserGroup } from "react-icons/hi2";
import { HiOutlineDatabase, HiOutlineDocumentReport } from "react-icons/hi";
import { CgProfile, CgReorder } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

import { GiDna1, GiLiver } from "react-icons/gi";
import { FcBiomass } from "react-icons/fc";
import { FaMicroscope, FaShippingFast } from "react-icons/fa";
import { BiHelpCircle } from "react-icons/bi";
import { IoTicketSharp } from "react-icons/io5";
import { BsCalendar2EventFill } from "react-icons/bs";
import { Avatar, Badge, message, Space } from "antd";
import { AiOutlineForm } from "react-icons/ai";
import { AiOutlineDatabase } from "react-icons/ai";
import { AiOutlineFileText } from "react-icons/ai";
import { AiOutlineDashboard } from "react-icons/ai";

function Navbar() {
  const loginemail = Cookies.get("email");
  const loginname = Cookies.get("Name");
  const id = Cookies.get("id");
  const token = Cookies.get("Token");
  const navigate = useNavigate();

  const logout = () => {
    const allCookies = Cookies.get();
    for (const cookieName in allCookies) {
      Cookies.remove(cookieName);
    }
    navigate("/");
  };

  const [manukonssa, setmanukonssa] = useState("0");

  const [manuuu, setmanu] = useState(false);
  const [manuuunoti, setmanuuunoti] = useState(false);
  const [notification, setnotification] = useState([]);


 
  return (
    <>
      <div className="navbar">
        <div className="navlogo">
          <img
            alt=""
            src="/Screen4.png"
            width={"160px"}
            className="hovar"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        {(token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" ||
          token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg" || token==="clientdgf45sdgf@89756dfgdhg&%df") && (
          <>
            <div className="navmanu" style={{ display: "flex", gap: "20px" }}>
              <h5
                onClick={() => navigate("/dashboard")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4d4b4b",
                  fontWeight:"bold",
                  gap:"5px"
                }}
              >
                <AiOutlineDashboard style={{ width: "35px", height: "35px" }} />
                Dashboard
              </h5>
              {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<><h5
                onClick={() => navigate("/clients")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                 <HiOutlineUsers style={{ width: "35px", height: "35px", color: "4d4b4b" }} />
                Clients
              </h5></>}
              {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<><h5
                onClick={() => navigate("/clients/overview")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                 <HiOutlineUsers style={{ width: "35px", height: "35px", color: "#4d4b4b" }} />
                Client Hub
              </h5></>}
              {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<>
                <div className="hovar">
              <h5
                onClick={() => navigate("/collectors")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                <HiOutlineBriefcase style={{ width: "35px", height: "35px", color: "#4d4b4b" }} />
                Collectors
              </h5>
                </div>
              </>}
              {/* {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&<> */}
              <h5
                onClick={() => navigate("/jobrequests")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                }}
              >
                <AiOutlineFileText style={{ width: "35px", height: "35px" }} />
                Job Requests
              </h5>
           
         
              <h5
                onClick={logout}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4d4b4b",
                }}
              >
                {" "}
                <GiExitDoor style={{ width: "35px", height: "35px" }} /> LOGOUT
              </h5>
    
            </div>
          </>
        )}
        <div className="navmanumob">
         

          {(token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" ||
            token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg" || token === 'clientdgf45sdgf@89756dfgdhg&%df') && (
            <>
              {manuuu === false && (
                <>
                  {" "}
                  <h5
                    onClick={() => setmanu(true)}
                    className="hovar"
                    style={{
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8bc34a",
                    }}
                  >
                    {" "}
                    <FaBars style={{ width: "30px", height: "30px" }} />{" "}
                  </h5>
                </>
              )}
              {manuuu === true && (
                <>
                  {" "}
                  <h5
                    onClick={() => setmanu(false)}
                    className="hovar"
                    style={{
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8bc34a",
                    }}
                  >
                    {" "}
                    <ImCross style={{ width: "30px", height: "30px" }} />{" "}
                  </h5>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {manuuu === true && (
        <>
          {" "}
          <div className="mobmanubg" onClick={() => setmanu(false)}>
            {" "}
          </div>
          <div className="mobmanu">
            {/* <h3 onClick={() => navigate("/dashboard")} >
              <MdOutlineSpaceDashboard
                style={{ width: "30px", height: "30px",color:"#4d4b4b" }}
              />{" "}
              Dashboard
            </h3> */}
            <h5
                onClick={() => navigate("/dashboard")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"6px"
                }}
              >
                {/* <FaUsers style={{ width: "30px", height: "35px", color: "#80c209",marginRight:"10px" }} /> */}
                {/* <FaUsers style={{ width: "35px", height: "35px", color: "black" }} /> */}
                <MdOutlineSpaceDashboard
                style={{ width: "30px", height: "30px",color:"#4d4b4b" }}
              />{" "}

Dashboard
              </h5>
            
            {/* <h3 onClick={() => setmanukonssa("1")}>
              {" "}
              <FaBowlFood style={{ width: "30px", height: "30px" }} /> Food
              Sensitivtiy{" "}
            </h3> */}
            {manukonssa === "1" && (
              <>
                {" "}
                <ul>
                  <li onClick={() => navigate("/dashboard/fs/kit")}>
                    <FaKitMedical style={{ width: "20px", height: "20px" }} />
                    Kit{" "}
                  </li>
                  {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                    <>
                      {" "}
                      <li
                        onClick={() => navigate("/dashboard/fs/practitioner")}
                      >
                        <HiUserGroup
                          style={{ width: "20px", height: "20px" }}
                        />
                        Practitioners{" "}
                      </li>
                    </>
                  )}
                  <li onClick={() => navigate("/dashboard/fs/report")}>
                    <HiOutlineDocumentReport
                      style={{ width: "20px", height: "20px" }}
                    />
                    Reports{" "}
                  </li>
                </ul>
              </>
            )}
            {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
              <>
                {/* <h3 onClick={() => setmanukonssa("2")}><GiLiver style={{ width: '30px', height: '30px' }} />  Microbiome           </h3> */}
                {manukonssa === "2" && (
                  <>
                    {" "}
                    <ul>
                      <li onClick={() => navigate("/dashboard/micro/kit")}>
                        <FaKitMedical
                          style={{ width: "20px", height: "20px" }}
                        />
                        Kit{" "}
                      </li>
                      {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                        <>
                          {" "}
                          <li
                            onClick={() =>
                              navigate("/dashboard/micro/practitioner")
                            }
                          >
                            <HiUserGroup
                              style={{ width: "20px", height: "20px" }}
                            />
                            Practitioners{" "}
                          </li>
                        </>
                      )}
                      {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                        <>
                          {" "}
                          <li
                            onClick={() =>
                              navigate("/dashboard/kitregistration")
                            }
                          >
                            <MdOutlineAppRegistration
                              style={{ width: "20px", height: "20px" }}
                            />
                            White Label KIT Registration{" "}
                          </li>
                        </>
                      )}
                    </ul>
                  </>
                )}{" "}
              </>
            )}

            {/* <h3 onClick={() => setmanukonssa("3")}>  <GiDna1 style={{ width: '30px', height: '30px' }} />DNAMap      </h3> */}
            {manukonssa === "3" && (
              <>
                {" "}
                <ul>
                  <li onClick={() => navigate("/dashboard/dna/kit")}>
                    <FaKitMedical style={{ width: "20px", height: "20px" }} />
                    Kit{" "}
                  </li>
                  {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                    <>
                      {" "}
                      <li
                        onClick={() => navigate("/dashboard/dna/practitioner")}
                      >
                        <HiUserGroup
                          style={{ width: "20px", height: "20px" }}
                        />
                        Practitioners{" "}
                      </li>
                    </>
                  )}
                  <li onClick={() => navigate("/dashboard/dna/report")}>
                    <HiOutlineDocumentReport
                      style={{ width: "20px", height: "20px" }}
                    />
                    Reports{" "}
                  </li>
                </ul>
              </>
            )}

            {/* <h3 onClick={() => setmanukonssa("4")}>  <FaMicroscope style={{ width: '30px', height: '30px' }} />Parasitology Test      </h3> */}
            {manukonssa === "4" && (
              <>
                {" "}
                <ul>
                  <li onClick={() => navigate("/dashboard/Parasitology/kit")}>
                    <FaKitMedical style={{ width: "20px", height: "20px" }} />
                    Kit{" "}
                  </li>
                  {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && (
                    <>
                      {" "}
                      <li
                        onClick={() =>
                          navigate("/dashboard/Parasitology/practitioner")
                        }
                      >
                        <HiUserGroup
                          style={{ width: "20px", height: "20px" }}
                        />
                        Practitioners{" "}
                      </li>
                    </>
                  )}
                  <li
                    onClick={() => navigate("/dashboard/Parasitology/report")}
                  >
                    <HiOutlineDocumentReport
                      style={{ width: "20px", height: "20px" }}
                    />
                    Reports{" "}
                  </li>
                </ul>
              </>
            )}

            {/* <h3 onClick={() => navigate("/dashboard/kit")}><MdMedicalInformation style={{ width: '30px', height: '30px' }} />All Kits</h3> */}
            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>   <h3 onClick={() => navigate("/dashboard/analysis")}><MdOutlineAnalytics style={{ width: '30px', height: '30px' }} />Kits Analysis</h3></>} */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>   <h3 onClick={() => navigate("/dashboard/practitioner")}><HiOutlineUsers style={{ width: '30px', height: '30px' }} />All Practitioners</h3></>} */}
            {/* <h3 onClick={() => navigate("/dashboard/practitionerstates")}><MdOutlineQueryStats style={{ width: '30px', height: '30px' }} />Practitioners States</h3> */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>   <h3 onClick={() => navigate("/dashboard/orders")}><CgReorder style={{ width: '30px', height: '30px' }} />Orders information</h3></>} */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>    <h3 onClick={() => navigate("/dashboard/shippingdata")}><FaShippingFast style={{ width: '30px', height: '30px' }} />Shipping</h3></>} */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>    <h3 onClick={() => navigate("/dashboard/eventinfogdata")}><BsCalendar2EventFill style={{ width: '30px', height: '30px' }} />Event Info</h3></>} */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>    <h3 onClick={() => navigate("/dashboard/webinar")}><MdOutlineWeb style={{ width: '30px', height: '30px' }} />Webinar</h3></>} */}

            {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" && <>
                        <h3 onClick={() => setmanukonssa("5")}>  <BiHelpCircle style={{ width: '30px', height: '30px' }} />Help Center      </h3>
                        {manukonssa === "5" && <>     <ul>
                            <li onClick={() => navigate("/dashboard/tickets")}><IoTicketSharp style={{ width: '20px', height: '20px' }} />Help Center Tickets </li>

                            <li onClick={() => navigate("/dashboard/helpcenter")}><FaClipboardQuestion style={{ width: '20px', height: '20px' }} />Help Center FAQs </li>
                        </ul>
                        </>}
                    </>} */}
            {/* <h3 onClick={() => navigate("/dashboard/profile")}>
              <CgProfile style={{ width: "30px", height: "30px" }} />
              Profile
            </h3> */}

            {/* <h5 onClick={() => { navigate("/kitack") }} className='hovar link' style={{ margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'left', color: '#4180b7' }} >  Kit Received</h5>
                    <h5 onClick={() => { navigate("/shipping") }} className='hovar link' style={{ margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'left', color: '#4180b7' }} >   Shipping Form</h5>
                    <h5 onClick={() => { navigate("/eventinfo") }} className='hovar link' style={{ margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'left', color: '#4180b7' }} >   Event Info Form</h5>

                    <h5 onClick={() => { navigate("/bucket") }} className='hovar link' style={{ margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'left', color: '#4180b7' }} >   Bucket</h5> */}



{token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<><h5
                onClick={() => navigate("/clients")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                {/* <FaUsers style={{ width: "30px", height: "35px", color: "#80c209",marginRight:"10px" }} /> */}
                {/* <FaUsers style={{ width: "35px", height: "35px", color: "black" }} /> */}
                <HiOutlineUsers style={{ width: "35px", height: "35px", color: "black" }} />

                Clients
              </h5></>}
              {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<><h5
                onClick={() => navigate("/clients/overview")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                <CgProfile style={{ width: "35px", height: "35px", color: "#4180B7" }} />
                Client Hub
              </h5></>}
              {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&token!=="collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg"&&<><h5
                onClick={() => navigate("/collectors")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"5px"
                }}
              >
                <HiOutlineBriefcase style={{ width: "35px", height: "35px", color: "black" }} />
                Collectors
              </h5></>}
              {/* {token!=="clientdgf45sdgf@89756dfgdhg&%df"&&<> */}
              <h5
                onClick={() => navigate("/jobrequests")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"3px"
                }}
              >
                <AiOutlineFileText style={{ width: "35px", height: "35px" }} />
                Job Requests
              </h5>
              {/* </>} */}
              {/* {token==="dskgfsdgfkgsdfkjg35464154845674987dsf@53"&&<><h5
                onClick={() => navigate("/data")}
                className="hovar"
                style={{
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "center",
                  color: "#4d4b4b",
                  gap:"2px"
                }}
              >
                <AiOutlineDatabase style={{ width: "35px", height: "35px" }} />
                Data
              </h5></>} */}
              {/* {token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" ? (
                <h5
                  onClick={() => navigate("/screen4testform")}
                  className="hovar"
                  style={{
                    margin: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4d4b4b",
                  }}
                >
                  <AiOutlineForm style={{ width: "35px", height: "35px" }} />
                  Form Link
                </h5>
              ) : null} */}

            <h5
              onClick={logout}
              className="hovar"
              style={{
                margin: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                color: "#4d4b4b",
              }}
            >
              {" "}
              <GiExitDoor style={{ width: "40px", height: "50px",color:"#4d4b4b" }} /> LOGOUT
            </h5>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
