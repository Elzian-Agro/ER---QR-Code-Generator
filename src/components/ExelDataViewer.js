import React from "react";
import PropTypes from "prop-types";

const ExcelDataViewer = ({ excelData, excelError }) => {
  const isLocalFile = Array.isArray(excelData[0]);

  //Format date
  const formatDateFromExcel = (dateSerialNumber) => {
    // Convert Excel date serial number to milliseconds
    const sheetDate = new Date((dateSerialNumber - 25569) * 86400 * 1000);
    return `${
      sheetDate.getMonth() + 1
    }.${sheetDate.getDate()}.${sheetDate.getFullYear()}`;
  };

  // Decodes HTML entities in a string
  const decodeEntities = (encodedString) =>
    new DOMParser().parseFromString(encodedString, "text/html").body
      .textContent;

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          {excelData.length ? (
            <tr>
              {isLocalFile
                ? excelData[0].map((columnName, index) => (
                    <th key={index}>{columnName}</th>
                  ))
                : Object.keys(excelData[0])
                    .slice(1)
                    .map((columnName, index) => (
                      <th key={index}>{excelData[0][columnName]}</th>
                    ))}
            </tr>
          ) : (
            <tr>
              <th>{excelError || "No data found"}</th>
            </tr>
          )}
        </thead>
        <tbody>
          {Object.values(excelData)
            .slice(1)
            .map((info, rowIndex) => (
              <tr key={rowIndex}>
                {isLocalFile
                  ? info.map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))
                  : Object.values(info)
                      .slice(1)
                      .map((value, colIndex) => (
                        <td key={colIndex}>
                          {colIndex === 4
                            ? formatDateFromExcel(value)
                            : colIndex === 5
                            ? decodeEntities(value)
                            : value}
                        </td>
                      ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

ExcelDataViewer.propTypes = {
  excelData: PropTypes.array.isRequired,
  excelError: PropTypes.string,
};

export default ExcelDataViewer;
