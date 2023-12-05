import React, { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSync } from "@fortawesome/free-solid-svg-icons";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { utils, read } from "xlsx";
import { Chart } from "chart.js/auto";
import he from "he";
import "../assets/fontAwesome/fontAwesomeIcon";
import ".././assets/styles/main.css";
import ExcelDataViewer from "../components/ExelDataViewer";
import ModalComponent from "../components/ModalComponent";
import CertificateContent from "../components/CertificateContent";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { EXCEL_FILE_BASE64 } from "../assets/constants/sampleExelData";
import userGuidePDF from "../assets/constants/Accessing_Your_LifeForce_Ledger.pdf"

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
    // Render chart for selected row
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

    if (selectedRow !== null && excelData.length > 0) {
      // Run this code conditionally
      renderChart();
    }
  }, [selectedRow, excelData]);

  // Check if the user is authenticated
  if (!authenticated) {
    return <Navigate to="/ER---QR-Code-Generator/unAuth" />;
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");
    // Navigate to the login page
    navigate("/ER---QR-Code-Generator");
  };

  // Modal open
  const openModal = () => {
    setShowModal(true);
  };

  // Modal close
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle exel file upload
  const file_type = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  const handleChange = (e) => {
    if (e.target.files[0]) {
      if (file_type.includes(e.target.files[0].type)) {
        let reader = new FileReader();
        reader.onload = (e) => {
          const workbook = read(e.target.result);
          if (workbook.SheetNames.length) {
            const sheetData = utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]],
              { header: 1 }
            );

            let nonEmptyRows = [];
            for (let row of sheetData) {
              if (
                Object.values(row).some((val) => val !== "" && val !== null)
              ) {
                nonEmptyRows.push(row);
              } else {
                break; // Break the loop when an empty row is encountered
              }
            }

            setExcelData(nonEmptyRows);
            document.getElementById("excelUrlInput").value = "";
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      } else {
        setExcelError("Please upload only an Excel file");
        setExcelData([]); // Clear the excelData
      }
    }
  };

  const generateQRCodeData = () => {
    // Format date from Excel date serial number
    const formatDateFromExcel = (dateSerialNumber) => {
      // Convert Excel date serial number to milliseconds
      const sheetDate = new Date((dateSerialNumber - 25569) * 86400 * 1000);
      return `${
        sheetDate.getMonth() + 1
      }.${sheetDate.getDate()}.${sheetDate.getFullYear()}`;
    };

    // Decodes HTML entities in a string to their corresponding characters
    const decodeEntities = (encodedString) => 
      he.decode(encodedString);

    let firstRowData = { ...excelData[0] }; // Store the first row's data for coloumn names

    const qrCodes = Object.values(excelData)
      .slice(1)
      .map((info, index) => {
        const uniqueId = Date.now() + index;
        let dataToEncode = "";
        const columnNames = Object.keys(info);

        columnNames.forEach((columnName) => {
          const fieldValue = info[columnName];
          let formattedValue = fieldValue;

          //formatting the date
          if (columnName === "F") {
            formattedValue = formatDateFromExcel(fieldValue);
          }

          // Decoding HTML entities for GPS coordinates
          if (columnName === "G") {
            formattedValue = decodeEntities(fieldValue);
          }

          if (firstRowData[columnName] !== 1) {
            dataToEncode += `${firstRowData[columnName]}: ${formattedValue}\n`;
          }
        });

        setUniqueIds((prevIds) => [...prevIds, uniqueId]);

        return (
          <div key={uniqueId}>
            <QRCodeGenerator qrCodeContent={dataToEncode} />
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
    qrCodeData.forEach((qrCode, index) => {
      const qrCodeElement = document.getElementById(`qr-code-${index}`);
      downloadQRCode(qrCodeElement, `QRCode_${index}.png`);
    });
  };

  const fetchExcelDataFromURL = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const urlData = new Uint8Array(response.data);
      const workBook = XLSX.read(urlData, { type: "array" });

      // Read all rows from the first sheet
      const allData = XLSX.utils.sheet_to_json(
        workBook.Sheets[workBook.SheetNames[0]]
      );

      // Filter out rows with data in column 'A' (or any other column)
      const nonEmptyRows = allData.filter((row) => {
        return row["A"] !== undefined;
      });

      // Exclude the first row
      setExcelData(nonEmptyRows);
    } catch (error) {
      setExcelData([]);
      setExcelError("Error fetching data from URL");
    }
  };

  // Download excel data from URL
  const handleDownload = async () => {
    if (downloadLinkRef.current.value) {
      fetchExcelDataFromURL(downloadLinkRef.current.value);
      document.getElementById("fileInput").value = "";
    }
  };

  // Download sample excel file
  const handleExcelDownload = () => {
    const byteArrays = []; // Create an array to hold the sliced byte arrays

    for (let offset = 0; offset < atob(EXCEL_FILE_BASE64).length; offset += 1024) {
      const chunk = atob(EXCEL_FILE_BASE64).slice(offset, offset + 1024); // Get a chunk of data

      const bytes = new Uint8Array(chunk.length); // Create a Uint8Array for the chunk
      
      for (let i = 0; i < chunk.length; i++) {
        bytes[i] = chunk.charCodeAt(i); // Populate the Uint8Array with data from the chunk
      }

      byteArrays.push(bytes); // Store the chunk as a Uint8Array in the byteArrays array
    }

    const blob = new Blob(byteArrays, { type: 'application/vnd.ms-excel' }); // Create a Blob from the byteArrays array
    saveAs(blob, 'Sample_Excel_Data_Sheet.xlsx'); // Using FileSaver.js to save the file with a specified filename
  };

  const handleDownloadUserGuide = () => {
    // Trigger download of the user guide PDF
    window.open(userGuidePDF, "_blank");
  };

  return (
    <section className="container qr-content">
      <div>
        <div className="qr-generator">
          <div className="container qr-option">
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <h2>Generate QR CODE</h2>
                <button type="button" className="btn btn-danger" onClick={handleLogout} data-testid="btn-loguot">
                    Logout
                </button>
              </div>
              <br />
              <div className="d-flex align-items-center">
                {/* <a href="https://docs.google.com/spreadsheets/d/1gaK91R1nfW3EDc0SgmgPvI0YBdcuy7Y88lKUQYNUAzs/edit?usp=sharing" target="_blank" rel="noreferrer">
                  <button type="button" className="btn btn-primary btn-btn">
                    View Sample Data Sheet
                  </button>
                </a> */}
                <button id="downloadButton" className="btn btn-primary btn-btn" onClick={handleExcelDownload} data-testid="btn-sample-sheet-download">
                  Download Sample DataSheet
                </button>
              </div>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-primary btn-btn"
                  onClick={handleDownloadUserGuide}
                >
                  Download User Guide
                </button>
              </div>
              <br /><hr /><br /> 
              <div className="d-flex align-items-center">
                <label htmlFor="excelUrlInput" style={{ minWidth: '85px' }}>Excel URL :</label>
                <input
                    className="form-control flex-grow-1"
                    id="excelUrlInput"
                    placeholder="Enter Excel Sheet URL"
                    type="text"
                    ref={downloadLinkRef}
                    onChange={handleDownload}
                    data-testid="url-input"
                />
              </div>
              <br /> <br />           
              <div className="d-flex align-items-center">            
                <form className="d-flex">
                    <label className="me-2" htmlFor="fileInput">Upload file XLS :</label>
                    <input
                        type="file"
                        name="fileInput"
                        id="fileInput"
                        onChange={handleChange}
                        data-testid="file-input"
                    />
                </form>          
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary view-btn me-2 btn-btn" onClick={openModal} data-testid="btn-view-data">
                    <FontAwesomeIcon icon={faEye} />
                    View
                </button>
                <button className="btn btn-secondary btn-btn" onClick={generateQRCodeData} data-testid="btn-gen-qr">
                    <FontAwesomeIcon icon={faSync} />
                    Generate QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <ModalComponent
            showModal={showModal}
            closeModal={closeModal}
            screen={true}
            modalHeader={"View Excel Data"}
            modalContent={
              <ExcelDataViewer
                excelData={excelData}
                excelError={excelError}
              />
            }
          />          
        </div>
      
        {qrCodeData.length > 0 && (
          <div>
            <div className="d-flex align-items-center">
              <h2>Your QR Codes</h2>
              <button
                type="button"
                className="btn btn-primary ms-2 btn-btn"
                onClick={downloadAllQrCodes}
                data-testid="btn-download-all-qr"
              >
                Download All
              </button>
            </div>
          
            <hr />
            <div className="container text-center">
              <div className="row">
                  {qrCodeData.map((qrCode, index) => (
                    <div className="col-md-4 mb-4" key={uniqueIds[index]}>
                      <div>
                        <Card>
                          <Card.Body>
                            <div id={`qr-code-${index}`}>
                              {qrCode}
                            </div>
                            {/* <Button
                              className="mt-2 btn-btn"
                              variant="primary"
                              onClick={() => {
                                  setSelectedRow(index);
                                  setSelectedQRCodeData(qrCodeData[index]);
                              }}
                            >
                              View Certificates
                            </Button> */}
                            <Button
                              className="mt-2 btn-btn"
                              variant="success"
                              onClick={() => {
                                  const qrCodeElement = document.getElementById(
                                      `qr-code-${index}`
                                  );
                                  downloadQRCode(
                                      qrCodeElement,
                                      `QRCode_${index}.png`
                                  ); // Provide a filename
                              }}
                            >
                              Download
                            </Button>
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
          </div>
        </div>
        )}
      <br />
      </div>
      <ModalComponent
        dialogClassName="modal-xl"
        showModal={selectedRow !== null}
        closeModal={() => setSelectedRow(null)}
        screen={true}
        modalHeader={"Certificate"}
        modalContent={
          selectedRow !== null &&
          excelData[selectedRow] && (
            <CertificateContent
              excelData={excelData}
              selectedRow={selectedRow}
              selectedQRCodeData={selectedQRCodeData}
            />
          )
        }
      />
    </section>
  );
};

export default QrGenerator;
