import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../users.json";
import { useAuth } from "../AuthContext";
import "../assets/styles/main.css";
import logo from "../assets/images/logo.png";
const sha256 = require('js-sha256').sha256;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("rememberedUsername") && localStorage.getItem("rememberedPassword")) {
      setUsername(localStorage.getItem("rememberedUsername"));
      setPassword("********");
      setRememberMe(true);
    }
  }, []);

  // Hash the password
  const hashPassword = (password) => {
    return sha256(password); // Simple SHA-256 hashing
  };

  const handleLogin = async () => {
    const user = users.find((user) => user.username === username);

    // Check if the user exists and the password is correct or username and password locally saved
    if ((user && user.password === hashPassword(password)) || (localStorage.getItem("rememberedUsername") && localStorage.getItem("rememberedPassword"))) {
      setLoginStatus("");
      setIsLoading(true);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", hashPassword(password));
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      setTimeout(() => {
        setIsLoading(false);
        setLoginStatus("Login successful");
        login();
        navigate("/ER---QR-Code-Generator/qr");
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <label className="input-label">Email Address</label>
                    </div>
                    <div className="input-container">
                      <input
                        type="password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
