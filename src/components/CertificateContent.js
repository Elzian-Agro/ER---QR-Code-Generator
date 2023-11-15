import React from "react";
import logo from "../assets/images/logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PropTypes from 'prop-types';

const CertificateContent = ({ excelData, selectedRow, selectedQRCodeData }) => {

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

    return (
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
                                        <h5>made to</h5>
                                    Mr/Mrs
                                </h2>
                                <br /><br />
                                <h4>
                                    <u>Name here</u>,<u>Name here</u>
                                </h4>
                                <h4>
                                    being a record of the settlement<br />
                                    for maintaining
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
    );
};

CertificateContent.propTypes = {
  excelData: PropTypes.array.isRequired,
  selectedRow: PropTypes.number,
  selectedQRCodeData: PropTypes.object,
};

export default CertificateContent;