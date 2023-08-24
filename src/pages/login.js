import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import users from "../users.json";
import { useAuth } from "../AuthContext";
import bcrypt from "bcryptjs";
import "../assets/styles/main.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = () => {
    setMessage("");

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setMessage("");
      setIsLoading(true);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      setTimeout(() => {
        setIsLoading(false);
        setMessage("Login successful");
        login();
        navigate("/qr");
      }, 2000);
    } else {
      setMessage("Invalid credentials");
    }
  };

  const closeAlert = () => {
    setMessage("");
  };

  return (
    <div>
      <div className="contianer">
        <div className={`Alert-message ${message ? "show" : ""}`}>
          <button className="close" onClick={closeAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
          <p>{message}</p>
        </div>
        <div className="login-card">
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <img
                  src="https://restore.earth/assets/img/ER%20LOGO1.png"
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
                        <div
                          className="spinner-border spinner-border-sm text-info"
                          role="status"
                        >
                          <span className="sr-only"></span>
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
