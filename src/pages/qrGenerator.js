import React, { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import ".././assets/styles/main.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import { Modal, Button as ModalButton } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import * as XLSX from "xlsx";
import { faUpload, faEye, faDownload, faSync } from "@fortawesome/free-solid-svg-icons";
import "../assets/fontAwesome/fontAwesomeIcon";
import { utils, read } from "xlsx";
import QRCodeComponent from "../components/QRCodeComponent";
import { Chart } from "chart.js/auto";

const QrGenerator = () => {
  const [excelData, setExcelData] = useState([]);
  const [qrCodeData, setQRCodeData] = useState([]);
  const [uniqueIds, setUniqueIds] = useState([]);
  const [excelError, setExcelError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedQRCodeData, setSelectedQRCodeData] = useState(null);
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const downloadLinkRef = useRef(null);

  let tempName;
  let tempRegistrationNo;
  let noOfPlants;
  let tempPerformance2021;
  let tempPaymentInDoller;
  let tempPaymentInSL;
  let tempPerformance2022;
  let tempPaymentInDoller2022;
  let tempPaymentInSL2022;

  useEffect(() => {
    if (selectedRow !== null && excelData.length > 0) {
      // Run this code conditionally
      renderChart();
    }
  }, [selectedRow, excelData]);

  if (!authenticated) {
    return <Navigate to="/unAuth" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");

    navigate("/login");
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

  // Reference to the anchor element

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
      if (file_type.includes(selected_file.type)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          const workbook = read(e.target.result);
          const sheet = workbook.SheetNames;
          if (sheet.length) {
            setExcelData(utils.sheet_to_json(workbook.Sheets[sheet[0]]));
          }
        };
        reader.readAsArrayBuffer(selected_file);
      } else {
        setExcelError("Please upload only an Excel file");
        setExcelData([]); // Clear the excelData
      }
    }
  };

  const generateQRCodeData = () => {
    const qrCodes = Object.values(excelData).map((info, index) => {

      const encodedGPSData = info["GPS"] || info["G"];
      info["GPS"] = decodeEntities(encodedGPSData);

      const unitEstablishedDate = info["F"];
      const formattedUnitEstablishedDate = formatDateFromExcel(unitEstablishedDate);
      // Generate a unique identifier for each row (e.g., timestamp)
      const uniqueId = Date.now() + index; // You can customize this logic

      // Customize the data you want to encode in the QR code
      const dataToEncode = 
        `Farmer: ${info["Farmers Name "] || info["B"]}
Registration: ${info["Registration No"] || info["C"]}
LF Unit No: ${info["LF UNIT NO"] || info["D"]}
investors: ${info["Inestors Details"] || info["E"]}
UE_Date: ${info["Unit Established  Date "] || formattedUnitEstablishedDate}
GPS: ${info["GPS"]}
Species: ${info[" Species"] || info["H"]}
PB(Sum): ${info["PB Accumilation/Grms(summery)"] || info["Y"]}
DCC(Sum): ${info["Dynamic Carbon Capturing, Grams of C(summery)"] || info["Z"]}
O2(Sum): ${info["O2 Production/Liters(summery)"] || info["AA"]}
H2O(Sum): ${info["H2O Production/Liters(summery)"] || info["AB"]}
Performance(2019/2): ${
    info["performance  of plants/Units as at date 2019/Feb "] ||
    info["AD"]
  } - Payment: $${info["Payment "] || info["AE"]} 
Performance(2020/2):${
            info["performance  of plants/Units as at date 2020/Feb "] ||
            info["AF"]
          } - Payment: $${info["Payment _1"] || info["AG"]}
Performance(2021/2): ${
    info["performance  of plants/Units as at date 2021/Feb "] ||
    info["AH"]
  }
$ ${info["Payment Ammount,$"] || info["AI"]} 
Rs. ${info["In SL Rupies"] || info["AJ"]} 
Performance(2022/2): ${
    info["performance  of plants/Units as at date 2022/Feb "] ||
    info["AK"]
  }
$ ${info["Payment exchange $"] || info["AL"]} 
Rs. ${info["In SL Rupies_1"] || info["AM"]}`;
      // Customize as needed

      // Store the unique identifier in the state
      setUniqueIds((prevIds) => [...prevIds, uniqueId]);

      return (
        <div key={uniqueId}>
          <QRCodeComponent data={dataToEncode} />
        </div>
      );
    });

    setQRCodeData(qrCodes);
    setUniqueIds([...Array(excelData.length).keys()]);
  };

  const downloadQRCode = (qrCodeElement, filename) => {
    if (qrCodeElement) {
      // Element exists, proceed with downloading
      domtoimage.toBlob(qrCodeElement).then(function (blob) {
        saveAs(blob, filename);
      });
    } else {
      console.error("QR code element not found.");
    }
  };

  const downloadAllQrCodes = () => {
    qrCodeData.map((qrCode, index) => {
      const qrCodeElement = document.getElementById(`qr-code-${index}`);
      downloadQRCode(qrCodeElement, `QRCode_${index}.png`);
    });
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

  const fetchExcelDataFromURL = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const urlData = new Uint8Array(response.data);
      const workbook = XLSX.read(urlData, { type: "array" });
      const sheetNames = workbook.SheetNames;
  
      // Read all rows from the first sheet
      const allData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
  
      // Filter out rows with data in column 'A' (or any other column)
      const nonEmptyRows = allData.filter(row => {
        return row['A'] !== undefined;
      });
  
      // Exclude the first row
      const nonEmptyRowsExcludingFirst = nonEmptyRows.slice(1);
  
      setExcelData(nonEmptyRowsExcludingFirst);
    } catch (error) {
      setExcelData([]);
      setExcelError("Error fetching data from URL");
    }
  };

  const handleDownload = async () => {
    const url = downloadLinkRef.current.value;
    if (url) {
      fetchExcelDataFromURL(url);
    }
  };

  const formatDateFromExcel = (dateSerialNumber) => {
    const sheetDate = new Date((dateSerialNumber - 25569) * 86400 * 1000); // Convert Excel date serial number to milliseconds
    const day = sheetDate.getDate();
    const month = sheetDate.getMonth() + 1;
    const year = sheetDate.getFullYear();
    return `${month}.${day}.${year}`;
  };

  const decodeEntities = (encodedString) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
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
                type="text"
                ref={downloadLinkRef}
                onChange={handleDownload}
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
            <Modal show={showModal} onHide={closeModal} fullscreen={true}>
              <Modal.Header closeButton>
                <Modal.Title>View Excel Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Ref_No</th>
                        <th>Farmers_Name</th>
                        <th>Registration_No</th>
                        <th>LF_UNIT_NO</th>
                        <th>Inestors_Details</th>
                        <th>Unit_Established_Date</th>
                        <th>GPS</th>
                        <th>Species</th>
                        <th>PB_Accumilation/Grms(1-years)</th>
                        <th>Dynamic Carbon Capturing, Grams of C (1-years)</th>
                        <th>O2_Production/Liters (1-years)</th>
                        <th>H2O_Production/Liters (1-years)</th>
                        <th>PB_Accumilation/Grms(2-years)</th>
                        <th>Dynamic Carbon Capturing, Grams of C (2-years)</th>
                        <th>O2_Production/Liters (2-years)</th>
                        <th>H2O_Production/Liters (2-years)</th>
                        <th>PB_Accumilation/Grms(3-years)</th>
                        <th>Dynamic Carbon Capturing, Grams of C (3-years)</th>
                        <th>O2_Production/Liters (3-years)</th>
                        <th>H2O_Production/Liters (3-years)</th>
                        <th>PB_Accumilation/Grms(4-years)</th>
                        <th>Dynamic Carbon Capturing, Grams of C (4-years)</th>
                        <th>O2_Production/Liters (4-years)</th>
                        <th>H2O_Production/Liters (4-years)</th>
                        <th>PB_Accumilation/Grms(Summery)</th>
                        <th>Dynamic Carbon Capturing, Grams of C (Summery)</th>
                        <th>O2_Production/Liters (Summery)</th>
                        <th>H2O_Production/Liters (Summery)</th>
                        <th>No of plants/Units</th>
                        <th>performance of plants/Units as at date 2019/Feb</th>
                        <th>Payment</th>
                        <th>performance of plants/Units as at date 2020/Feb</th>
                        <th>Payment</th>
                        <th>performance of plants/Units as at date 2021/Feb</th>
                        <th>Payment Ammount,$</th>
                        <th>In SL Rupies</th>
                        <th>performance of plants/Units as at date 2022/Feb</th>
                        <th>Payment exchange $</th>
                        <th>In SL Rupies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.length ? (
                        Object.values(excelData).map((info) => {

                            // Display merged cells in colum
                          if (typeof info["Ref No"] || typeof info["A"] == "number") {
                            if (info["Farmers Name "] || info["B"]) {
                              tempName = info["Farmers Name "] || info["B"] ;
                              tempRegistrationNo = info["Registration No"] || info["C"];
                              noOfPlants = info["No of plants/Units "] || info["AC"];
                              tempPerformance2021 = info["performance  of plants/Units as at date 2021/Feb "] || info["AH"];
                              tempPaymentInDoller = info["Payment Ammount,$"] || info["AI"] ;
                              tempPaymentInSL = info["In SL Rupies"] || info["AJ"] ;
                              tempPerformance2022 = info["performance  of plants/Units as at date 2022/Feb "] || info["AK"]
                              tempPaymentInDoller2022 = info["Payment exchange $"] || info["AL"];
                              tempPaymentInSL2022 = info["In SL Rupies_1"] || info["AM"];
 
                              } else {
                                info["Farmers Name "] = tempName;
                                info["Registration No"] = tempRegistrationNo;
                                info["No of plants/Units "] = noOfPlants;
                                info["performance  of plants/Units as at date 2021/Feb "] = tempPerformance2021;
                                info["Payment Ammount,$"] = tempPaymentInDoller;
                                info["In SL Rupies"] = tempPaymentInSL;
                                info["performance  of plants/Units as at date 2022/Feb "] = tempPerformance2022;
                                info["Payment exchange $"] = tempPaymentInDoller2022;
                                info["In SL Rupies_1"] = tempPaymentInSL2022;
                              }

                          const unitEstablishedDate = info["F"];
                          const formattedUnitEstablishedDate = formatDateFromExcel(unitEstablishedDate);
                          
                          const encodedGPSData = info["GPS"] || info["G"];
                          const decodedGPSData = decodeEntities(encodedGPSData);
                              
                          return (
                            <tr key={info}>
                              <td>{info["Ref No"] || info["A"]}</td>
                              <td>{info["Farmers Name "] || info["B"]}</td>
                              <td>{info["Registration No"] || info["C"]}</td>
                              <td>{info["LF UNIT NO"] || info["D"]}</td>
                              <td>{info["Inestors Details"] || info["E"]}</td>
                              <td>{info["Unit Established  Date "] || formattedUnitEstablishedDate}</td>
                              <td>{decodedGPSData}</td>
                              <td>{info[" Species"] || info["H"]}</td>
                              <td>
                                {info["PB Accumilation/Grms(Year1)"] ||
                                  info["I"]}
                              </td>
                              <td>
                                {info[
                                  "Dynamic Carbon Capturing, Grams of C(Year1)"
                                ] || info["J"]}
                              </td>
                              <td>
                                {info["O2 Production/Liters(Year1)"] ||
                                  info["K"]}
                              </td>
                              <td>
                                {info["H2O Production/Liters(Year1)"] ||
                                  info["L"]}
                              </td>
                              <td>
                                {info["PB Accumilation/Grms(Year2)"] ||
                                  info["M"]}
                              </td>
                              <td>
                                {info[
                                  "Dynamic Carbon Capturing, Grams of C(Year2)"
                                ] || info["N"]}
                              </td>
                              <td>
                                {info["O2 Production/Liters(Year2)"] ||
                                  info["O"]}
                              </td>
                              <td>
                                {info["H2O Production/Liters(Year2)"] ||
                                  info["P"]}
                              </td>
                              <td>
                                {info["PB Accumilation/Grms(Year3)"] ||
                                  info["Q"]}
                              </td>
                              <td>
                                {info[
                                  "Dynamic Carbon Capturing, Grams of C(Year3)"
                                ] || info["R"]}
                              </td>
                              <td>
                                {info["O2 Production/Liters(Year3)"] ||
                                  info["S"]}
                              </td>
                              <td>
                                {info["H2O Production/Liters(Year3)"] ||
                                  info["T"]}
                              </td>
                              <td>
                                {info["PB Accumilation/Grms(Year4)"] ||
                                  info["U"]}
                              </td>
                              <td>
                                {info[
                                  "Dynamic Carbon Capturing, Grams of C(Year4)"
                                ] || info["V"]}
                              </td>
                              <td>
                                {info["O2 Production/Liters(Year4)"] ||
                                  info["W"]}
                              </td>
                              <td>
                                {info["H2O Production/Liters(Year4)"] ||
                                  info["X"]}
                              </td>
                              <td>
                                {info["PB Accumilation/Grms(summery)"] ||
                                  info["Y"]}
                              </td>
                              <td>
                                {info[
                                  "Dynamic Carbon Capturing, Grams of C(summery)"
                                ] || info["Z"]}
                              </td>
                              <td>
                                {info["O2 Production/Liters(summery)"] ||
                                  info["AA"]}
                              </td>
                              <td>
                                {info["H2O Production/Liters(summery)"] ||
                                  info["AB"]}
                              </td>
                              <td>
                                {info["No of plants/Units "] || info["AC"]}
                              </td>
                              <td>
                                {info[
                                  "performance  of plants/Units as at date 2019/Feb "
                                ] || info["AD"]}
                              </td>
                              <td>{info["Payment "] || info["AE"]}</td>
                              <td>
                                {info[
                                  "performance  of plants/Units as at date 2020/Feb "
                                ] || info["AF"]}
                              </td>
                              <td>{info["Payment _1"] || info["AG"]}</td>
                              <td>
                                {info[
                                  "performance  of plants/Units as at date 2021/Feb "
                                ] || info["AH"]}
                              </td>
                              <td>{info["Payment Ammount,$"] || info["AI"]}</td>
                              <td>{info["In SL Rupies"] || info["AJ"]}</td>
                              <td>
                                {info[
                                  "performance  of plants/Units as at date 2022/Feb "
                                ] || info["AK"]}
                              </td>
                              <td>
                                {info["Payment exchange $"] || info["AL"]}
                              </td>
                              <td>{info["In SL Rupies_1"] || info["AM"]}</td>
                            </tr>
                          );
                        }})
                      ) : excelError.length ? (
                        <tr>{excelError}</tr>
                      ) : (
                        <tr>No user data is present</tr>
                      )}
                    </tbody>
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
            <h2>
              Your QR Codes
              <span className="">
                {" "}
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={downloadAllQrCodes}
                >
                  Download All
                </button>
              </span>
            </h2>
            <hr />
            <div className="qr-code-list">
              {qrCodeData.map((qrCode, index) => (
                <div className="qr-code-card" key={uniqueIds[index]}>
                  <Card>
                    <Card.Body>
                    <div id={`qr-code-${index}`} className="qr-code">
                      {qrCode}
                    </div>
                      {/* <Button
                      className="mt-2"
                      variant="primary"
                      onClick={() => {
                        setSelectedRow(index);
                        setSelectedQRCodeData(qrCodeData[index]);
                      }}
                    >
                      View Certificates
                    </Button> */}
                      <Button
                        className="mt-2"
                        variant="success"
                        onClick={() => {
                          const qrCodeElement = document.getElementById(
                            `qr-code-${index}`
                          );
                          downloadQRCode(qrCodeElement, `QRCode_${index}.png`); // Provide a filename
                        }}
                      >
                        Download
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Modal
        show={selectedRow !== null}
        onHide={() => setSelectedRow(null)}
        dialogClassName="modal-xl"
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRow !== null && excelData[selectedRow] && (
            <>
              <div>
                <p>{excelData[selectedRow].Ref_No}</p>

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
                {excelData[selectedRow].H2O_Production_Liters_4_years}
              </div>

              <div id="certificate">
                <div className="container">
                  <div className="row">
                    <div className="col-md-9">
                      {/* Left side with QR code and logo */}
                      <div className="row">
                        <div className="col-md-4">
                          <img src={logo} alt="Logo" width="200" height="150" />
                        </div>
                        <div className="col-md-8">{selectedQRCodeData}</div>
                      </div>

                      <div className="w-100"></div>
                      <div className="col">
                        <div className="chart-container">
                          <canvas id="chart"></canvas>
                          <canvas id="chartProduction"></canvas>
                        </div>
                      </div>
                    </div>

                    <div className="certificate-content">
                      <div className="col-sm text-center">
                        {/* Centered text content */}
                        <h2>
                          Payment for <br />
                          Photosynthetic Biomass
                        </h2>
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
                        <h4>
                          being a record of the settlement
                          <br /> for maintaining
                        </h4>

                        <h4>
                          <u>Numbers here</u>
                        </h4>
                        <br />
                        <h2>
                          EarthRestoration tree <br />
                          UNIT(s) contracted for 4 years
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
