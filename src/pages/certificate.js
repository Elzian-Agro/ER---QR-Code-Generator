import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import qr from "../assets/sampleqr.jpg";
import certi from "../assets/images/certificate image.png";
import chart from "../assets/images/chart.png";

export default function Certificate() {
  const generatePDF = () => {
    const certificateElement = document.getElementById("certificate");

    html2canvas(certificateElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 size: 210mm x 297mm
      pdf.save("certificate.pdf");
    });
  };

  return (
    <>
      <div id="certificate">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              {/* Left side with QR code and logo */}

              <div className="col-md-6">
                <img src={qr} alt="QR Code" width="200" height="200" />
                <img src={logo} alt="Logo" width="200" height="150" />
              </div>
              <div className="col-sm" style={{ paddingLeft: '400px'}}>
                <img src={certi}></img>
              </div>
              <div class="w-100"></div>
              <div class="col">
                <img src={chart}></img>
              </div>
            </div>

            <div className="col-sm text-center">
              {/* Centered text content */}
              <h2>Payment for Photosynthetic Biomass</h2>
              <h2>
                Sir{" "}
                <h4>
                  <u>Name here</u>
                </h4>{" "}
                made to Mr/Mrs
              </h2>
              <br />
              <br />
              <h4>
                <u>Name here</u>,<u>Name here</u>
              </h4>
              <h4>being a record of the settlement for maintaining</h4>

              <h4>
                <u>Numbers here</u>
              </h4>
              <br />
              <h2>EarthRestoration tree UNIT(s) contracted for 4 years</h2>
              <br />
              <h4>
                <u>Numbers here</u>
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="download-btn">
      <button onClick={generatePDF} className="button-44">Download PDF</button>
      </div>
    </>
  );
}
