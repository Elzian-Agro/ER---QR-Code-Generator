import React from "react";
import { render } from "@testing-library/react";
import ExcelDataViewer from "../components/ExelDataViewer";
import { formatDateFromExcel, decodeEntities} from "../components/ExelDataViewer"

describe("ExcelDataViewer Component", () => {
  const sampleData = [
    ["Landowners Name", "ER registration code", "Planted Date", "GPS Location"],
    ["Saman Kumara", "ER/XXX/XX/XXX", "09.01.2018", "6°45'18.79\"N, 80°56'19.07\"E"],
  ];

  test("renders without crashing", () => {
    render(<ExcelDataViewer excelData={sampleData} />);
  });

  test("displays data correctly", () => {
    const { getByText } = render(<ExcelDataViewer excelData={sampleData} />);
    expect(getByText("Landowners Name")).toBeInTheDocument();
    expect(getByText("Saman Kumara")).toBeInTheDocument();
    expect(getByText("ER registration code")).toBeInTheDocument();
    expect(getByText("ER/XXX/XX/XXX")).toBeInTheDocument();
    expect(getByText("Planted Date")).toBeInTheDocument();
    expect(getByText("09.01.2018")).toBeInTheDocument();
    expect(getByText("GPS Location")).toBeInTheDocument();
    expect(getByText("6°45'18.79\"N, 80°56'19.07\"E")).toBeInTheDocument();
  });

  test("displays error message when no data is provided", () => {
    const { getByText } = render(<ExcelDataViewer excelData={[]} excelError="No data found" />);
    expect(getByText("No data found")).toBeInTheDocument();
  });

  test("formats date correctly", () => {
    expect(formatDateFromExcel(43344)).toEqual("9.1.2018");
  });

  test("decodes HTML entities correctly for GPS location", () => {
    expect(decodeEntities("6&deg;45&apos;18.79&quot;N&comma; 80&deg;56&apos;19.07&quot;E")).toEqual("6°45'18.79\"N, 80°56'19.07\"E");
  });
});
