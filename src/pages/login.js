import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../users.json";
import { useAuth } from "../AuthContext";
import bcrypt from "bcryptjs";
import "../assets/styles/main.css";
import logo from "../assets/images/logo.png";

const LoginForm = () => {
  const [enterUsername, setEnterUsername] = useState("");
  const [enterPassword, setEnterPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("rememberedUsername") && localStorage.getItem("rememberedPassword")) {
      setEnterUsername(localStorage.getItem("rememberedUsername"));
      setEnterPassword("********");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    const user = users.find((user) => user.username === enterUsername);

    // Check if the user exists and the password is correct or username and password locally saved
    if ((user && await bcrypt.compare(enterPassword, user.password)) || (localStorage.getItem("rememberedUsername") && localStorage.getItem("rememberedPassword"))) {
      setLoginStatus("");
      setIsLoading(true);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", enterUsername);
        localStorage.setItem("rememberedPassword", await bcrypt.hash(enterPassword, 10));
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      setTimeout(() => {
        setIsLoading(false);
        setLoginStatus("Login successful");
        login();
        navigate("/qr");
      }, 2000);

    } else {
      setLoginStatus("Invalid credentials");
    }
  };

  // Close the alert message
  const closeAlert = () => {
    setLoginStatus("");
  };

  return (
    <div>
      <div className="contianer">
        <div className={`Alert-message ${loginStatus ? "show" : ""}`}>
          <button className="close" onClick={closeAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
          <p>{loginStatus}</p>
        </div>
        <div className="login-card">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <img
                  src={logo}
                  alt="logo"
                  className="logo-img"
                />
              </div>
              <div className="col-md-7">
                <div className="title">
                  <h4>Welcome To QR Code Generator Login</h4>
                  <hr />
                  <form className="container">
                    <div className="input-container">
                      <input
                        type="text"
                        className="input-field"
                        value={enterUsername}
                        onChange={(e) => setEnterUsername(e.target.value)}
                        required
                      />
                      <label className="input-label">Email Address</label>
                    </div>
                    <div className="input-container">
                      <input
                        type="password"
                        className="input-field"
                        value={enterPassword}
                        onChange={(e) => setEnterPassword(e.target.value)}
                        required
                      />
                      <label className="input-label">Password</label>
                    </div>
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        &nbsp;Remember Me
                      </label>
                    </div>
                    <br />
                    <button
                      type="button"
                      className="button btn-one"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="spinner-border spinner-border-sm text-info">
                          <output className="sr-only">Loading...</output>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
