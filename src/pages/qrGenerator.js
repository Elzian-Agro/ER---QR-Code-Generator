import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import ".././assets/styles/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import { Modal, Button as ModalButton } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  faUpload,
  faEye,
  faDownload,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/fontAwesome/fontAwesomeIcon";
import { utils, read } from "xlsx";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";

import { Chart } from "chart.js/auto";

const QrGenerator = () => {
  // const { authenticated } = useAuth();
  const navigate = useNavigate();

  // if (!authenticated) {
  //   return <Navigate to="/unAuth" />;
  // }

  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");

    navigate("/login");
  };

  const generateQRCodeDataForSelectedRow = () => {
    if (selectedRow !== null && excelData[selectedRow]) {
      const rowData = excelData[selectedRow];
      const qrCodeData = `https://example.com/certificate/${rowData.Ref_No}`; // Replace with your actual URL
      return qrCodeData;
    }
    return ""; // Return an empty string if there's no selected row
  };

  const generatePDF = () => {
    if (selectedRow !== null && excelData[selectedRow]) {
      const rowData = excelData[selectedRow];
      const uniqueId = Date.now(); // Generate a unique ID (you can customize this logic)

      const certificateElement = document.getElementById("certificate");

      html2canvas(certificateElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 size: 210mm x 297mm
        pdf.save(`certificate_${uniqueId}.pdf`); // Use the unique ID as the filename
      });
    }
  };

  const [excelData, setExcelData] = useState([]);
  const [qrCodeData, setQRCodeData] = useState([]);
  const [uniqueIds, setUniqueIds] = useState([]);
  const [excelError, setExcelError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const file_type = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const handleChange = (e) => {
    const selected_file = e.target.files[0];
    if (selected_file) {
      if (selected_file && file_type.includes(selected_file.type)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          const workbook = read(e.target.result);
          const sheet = workbook.SheetNames;
          if (sheet.length) {
            const data = utils.sheet_to_json(workbook.Sheets[sheet[0]]);
            setExcelData(data);
          }
        };
        reader.readAsArrayBuffer(selected_file);
      } else {
        setExcelError("please upload only excel file");
        setExcelData([]);
      }
    }
  };

  const generateQRCodeData = () => {
    const qrCodes = excelData.map((info, index) => {
      // Generate a unique identifier for each row (e.g., timestamp)
      const uniqueId = Date.now() + index; // You can customize this logic

      // Customize the data you want to encode in the QR code
      const dataToEncode = `${info.Ref_No}, ${info.Name}, ...`; // Customize as needed

      // Store the unique identifier in the state
      setUniqueIds((prevIds) => [...prevIds, uniqueId]);

      return (
        <div key={uniqueId}>
          <QRCode value={dataToEncode} />
        </div>
      );
    });

    setQRCodeData(qrCodes);
  };

  const renderChart = () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const cty = document.getElementById("chartProduction").getContext("2d");

    new Chart(cty, {
      type: "line",
      data: {
        labels: ["Year 1", "Year 2", "Year 3", "Year 4"],
        datasets: [
          {
            label: "O2 Production (Liters)",
            data: [
              excelData[selectedRow].O2_Production_Liters_1_years,
              excelData[selectedRow].O2_Production_Liters_2_years,
              excelData[selectedRow].O2_Production_Liters_3_years,
              excelData[selectedRow].O2_Production_Liters_4_years,
            ],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointRadius: 5,
          },
          {
            label: "CO2 Production (Grams of C)",
            data: [
              excelData[selectedRow]
                .Dynamic_Carbon_Capturing_Grams_of_C_1_years,
              excelData[selectedRow]
                .Dynamic_Carbon_Capturing_Grams_of_C_2_years,
              excelData[selectedRow]
                .Dynamic_Carbon_Capturing_Grams_of_C_3_years,
              excelData[selectedRow]
                .Dynamic_Carbon_Capturing_Grams_of_C_4_years,
            ],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            pointRadius: 5,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    new Chart(ctx, {
      type: "line", // Change the chart type to "line"
      data: {
        labels: ["Year 1", "Year 2", "Year 3", "Year 4"],
        datasets: [
          {
            label: "Photosynthetic Biomass (Grams)",
            data: [
              excelData[selectedRow].PB_Accumilation_Grms_1_years,
              excelData[selectedRow].PB_Accumilation_Grms_2_years,
              excelData[selectedRow].PB_Accumilation_Grms_3_years,
              excelData[selectedRow].PB_Accumilation_Grms_4_years,
            ],
            borderColor: "rgba(75, 192, 192, 1)", // Line color
            borderWidth: 2, // Line width
            pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
            pointRadius: 5, // Point radius
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  useEffect(() => {
    // Check if selectedRow is not null and excelData is available
    if (selectedRow !== null && excelData.length > 0) {
      renderChart();
    }
  }, [selectedRow, excelData]);

  return (
    <section id="qrfinder" className="py-5">
      <div className="container">
        <div className="row card">
          <div className="">
            <h2 className="">
              Generate QR CODE{" "}
              <span className="">
                {" "}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
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
                <input
                  type="file"
                  name="fileInput"
                  id="fileInput"
                  onChange={handleChange}
                />
              </form>
            </div>
            <button className="btn-btn view-btn" onClick={openModal}>
              <FontAwesomeIcon icon={faEye} />
              View
            </button>
            <Modal show={showModal} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>View Excel Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-container">
                  <table className="custom-table">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Ref_No</th>
                          <th>Farmers_Name</th>
                          <th>Registration_No</th>
                          <th>LF_UNIT_NO</th>
                          <th>Unit_Established_Date</th>
                          <th>Farmers_Name</th>
                          <th>GPS</th>
                          <th>Species</th>
                          <th>PB_Accumilation/Grms(1-years)</th>
                          <th>
                            Dynamic Carbon Capturing, Grams of C (1-years)
                          </th>
                          <th>O2_Production/Liters (1-years)</th>
                          <th>H2O_Production/Liters (1-years)</th>
                          <th>PB_Accumilation/Grms(2-years)</th>
                          <th>
                            Dynamic Carbon Capturing, Grams of C (2-years)
                          </th>
                          <th>O2_Production/Liters (2-years)</th>
                          <th>H2O_Production/Liters (2-years)</th>
                          <th>PB_Accumilation/Grms(3-years)</th>
                          <th>
                            Dynamic Carbon Capturing, Grams of C (3-years)
                          </th>
                          <th>O2_Production/Liters (3-years)</th>
                          <th>H2O_Production/Liters (3-years)</th>
                          <th>PB_Accumilation/Grms(4-years)</th>
                          <th>
                            Dynamic Carbon Capturing, Grams of C (4-years)
                          </th>
                          <th>O2_Production/Liters (4-years)</th>
                          <th>H2O_Production/Liters (4-years)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.length ? (
                          excelData.map((info) => (
                            <tr>
                              <td>{info.Ref_No}</td>
                              <td>{info.Name}</td>
                              <td>{info.Registration_No}</td>
                              <td>{info.LF_UNIT_NO}</td>
                              <td>{info.Unit_Established_Date}</td>
                              <td>{info.GPS}</td>
                              <td>{info.Species}</td>
                              <td>{info.PB_Accumilation_Grms_1_years}</td>
                              <td>
                                {
                                  info.Dynamic_Carbon_Capturing_Grams_of_C_1_years
                                }
                              </td>
                              <td>{info.O2_Production_Liters_1_years}</td>
                              <td>{info.H2O_Production_Liters_1_years}</td>
                              <td>{info.PB_Accumilation_Grms_2_years}</td>
                              <td>
                                {
                                  info.Dynamic_Carbon_Capturing_Grams_of_C_2_years
                                }
                              </td>
                              <td>{info.O2_Production_Liters_2_years}</td>
                              <td>{info.H2O_Production_Liters_2_years}</td>
                              <td>{info.PB_Accumilation_Grms_3_years}</td>
                              <td>
                                {
                                  info.Dynamic_Carbon_Capturing_Grams_of_C_3_years
                                }
                              </td>
                              <td>{info.O2_Production_Liters_3_years}</td>
                              <td>{info.H2O_Production_Liters_3_years}</td>
                              <td>{info.PB_Accumilation_Grms_4_years}</td>
                              <td>
                                {
                                  info.Dynamic_Carbon_Capturing_Grams_of_C_4_years
                                }
                              </td>
                              <td>{info.O2_Production_Liters_4_years}</td>
                              <td>{info.H2O_Production_Liters_4_years}</td>
                            </tr>
                          ))
                        ) : excelError.length ? (
                          <tr>{excelError}</tr>
                        ) : (
                          <tr>No user data is present</tr>
                        )}
                      </tbody>
                    </table>
                  </table>
                </div>
              </Modal.Body>
            </Modal>

            <br></br>
            <div className="gen-btn">
              <button className="btn-btn" onClick={generateQRCodeData}>
                <FontAwesomeIcon icon={faSync} />
                Generate QR Code
              </button>
            </div>
          </div>
        </div>

        {qrCodeData.length > 0 && (
          <div className="qr-gen">
            <h2>Your QR Codes
            <span className="">
                {" "}
                <button
                  type="button"
                  className="btn btn-success"
                  
                >
                  Download All
                </button>
              </span>
            </h2>
            <hr />
            <div className="qr-code-list">
              {qrCodeData.map((qrCode, index) => (
                <Card key={uniqueIds[index]} className="qr-code-item">
                  <Card.Body>
                    {qrCode}
                    <Button
                      className="mt-2"
                      variant="primary"
                      onClick={() => setSelectedRow(index)}
                    >
                      View Certificates
                    </Button>

                    <Button className="mt-2" variant="success">
                      Download
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal
        show={selectedRow !== null}
        onHide={() => setSelectedRow(null)}
        dialogClassName="modal-xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow !== null && excelData[selectedRow] && (
            <>
              <div>
                {/* <p>{excelData[selectedRow].Ref_No}</p>

                {excelData[selectedRow].Registration_No}
                {excelData[selectedRow].LF_UNIT_NO}
                {excelData[selectedRow].Unit_Established_Date}
                {excelData[selectedRow].GPS}
                {excelData[selectedRow].Species}
                {excelData[selectedRow].PB_Accumilation_Grms_1_years}
                {
                  excelData[selectedRow]
                    .Dynamic_Carbon_Capturing_Grams_of_C_1_years
                }
                {excelData[selectedRow].O2_Production_Liters_1_years}
                {excelData[selectedRow].H2O_Production_Liters_1_years}
                {excelData[selectedRow].PB_Accumilation_Grms_2_years}
                {
                  excelData[selectedRow]
                    .Dynamic_Carbon_Capturing_Grams_of_C_2_years
                }
                {excelData[selectedRow].O2_Production_Liters_2_years}
                {excelData[selectedRow].H2O_Production_Liters_2_years}
                {excelData[selectedRow].PB_Accumilation_Grms_3_years}
                {
                  excelData[selectedRow]
                    .Dynamic_Carbon_Capturing_Grams_of_C_3_years
                }
                {excelData[selectedRow].O2_Production_Liters_3_years}
                {excelData[selectedRow].H2O_Production_Liters_3_years}
                {excelData[selectedRow].PB_Accumilation_Grms_4_years}
                {
                  excelData[selectedRow]
                    .Dynamic_Carbon_Capturing_Grams_of_C_4_years
                }
                {excelData[selectedRow].O2_Production_Liters_4_years}
                {excelData[selectedRow].H2O_Production_Liters_4_years} */}
              </div>

              <div id="certificate">
                <div className="container">
                  <div className="row">
                    <div className="col-md-9">
                      {/* Left side with QR code and logo */}
                      <div className="text-center">
                        <h4>QR Code:</h4>
                        {selectedRow !== null && excelData[selectedRow] && (
                          <QRCode value={generateQRCodeDataForSelectedRow()} />
                        )}
                      </div>

                      <div className="col-md-6">
                        {/* <img src={qr} alt="QR Code" width="200" height="200" /> */}
                        <img src={logo} alt="Logo" width="200" height="150" />
                      </div>
                      <div className="col-sm" style={{ paddingLeft: "400px" }}>
                        {/* <img src={certi}></img> */}
                      </div>
                      <div class="w-100"></div>
                      <div class="col">
                        {/* <img src={chart}></img> */}
                        <div className="chart-container">
                          <canvas id="chart"></canvas>
                          <canvas id="chartProduction"></canvas>
                        </div>
                      </div>
                    </div>

                    <div className="certificate-content">
                    <div className="col-sm text-center">
                      {/* Centered text content */}
                      <h2>Payment for <br/>Photosynthetic Biomass</h2>
                      <h2>
                        Sir{" "}
                        <h4>
                          <u>{excelData[selectedRow].Name}</u>
                        </h4>{" "}
                        <h5>made to</h5>Mr/Mrs
                      </h2>
                      <br />
                      <br />
                      <h4>
                        <u>Name here</u>,<u>Name here</u>
                      </h4>
                      <h4>being a record of the settlement<br/> for maintaining</h4>

                      <h4>
                        <u>Numbers here</u>
                      </h4>
                      <br />
                      <h2>
                        EarthRestoration tree <br/>UNIT(s) contracted for 4 years
                      </h2>
                      <br />
                      <h4>
                        <u>Numbers here</u>
                      </h4>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="download-btn">
                <button onClick={generatePDF} className="button-44">
                  Download PDF
                </button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default QrGenerator;
