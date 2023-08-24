import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import ".././assets/styles/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faEye,
  faDownload,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/fontAwesome/fontAwesomeIcon";
import qr from "../assets/sampleqr.jpg";

const QrGenerator = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  if (!authenticated) {
    return <Navigate to="/unAuth" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");



    navigate("/login"); 
  };

  return (
    <section id="qrfinder" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <h2 className="display-4 mb-4">Generate QR CODE</h2>
            <hr />
            <p>
              Excel URL:
              <input
                  className="form-control"
                  placeholder="Enter Excel Sheet URL"
                ></input>
            </p><br/>
            <p>Upload your details </p>
            <div>


              <form>
                <label for="fileInput">Upload file XLS:&nbsp; </label>
                <input type="file" name="fileInput" id="fileInput" />
                <input type="submit" className="btn-btn" value="Upload" />
              </form>

              <button className="btn-btn">
                <FontAwesomeIcon icon={faEye} />
                <a
                  href="https://shorturl.at/lGY23"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </button>
            </div>
            <br></br>
            <button className="btn-btn">
              <FontAwesomeIcon icon={faSync} />
              Generate QR Code
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              
              Logout
            </button>
          </div>

          <div className="col-lg-5">
            <img src={qr} alt="Contact Us" className="img-fluid" />
            <br />
            <button className="btn-btn">
              <FontAwesomeIcon icon={faDownload} />
              Download
            </button>
            <select id="dropdown">
              <option value="PNG">PNG</option>
              <option value="Pdf">Pdf</option>
            </select>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
};

export default QrGenerator;
