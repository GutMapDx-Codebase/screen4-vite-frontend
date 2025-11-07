import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/index.css";
import { message, Modal } from "antd";
import "antd/dist/reset.css";
import Cookies from "js-cookie";
import { TiArrowBack } from "react-icons/ti";
import "./css/loginPage.css";

function Index() {
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [forgetpassword, setforgetpassword] = useState("1");
  const [forgetpasswordemail, setforgetpasswordemail] = useState("");
  const [forgetpasswordotp, setforgetpasswordotp] = useState("");
  const [forgetpasswordnewpassword, setforgetpasswordnewpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const token = Cookies.get("Token");

  const isUserLoggedIn = () => {
    return (
      token &&
      (token === "dskgfsdgfkgsdfkjg35464154845674987dsf@53" ||
        token === "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg" ||
        token === "clientdgf45sdgf89756dfgdhgdf")
    );
  };

  const formsub = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // ✅ Prevent empty submission
    if (!email.trim() || !password.trim()) {
      setIsLoading(false);
      message.error("Please enter both email and password.");
      return;
    }

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlencoded,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/screen4login`, requestOptions);
      const result = await res.json();
      setIsLoading(false);

      // ✅ Handle backend error responses
      if (result.message === "User not found." || result.message === "Password is incorrect.") {
        setErrorMessage("Incorrect email or password.");
        setErrorModalVisible(true);
        return;
      }

      if (result.message === "Email and password are required.") {
        setErrorMessage("Please fill in all fields.");
        setErrorModalVisible(true);
        return;
      }

      if (result.message === "Internal server error.") {
        message.error("Server error. Please try again later.");
        return;
      }

      // ✅ Login success — save cookies based on role
      message.success("Logged in successfully");

      Cookies.set("email", result.email, { expires: 7 });
      Cookies.set("id", result._id, { expires: 7 });
      Cookies.set("Name", result.name, { expires: 7 });

      if (result.role === "admin") {
        Cookies.set("Token", "dskgfsdgfkgsdfkjg35464154845674987dsf@53", { expires: 7 });
      } else if (result.role === "client") {
        Cookies.set("Token", "clientdgf45sdgf89756dfgdhgdf", { expires: 7 });
      } else if (result.role === "collector") {
        Cookies.set("Token", "collectorsdrfg&78967daghf#wedhjgasjdlsh6kjsdg", { expires: 7 });
      }

      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);
      message.error("Login failed due to server error.");
    }
  };

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <>
      <div className="login-container">
        {/* Background */}
        <div className="login-background">
          <div className="gradient-bg"></div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <img
                src="4screen.png"
                alt="Screen4 Logo"
                className="login-logo"
              />
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
                  <label>Email Address</label>
                  <input
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="password-wrapper" style={{ position: "relative" }}>
                    <input
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      type={showPassword ? "text" : "password"}
                      className="modern-input"
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
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

                <button type="submit" className="login-button" disabled={isLoading}>
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

          {/* Footer */}
          <div className="login-footer">
            <p>© 2025 Screen4. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal
        title="Login Error"
        visible={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        footer={null}
      >
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      </Modal>
    </>
  );
}

export default Index;
