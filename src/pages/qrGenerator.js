import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import ".././assets/styles/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button } from "react-bootstrap";
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
        <div className="row card">
          <div className="">
            <h2 className="">
              Generate QR CODE{" "}
              <span className="">
                {" "}
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </span>
            </h2>

            <hr />
            <p>
              Excel URL:
              <input
                className="form-control"
                placeholder="Enter Excel Sheet URL"
              ></input>
            </p>
            <br />
            <p>Upload your details </p>
            <div>
              <form>
                <label for="fileInput">Upload file XLS:&nbsp; </label>
                <input type="file" name="fileInput" id="fileInput" />
                <input type="submit" className="btn-btn" value="Upload" />
                <button className="btn-btn view-btn">
                  <FontAwesomeIcon icon={faEye} />
                  <a
                    href="https://shorturl.at/lGY23"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </button>
              </form>
            </div>
            <br></br>
            <div className="gen-btn">
              <button className="btn-btn">
                <FontAwesomeIcon icon={faSync} />
                Generate QR Code
              </button>
            </div>
          </div>
        </div>

        <div className="qr-gen">
          <h2>Your QR Codes</h2>
          <hr />
        </div>

        <div className="row">
          {/* Card 1 */}
          <div className="col-md-4">
            <Card style={{ width: "19rem" }} className="card">
              <Card.Img variant="top" src={qr} />
              <Card.Body>
                <Card.Title>Tree ID : #712638</Card.Title>
                <Button className="btn-btn">
                  <FontAwesomeIcon icon={faDownload} />
                  Download
                </Button>
                <select id="dropdown">
                  <option value="PNG">PNG</option>
                  <option value="Pdf">Pdf</option>
                </select>
              </Card.Body>
            </Card>
          </div>
          {/* Card 2 */}
          <div className="col-md-4">
            <Card style={{ width: "19rem" }} className="card">
              <Card.Img variant="top" src={qr} />
              <Card.Body>
                <Card.Title>Tree ID : #712638</Card.Title>
                <Button className="btn-btn">
                  <FontAwesomeIcon icon={faDownload} />
                  Download
                </Button>
                <select id="dropdown">
                  <option value="PNG">PNG</option>
                  <option value="Pdf">Pdf</option>
                </select>
              </Card.Body>
            </Card>
          </div>
          {/* Card 3 */}
          <div className="col-md-4">
            <Card style={{ width: "19rem" }} className="card">
              <Card.Img variant="top" src={qr} />
              <Card.Body>
                <Card.Title>Tree ID : #712638</Card.Title>
                <Button className="btn-btn">
                  <FontAwesomeIcon icon={faDownload} />
                  Download
                </Button>
                <select id="dropdown">
                  <option value="PNG">PNG</option>
                  <option value="Pdf">Pdf</option>
                </select>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QrGenerator;
