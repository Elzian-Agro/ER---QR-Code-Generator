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
import { utils,read} from 'xlsx';
import { useState } from "react";

const QrGenerator = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();

  // if (!authenticated) {
  //   return <Navigate to="/unAuth" />;
  // }

  const handleLogout = () => {
    localStorage.removeItem("rememberedUsername");
    localStorage.removeItem("rememberedPassword");

    navigate("/login");
  };

    const [excelData,setExcelData] = useState([])
    const [excelError,setExcelError] = useState('')
    const file_type=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel']
    const handleChange = (e)=>{
    const selected_file=e.target.files[0];
    if(selected_file){
      if(selected_file && file_type.includes(selected_file.type)){
let reader=new FileReader();
reader.onload=(e)=>{
  const workbook=read(e.target.result);
  const sheet=workbook.SheetNames;
  if(sheet.length){
    const data=utils.sheet_to_json(workbook.Sheets[sheet[0]]);
    setExcelData(data);
  }
}
reader.readAsArrayBuffer(selected_file)
      }else{
        setExcelError('please upload only excel file')
        setExcelData([])
      }
      
    }
    }

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
                <input type="file" name="fileInput" id="fileInput" onChange={handleChange}/>
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
        <div>
          <table>
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
              </tr>
            </thead>
            <tbody>
              {              
excelData.length
?
excelData.map((info)=>(
  <tr>
    <td>{info.Ref_No}</td>
    <td>{info.Name}</td>
    <td>{info.Registration_No}</td>
    <td>{info.LF_UNIT_NO}</td>
    <td>{info.Unit_Established_Date}</td>
    <td>{info.GPS}</td>
    <td>{info.Species}</td>
    <td>{info.PB_Accumilation_Grms_1_years}</td>
    <td>{info.Dynamic_Carbon_Capturing_Grams_of_C_1_years}</td>
    <td>{info.O2_Production_Liters_1_years}</td>
    <td>{info.H2O_Production_Liters_1_years}</td>
    <td>{info.PB_Accumilation_Grms_2_years}</td>
    <td>{info.Dynamic_Carbon_Capturing_Grams_of_C_2_years}</td>
    <td>{info.O2_Production_Liters_2_years}</td>
    <td>{info.H2O_Production_Liters_2_years}</td>
    <td>{info.PB_Accumilation_Grms_3_years}</td>
    <td>{info.Dynamic_Carbon_Capturing_Grams_of_C_3_years}</td>
    <td>{info.O2_Production_Liters_3_years}</td>
    <td>{info.H2O_Production_Liters_3_years}</td>
    <td>{info.PB_Accumilation_Grms_4_years}</td>
    <td>{info.Dynamic_Carbon_Capturing_Grams_of_C_4_years}</td>
    <td>{info.O2_Production_Liters_4_years}</td>
    <td>{info.H2O_Production_Liters_4_years}</td>
  </tr>
))
:
excelError.length ? <tr>{excelError}</tr>:

<tr>No user data is present</tr>}
            </tbody> 
          </table>
        </div>
      </div>
    </section>
  );
};

export default QrGenerator;
