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
import XLSX from 'xlsx';
import QRCode from 'qrcode.react';

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

  const generateQRCode = (data) => {
    // Process the data and generate QR codes
    const qrCodes = data.map((row, index) => (
      <div key={index}>
        <p>Ref No: {row[0]}</p>
        <p>Farmers Name: {row[1]}</p>
        <p>Registration No: {row[2]}</p>
        <p>LF UNIT NO: {row[3]}</p>
        <p>Inestors Details: {row[4]}</p>
        <p>Unit Established  Date: {row[5]}</p>
        <p>GPS: {row[6]}</p>
        <p>Species: {row[7]}</p>
        <p>PB Accumilation/Grms(1 years): {row[8]}</p>
        <p>Dynamic Carbon Capturing, Grams of C (1 years): {row[9]}</p>
        <p>O2 Production/Liters (1 years): {row[10]}</p>
        <p>H2O Production/Liters (1 years): {row[11]}</p>
        <p>PB Accumilation/Grms(2 years): {row[12]}</p>
        <p>Dynamic Carbon Capturing, Grams of C (2 years): {row[13]}</p>
        <p>O2 Production/Liters (2 years): {row[14]}</p>
        <p>H2O Production/Liters (2 years): {row[15]}</p>
        <p>PB Accumilation/Grms(3 years): {row[16]}</p>
        <p>Dynamic Carbon Capturing, Grams of C (3 years): {row[17]}</p>
        <p>O2 Production/Liters (3 years): {row[18]}</p>
        <p>H2O Production/Liters (3 years): {row[19]}</p>
        <p>PB Accumilation/Grms(4 years): {row[20]}</p>
        <p>Dynamic Carbon Capturing, Grams of C (4 years): {row[21]}</p>
        <p>O2 Production/Liters (4 years): {row[22]}</p>
        <p>H2O Production/Liters (4 years): {row[23]}</p>
        <p>PB Accumilation/Grms(SUMMERY): {row[24]}</p>
        <p>Dynamic Carbon Capturing, Grams of C (SUMMERY): {row[25]}</p>
        <p>O2 Production/Liters (SUMMERY): {row[26]}</p>
        <p>H2O Production/Liters (SUMMERY): {row[27]}</p>
        <QRCode value={JSON.stringify(row)} />
      </div>
    ));
  };

  const handlesheet = async (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extract the necessary columns and generate QR codes
      generateQRCode(jsonData);
    };

    reader.readAsArrayBuffer(file);
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
              <button className="btn-btn" onClick={handlesheet}>
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
