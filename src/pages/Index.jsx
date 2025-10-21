import React, { useState, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import "./css/index.css";
import { message } from "antd";
import "antd/dist/reset.css"; 
import Cookies from "js-cookie";
import { TiArrowBack } from "react-icons/ti";
import "./css/loginPage.css"; // New CSS file
// import Dashboard from "./clientPortal/Dashboard";
// import Profile from "./clientPortal/Profile";
// import Requests from "./clientPortal/Requests";
// import Reports from "./clientPortal/Reports";
// import ProtectedRoute from "../components/ProtectedRoute";

function Index() {
  const loginemail = Cookies.get("email");
  const loginname = Cookies.get("Name");
  const id = Cookies.get("id");
  const token = Cookies.get("Token");

  let navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [forgetpassword, setforgetpassword] = useState("1");
  const [forgetpasswordemail, setforgetpasswordemail] = useState("");
  const [forgetpasswordotp, setforgetpasswordotp] = useState("");
  const [forgetpasswordnewpassword, setforgetpasswordnewpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const formsub = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/screen4login`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        if (result === "user not found") {
          message.error("Please enter a correct Email Address or Password");
        } else if (result === "Password is incorrect.") {
          message.error("Please enter a Email Address correct Password");
        } else if (result === "Account is disable by Admin") {
          message.error("Account is disable by Admin");
        } else {
          if (result.admin === true) {
            message.success("Logged in successfully");
            Cookies.set("email", result.email, { expires: 7 });
            Cookies.set("id", result._id, { expires: 7 });
            Cookies.set("Name", result.name, { expires: 7 });
            Cookies.set("Token", "dskgfsdgfkgsdfkjg35464154845674987dsf@53", {
              expires: 7,
            });
            navigate("/dashboard");
          } 
          else if (result.client === true) {
            message.success("Logged in successfully");
            Cookies.set("email", result.emails, { expires: 7 });
            Cookies.set("id", result._id, { expires: 7 });
            Cookies.set("Name", result.name, { expires: 7 });
            // Ensure token is set correctly for client users
            Cookies.set("Token", "clientdgf45sdgf@89756dfgdhg&%df", {
              expires: 7,
            });
            navigate("/dashboard");
          }
          else {
            Cookies.set("email", result.email, { expires: 7 });
            Cookies.set("id", result._id, { expires: 7 });
            Cookies.set("Name", result.name, { expires: 7 });
            Cookies.set(
              "Token",
              "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg",
              { expires: 7 }
            );
            navigate("/dashboard");
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
        message.error("Login failed due to server error");
      });
  };

  const formsubsentotp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", forgetpasswordemail);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/sentotp`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setIsLoading(false);
        if (result === "user not found") {
          message.error("Please enter a correct Email Address");
        } else if (result === "user deactivated") {
          message.error("Account is Disable by Admin");
        } else {
          message.success("OTP has been sent to your email");
          setforgetpassword("3");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
        message.error("Failed to send OTP");
      });
  };

  const formsubsentsetpass = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", forgetpasswordemail);
    urlencoded.append("otp", forgetpasswordotp);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/setnewpassword`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setIsLoading(false);
        if (result === "otp match") {
          message.success("OTP verified successfully");
          setforgetpassword("4");
        } else {
          message.error("Please enter the correct OTP");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
        message.error("OTP verification failed");
      });
  };

  const formsubsentsetpass2 = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", forgetpasswordemail);
    urlencoded.append("password", forgetpasswordnewpassword);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/setnewpassword2`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setIsLoading(false);
        if (result === "password changed please login ") {
          message.success("Password changed successfully. Please login with your new password.");
          setforgetpassword("1");
          setforgetpasswordemail("");
          setforgetpasswordotp("");
          setforgetpasswordnewpassword("");
        } else {
          message.error("Something went wrong. Please try again later.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
        message.error("Password reset failed");
      });
  };

  useEffect(() => {
    if (
      token &&
      (token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" ||
        token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg" ||
        token === "clientdgf45sdgf@89756dfgdhg&%df")
    ) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <>
      <div className="login-container">
        {/* Background Animation */}
        <div className="login-background">
          <div className="gradient-bg"></div>
        </div>

        {/* Main Login Card */}
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo-container">
              <img src="https://screen4.org/wp-content/uploads/2023/02/SCREEN4-GREEN-WHITE-LOGO.png" alt="Screen4 Logo" className="login-logo" />
            </div>
            <div className="welcome-text">
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue</p>
            </div>
          </div>

          {/* Login Form */}
          {forgetpassword === "1" && (
            <div className="form-container">
              <form onSubmit={formsub} className="login-form">
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    name="email"
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper" style={{ position: 'relative' }}>
                    <input
                      id="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="modern-input"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? "👁️" : "🔒"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <button 
                    type="button" 
                    className="forgot-password-link"
                    onClick={() => setforgetpassword("2")}
                  >
                    Forgot your password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loading">
                      <div className="loading-spinner"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Forgot Password - Step 1: Email Input */}
          {forgetpassword === "2" && (
            <div className="form-container">
              <div className="form-header-section">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => setforgetpassword("1")}
                >
                  <TiArrowBack className="back-icon" />
                  Back to Login
                </button>
                <h2>Reset Your Password</h2>
                <p>Enter your email address to receive a verification code</p>
              </div>

              <form onSubmit={formsubsentotp} className="login-form">
                <div className="input-group">
                  <label htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    value={forgetpasswordemail}
                    onChange={(e) => setforgetpasswordemail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    type="email"
                    name="email"
                    className="modern-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loading">
                      <div className="loading-spinner"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Forgot Password - Step 2: OTP Verification */}
          {forgetpassword === "3" && (
            <div className="form-container">
              <div className="form-header-section">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => setforgetpassword("2")}
                >
                  <TiArrowBack className="back-icon" />
                  Back
                </button>
                <h2>Verify Your Identity</h2>
                <p>Enter the verification code sent to your email</p>
              </div>

              <form onSubmit={formsubsentsetpass} className="login-form">
                <div className="input-group">
                  <label htmlFor="otp">Verification Code</label>
                  <input
                    id="otp"
                    value={forgetpasswordotp}
                    onChange={(e) => setforgetpasswordotp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    type="text"
                    name="otp"
                    maxLength="6"
                    className="modern-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loading">
                      <div className="loading-spinner"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Forgot Password - Step 3: New Password */}
          {forgetpassword === "4" && (
            <div className="form-container">
              <div className="form-header-section">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => setforgetpassword("3")}
                >
                  <TiArrowBack className="back-icon" />
                  Back
                </button>
                <h2>Create New Password</h2>
                <p>Enter your new password below</p>
              </div>

              <form onSubmit={formsubsentsetpass2} className="login-form">
                <div className="input-group">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    value={forgetpasswordnewpassword}
                    onChange={(e) => setforgetpasswordnewpassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    type="password"
                    name="password"
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    pattern={forgetpasswordnewpassword}
                    title="Passwords must match"
                    placeholder="Confirm new password"
                    required
                    type="password"
                    name="confirm-password"
                    className="modern-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loading">
                      <div className="loading-spinner"></div>
                      Updating...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="login-footer">
            <p>© 2024 Screen4. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Client Portal Routes - To be rendered in the main application routing */}
      {/* <Routes>
        <Route path="/client/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/client/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/client/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/client/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes> */}
    </>
  );
}

export default Index;