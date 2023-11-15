import React from "react";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-4">
      <p>
        &copy; Copyright to ER{" "}
        <span>
          <img
            src={logo}
            alt="Logo"
            height="30"
            className="d-inline-block"
          />
        </span>
        {" "}and developed by EA
      </p>
    </footer>
  );
}

export default Footer;