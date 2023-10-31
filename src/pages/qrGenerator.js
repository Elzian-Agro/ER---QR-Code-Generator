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
import {
  faUpload,
  faEye,
  faDownload,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/fontAwesome/fontAwesomeIcon";
import { utils, read } from "xlsx";
import QRCode from "qrcode.react";

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

  // const [excelData, setExcelData] = useState([]);
  // const [qrCodeData, setQRCodeData] = useState([]);
  // const [uniqueIds, setUniqueIds] = useState([]);
  // const [excelError, setExcelError] = useState("");
  // const [showModal, setShowModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState(null);
  // const [selectedQRCodeData, setSelectedQRCodeData] = useState(null);

  // Reference to the anchor element

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const downloadQRCode = (qrCodeElement, filename) => {
    domtoimage.toBlob(qrCodeElement).then(function (blob) {
      saveAs(blob, filename);
    });
  };

  const file_type = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  function mergeTables(table1, table2) {
    const mergedData = {};

    for (const row of table1) {
      const key = row.__EMPTY_3;
      mergedData[key] = { ...row };
    }

    for (const row of table2) {
      const key = row["LF UNIT NO"];
      if (mergedData[key]) {
        Object.assign(mergedData[key], row);
      } else {
        mergedData[key] = { ...row };
      }
    }

    // Update the excelData state with the merged data
    setExcelData(Object.values(mergedData));

    return mergedData;
  }

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
            const data1 = utils.sheet_to_json(workbook.Sheets[sheet[1]]);
            // const mergedJSON = mergeTables(data, data1);
            // const mergedJSONString = JSON.stringify(mergedJSON, null, 2);
            // console.log(mergedJSONString);
            mergeTables(data, data1);
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
    // const qrCodes = excelData.map((info, index) => {
    const qrCodes = Object.values(excelData)
      .slice(2)
      .map((info, index) => {
        // Generate a unique identifier for each row (e.g., timestamp)
        console.log(info, "this is from qr code");
        const uniqueId = Date.now() + index; // You can customize this logic

        // Customize the data you want to encode in the QR code
        const dataToEncode = `
        Name:${
          info.__EMPTY_1 //Name
        }
        Registration_No:${
          info.__EMPTY_2 //Registration_No
        }
        LF_UNIT_NO:${
          info.__EMPTY_3 //LF_UNIT_NO
        }
        Inestors_Details:${
          info.__EMPTY_4 //Inestors_Details
        }
        Unit_Established_Date:${
          info.__EMPTY_5 //Unit_Established_Date
        }
        GPS:${
          info.__EMPTY_6 //GPS
        }
        Species:${
          info.__EMPTY_7 //Species
        }
        C-PES Calculations:${
          info.__EMPTY_8 //['C-PES Calculations']
        }
        Dynamic Carbon Capturing:${
          info.__EMPTY_9 //Dynamic Carbon Capturing
        }
        O2_Production_Liters_1_years:${
          info.__EMPTY_10 //O2_Production_Liters_1_years
        }
        H2O_Production_Liters_1_years:${
          info.__EMPTY_11 //H2O_Production_Liters_1_years
        }
        PB_Accumilation_Grms_2_years:${
          info.__EMPTY_12 //PB_Accumilation_Grms_2_years
        }
        Dynamic_Carbon_Capturing_Grams_of_C_2_years:${
          info.__EMPTY_13 //Dynamic_Carbon_Capturing_Grams_of_C_2_years
        }
        O2_Production_Liters_2_years:${
          info.__EMPTY_14 //O2_Production_Liters_2_years
        }
        H2O_Production_Liters_2_years:${
          info.__EMPTY_15 //H2O_Production_Liters_2_years
        }
        PB_Accumilation_Grms_3_years:${
          info.__EMPTY_16 //PB_Accumilation_Grms_3_years
        }
        Dynamic_Carbon_Capturing_Grams_of_C_3_years:${
          info.__EMPTY_17 //Dynamic_Carbon_Capturing_Grams_of_C_3_years
        }
        O2_Production_Liters_3_years:${
          info.__EMPTY_18 //O2_Production_Liters_3_years
        }
        H2O_Production_Liters_3_years:${
          info.__EMPTY_19 //H2O_Production_Liters_3_years
        }
        PB_Accumilation_Grms_4_years:${
          info.__EMPTY_20 //PB_Accumilation_Grms_4_years
        }
        Dynamic_Carbon_Capturing_Grams_of_C_4_years:${
          info.__EMPTY_21 //Dynamic_Carbon_Capturing_Grams_of_C_4_years
        }
        O2_Production_Liters_4_years:${
          info.__EMPTY_22 //O2_Production_Liters_4_years
        }
        H2O_Production_Liters_4_years:${
          info.__EMPTY_23 //H2O_Production_Liters_4_years
        }
        PB_Accumilation_Grms_Summery:${
          info.__EMPTY_24 //PB_Accumilation_Grms_Summery
        }
        Dynamic_Carbon_Capturing_Grams_of_C_Summery:${
          info.__EMPTY_25 //Dynamic_Carbon_Capturing_Grams_of_C_Summery
        }
        O2_Production_Liters_Summery:${
          info.__EMPTY_26 //O2_Production_Liters_Summery
        }
        H2O_Production_Liters_Summery:${
          info.__EMPTY_27 //H2O_Production_Liters_Summery
        }
        Farmers Name:${info["Farmers Name "]} F.NO:${info["F.NO"]} LF UNIT NO:${
          info["LF UNIT NO"]
        } Inestors Details:${info["Inestors Details"]} No of plants/Units:${
          info["No of plants/Units "]
        } Uit Established  Date:${info["Uit Established  Date "]} Species:${
          info[" Species"]
        } performance  of plants/Units as at date 2019/Feb:${
          info["performance  of plants/Units as at date 2019/Feb "]
        }
        Payment:${
          info["Payment "]
        } performance  of plants/Units as at date 2020/Feb:${
          info["performance  of plants/Units as at date 2020/Feb "]
        }
        Payment _1:${
          info["Payment _1"]
        } performance  of plants/Units as at date 2021/Feb:${
          info["performance  of plants/Units as at date 2021/Feb "]
        }
        Payment Ammount,$:${info["Payment Ammount,$"]} In SL Rupies:${
          info["In SL Rupies"]
        } performance  of plants/Units as at date 2022/Feb:${
          info["performance  of plants/Units as at date 2022/Feb "]
        }
        Payment exchange $:${info["Payment exchange $"]} In SL Rupies_1:${
          info["In SL Rupies_1"]
        }`;
        // Customize as needed

        // console.log(dataToEncode, "This is the data to encode");

        // Store the unique identifier in the state
        setUniqueIds((prevIds) => [...prevIds, uniqueId]);

        return (
          <div key={uniqueId}>
            <QRCode value={dataToEncode} />
          </div>
        );
      });

    setQRCodeData(qrCodes);
    setUniqueIds([...Array(excelData.length).keys()]);
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

  const handleDownload = async () => {
    if (downloadLinkRef.current) {
      const value = downloadLinkRef.current.value;
      console.log(value);
      const response = await axios.get(value, { responseType: "arraybuffer" });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      console.log(workbook);
      const sheet = workbook.SheetNames;
      const test = utils.sheet_to_json(workbook.Sheets[sheet[0]]);
      console.log(workbook);
      console.log(test);
      setExcelData(test);
    }
  };

  // excelData && console.log(excelData, "this is the excell data");
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
                        {/* <th>Farmers Name</th> */}
                        <th>F.NO</th>
                        {/* <th>LF UNIT NO</th> */}
                        <th>Inestors Details</th>
                        <th>No of plants/Units</th>
                        <th>Unit Established Date</th>
                        <th>Species</th>
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
                        Object.values(excelData)
                          .slice(2)
                          .map((info, index) => {
                            // console.log(info);
                            return (
                              <tr key={index}>
                                <td>
                                  {
                                    info.__EMPTY //Ref_No
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_1 //Name
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_2 //Registration_No
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_3 //LF_UNIT_NO
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_4 //Inestors_Details
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_5 //Unit_Established_Date
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_6 //GPS
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_7 //Species
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_8 //['C-PES Calculations']
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_9 //Dynamic Carbon Capturing
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_10 //O2_Production_Liters_1_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_11 //H2O_Production_Liters_1_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_12 //PB_Accumilation_Grms_2_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_13 //Dynamic_Carbon_Capturing_Grams_of_C_2_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_14 //O2_Production_Liters_2_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_15 //H2O_Production_Liters_2_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_16 //PB_Accumilation_Grms_3_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_17 //Dynamic_Carbon_Capturing_Grams_of_C_3_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_18 //O2_Production_Liters_3_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_19 //H2O_Production_Liters_3_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_20 //PB_Accumilation_Grms_4_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_21 //Dynamic_Carbon_Capturing_Grams_of_C_4_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_22 //O2_Production_Liters_4_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_23 //H2O_Production_Liters_4_years
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_24 //PB_Accumilation_Grms_Summery
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_25 //Dynamic_Carbon_Capturing_Grams_of_C_Summery
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_26 //O2_Production_Liters_Summery
                                  }
                                </td>
                                <td>
                                  {
                                    info.__EMPTY_27 //H2O_Production_Liters_Summery
                                  }
                                </td>
                                {/* <td>{info["Farmers Name "]}</td> */}
                                <td>{info["F.NO"]}</td>
                                {/* <td>{info["LF UNIT NO"]}</td> */}
                                <td>{info["Inestors Details"]}</td>
                                <td>{info["No of plants/Units "]}</td>
                                <td>{info["Unit Established  Date "]}</td>
                                <td>{info[" Species"]}</td>
                                <td>
                                  {
                                    info[
                                      "performance  of plants/Units as at date 2019/Feb "
                                    ]
                                  }
                                </td>
                                <td>{info["Payment "]}</td>
                                <td>
                                  {
                                    info[
                                      "performance  of plants/Units as at date 2020/Feb "
                                    ]
                                  }
                                </td>
                                <td>{info["Payment _1"]}</td>
                                <td>
                                  {
                                    info[
                                      "performance  of plants/Units as at date 2021/Feb "
                                    ]
                                  }
                                </td>
                                <td>{info["Payment Ammount,$"]}</td>
                                <td>{info["In SL Rupies"]}</td>
                                <td>
                                  {
                                    info[
                                      "performance  of plants/Units as at date 2022/Feb "
                                    ]
                                  }
                                </td>
                                <td>{info["Payment exchange $"]}</td>
                                <td>{info["In SL Rupies_1"]}</td>
                              </tr>
                            );
                          })
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
                <button type="button" className="btn btn-success">
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
                      onClick={() => {
                        setSelectedRow(index);
                        setSelectedQRCodeData(qrCodeData[index]);
                      }}
                    >
                      View Certificates
                    </Button>

                    <Button
                      className="mt-2"
                      variant="success"
                      onClick={() => {
                        const qrCodeElement = document.getElementById(
                          `qr-code-${index}`
                        );
                        console.log("qrCodeElement:", qrCodeElement);
                      }}
                    >
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
        fullscreen={true}
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
                      <div className="row">
                        <div className="col-md-4">
                          <img src={logo} alt="Logo" width="200" height="150" />
                        </div>
                        <div className="col-md-8">{selectedQRCodeData}</div>
                      </div>

                      <div className="w-100"></div>
                      <div className="col">
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
