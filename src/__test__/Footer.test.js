import React from "react";
import { render } from "@testing-library/react";
import Footer from "../components/Footer";

test("renders Footer component", () => {
  const { getByText, getByAltText } = render(<Footer />);

  const copyrightText = getByText(/Copyright to ER/i);
  expect(copyrightText).toBeInTheDocument();

  const logoImage = getByAltText("Logo");
  expect(logoImage).toBeInTheDocument();

});
