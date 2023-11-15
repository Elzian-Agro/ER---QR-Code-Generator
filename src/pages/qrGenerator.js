import React, { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useAuth } from "../AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSync } from "@fortawesome/free-solid-svg-icons";
import { Card, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import * as XLSX from "xlsx";
import { utils, read } from "xlsx";
import { Chart } from "chart.js/auto";
import "../assets/fontAwesome/fontAwesomeIcon";
import ".././assets/styles/main.css";
import ExcelDataViewer from "../components/ExelDataViewer";
import ModalComponent from "../components/ModalComponent";
import CertificateContent from "../components/CertificateContent";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { qrCodeConfig } from "../config/qrcode-config";


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

  // Check if the user is authenticated
  if (!authenticated) {
    return <Navigate to="/unAuth" />;
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");
    // Navigate to the login page
    navigate("/");
  };

  // Download pdf
  const generatePDF = () => {
    if (selectedRow !== null && excelData[selectedRow]) {
      html2canvas(document.getElementById("certificate")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 size: 210mm x 297mm
        pdf.save(`certificate_${Date.now()}.pdf`); // Current date is use as UniqueId for file name
      });
    }
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
            setExcelData(utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
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
    const { fields } = qrCodeConfig;
    const qrCodes = Object.values(excelData).map((info, index) => {
      
      // Generate a unique identifier for each row 
      const uniqueId = Date.now() + index; // You can customize this logic

      let dataToEncode = "";
      
      fields.forEach(({ label, key }) => {
        const fieldValue = key.reduce((acc, curr) => acc || info[curr], "");
        dataToEncode += `${label}: ${fieldValue}\n`;
      });

      // Store the unique identifier in the state
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
    qrCodeData.map((qrCode, index) => {
      const qrCodeElement = document.getElementById(`qr-code-${index}`);
      downloadQRCode(qrCodeElement, `QRCode_${index}.png`);
    });
  };

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

  const fetchExcelDataFromURL = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const urlData = new Uint8Array(response.data);
      const workBook = XLSX.read(urlData, { type: "array" });
  
      // Read all rows from the first sheet
      const allData = XLSX.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
  
      // Filter out rows with data in column 'A' (or any other column)
      const nonEmptyRows = allData.filter(row => {
        return row['A'] !== undefined;
      });
  
      // Exclude the first row 
      setExcelData(nonEmptyRows.slice(1));
    } catch (error) {
      setExcelData([]);
      setExcelError("Error fetching data from URL");
    }
  };

  // Download excel data from URL
  const handleDownload = async () => {
    if (downloadLinkRef.current.value) {
      fetchExcelDataFromURL(downloadLinkRef.current.value);
    }
  };

// Format date
  const formatDateFromExcel = (dateSerialNumber) => {
    const sheetDate = new Date((dateSerialNumber - 25569) * 86400 * 1000); // Convert Excel date serial number to milliseconds
    return `${sheetDate.getMonth() + 1}.${sheetDate.getDate()}.${sheetDate.getFullYear()}`;
  };

  // Decodes HTML entities in a string
  const decodeEntities = (encodedString) => 
    (new DOMParser().parseFromString(encodedString, 'text/html')).body.textContent;

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
            <ModalComponent 
              showModal={showModal} 
              closeModal={closeModal}
              screen={true}
              modalHeader={"View Excel Data"}
              modalContent={<ExcelDataViewer excelData={excelData} excelError={excelError} />}
            />
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
      <ModalComponent 
        dialogClassName="modal-xl"
        showModal={selectedRow !== null} 
        closeModal={() => setSelectedRow(null)}
        screen={true}
        modalHeader={"Certificate"}
        modalContent= {selectedRow !== null && excelData[selectedRow] && (
          <CertificateContent
            excelData={excelData}
            selectedRow={selectedRow}
            selectedQRCodeData={selectedQRCodeData}
            generatePDF={generatePDF}
          />
        )}
      />     
    </section>
  );
};

export default QrGenerator;
