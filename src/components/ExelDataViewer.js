import React from 'react';

const ExcelDataViewer = ({ excelData, excelError }) => {
  // Store temporary data in an object
  const tempData = {};

  //Format date
  const formatDateFromExcel = (dateSerialNumber) => {
    // Convert Excel date serial number to milliseconds
    const sheetDate = new Date((dateSerialNumber - 25569) * 86400 * 1000); 
    return `${sheetDate.getMonth() + 1}.${sheetDate.getDate()}.${sheetDate.getFullYear()}`;
  };

  // Decodes HTML entities in a string
  const decodeEntities = (encodedString) => 
    (new DOMParser().parseFromString(encodedString, 'text/html')).body.textContent;

  return (
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
                  tempData.name = info["Farmers Name "] || info["B"] ;
                  tempData.registrationNo = info["Registration No"] || info["C"];
                  tempData.noOfPlants = info["No of plants/Units "] || info["AC"];
                  tempData.performance2021 = info["performance  of plants/Units as at date 2021/Feb "] || info["AH"];
                  tempData.paymentInDoller = info["Payment Ammount,$"] || info["AI"] ;
                  tempData.paymentInSL = info["In SL Rupies"] || info["AJ"] ;
                  tempData.performance2022 = info["performance  of plants/Units as at date 2022/Feb "] || info["AK"]
                  tempData.paymentInDoller2022 = info["Payment exchange $"] || info["AL"];
                  tempData.paymentInSL2022 = info["In SL Rupies_1"] || info["AM"];
                } else {
                  info["Farmers Name "] = tempData.name;
                  info["Registration No"] =  tempData.registrationNo;
                  info["No of plants/Units "] = tempData.noOfPlants;
                  info["performance  of plants/Units as at date 2021/Feb "] = tempData.performance2021;
                  info["Payment Ammount,$"] = tempData.paymentInDoller;
                  info["In SL Rupies"] = tempData.paymentInSL;
                  info["performance  of plants/Units as at date 2022/Feb "] = tempData.performance2022;
                  info["Payment exchange $"] = tempData.paymentInDoller2022;
                  info["In SL Rupies_1"] = tempData.paymentInSL2022;
                }                
              }
              
              return (
                <tr key={info}>
                  <td>{info["Ref No"] || info["A"]}</td>
                  <td>{info["Farmers Name "] || info["B"]}</td>
                  <td>{info["Registration No"] || info["C"]}</td>
                  <td>{info["LF UNIT NO"] || info["D"]}</td>
                  <td>{info["Inestors Details"] || info["E"]}</td>
                  <td>{info["Unit Established  Date "] || formatDateFromExcel(info["F"])}</td>
                  <td>{decodeEntities(info["GPS"] || info["G"])}</td>
                  <td>{info[" Species"] || info["H"]}</td>
                  <td>{info["PB Accumilation/Grms(Year1)"] || info["I"]}</td>
                  <td>{info["Dynamic Carbon Capturing, Grams of C(Year1)"] || info["J"]}</td>
                  <td>{info["O2 Production/Liters(Year1)"] || info["K"]}</td>
                  <td>{info["H2O Production/Liters(Year1)"] || info["L"]}</td>
                  <td>{info["PB Accumilation/Grms(Year2)"] || info["M"]}</td>
                  <td>{info["Dynamic Carbon Capturing, Grams of C(Year2)"] || info["N"]}</td>
                  <td>{info["O2 Production/Liters(Year2)"] || info["O"]}</td>
                  <td>{info["H2O Production/Liters(Year2)"] || info["P"]}</td>
                  <td>{info["PB Accumilation/Grms(Year3)"] || info["Q"]}</td>
                  <td>{info["Dynamic Carbon Capturing, Grams of C(Year3)"] || info["R"]}</td>
                  <td>{info["O2 Production/Liters(Year3)"] || info["S"]}</td>
                  <td>{info["H2O Production/Liters(Year3)"] || info["T"]}</td>
                  <td>{info["PB Accumilation/Grms(Year4)"] || info["U"]}</td>
                  <td>{info[ "Dynamic Carbon Capturing, Grams of C(Year4)"] || info["V"]}</td>
                  <td>{info["O2 Production/Liters(Year4)"] || info["W"]}</td>
                  <td>{info["H2O Production/Liters(Year4)"] || info["X"]}</td>
                  <td>{info["PB Accumilation/Grms(summery)"] || info["Y"]}</td>
                  <td>{info["Dynamic Carbon Capturing, Grams of C(summery)"] || info["Z"]}</td>
                  <td>{info["O2 Production/Liters(summery)"] || info["AA"]}</td>
                  <td>{info["H2O Production/Liters(summery)"] || info["AB"]}</td>
                  <td>{info["No of plants/Units "] || info["AC"]}</td>
                  <td>{info["performance  of plants/Units as at date 2019/Feb "] || info["AD"]}</td>
                  <td>{info["Payment "] || info["AE"]}</td>
                  <td>{info["performance  of plants/Units as at date 2020/Feb "] || info["AF"]}</td>
                  <td>{info["Payment _1"] || info["AG"]}</td>
                  <td>{info["performance  of plants/Units as at date 2021/Feb "] || info["AH"]}</td>
                  <td>{info["Payment Ammount,$"] || info["AI"]}</td>
                  <td>{info["In SL Rupies"] || info["AJ"]}</td>
                  <td>{info["performance  of plants/Units as at date 2022/Feb "] || info["AK"]}</td>
                  <td>{info["Payment exchange $"] || info["AL"]}</td>
                  <td>{info["In SL Rupies_1"] || info["AM"]}</td>
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
  );
};

export default ExcelDataViewer;
