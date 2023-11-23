import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

describe("Header Component", () => {
    test("renders header", () => {
        render(
        <Router>
            <Header />
        </Router>
        );
        
         // Check if the logo is rendered
        expect(screen.getByAltText("Logo")).toBeInTheDocument();
        
        // Check if the social media icons are rendered
        expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
        expect(screen.getByLabelText("Youtube")).toBeInTheDocument();
        expect(screen.getByLabelText("Linkedin")).toBeInTheDocument();
    });

    test("logo is linked to loging page", () => {
        render(
        <Router>
            <Header />
        </Router>
        );

        // Check if the logo links to the homepage
        const logoLink = screen.getByAltText("Logo").closest("a");
        expect(logoLink).toBeInTheDocument();
        expect(logoLink).toHaveAttribute("href", "/ER---QR-Code-Generator");
    });
});
