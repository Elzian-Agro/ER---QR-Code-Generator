import React from "react";
import styles from "./Footer.css";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-4">
      <div className={styles["footer-container"]}>
        <div className="footer-row-container"></div>
        <p style={{ textAlign: "center" }}>
          &copy; Copyright to ER{" "}
          <span>
            <img
              src={logo}
              alt="Logo"
              height="30"
              className="d-inline-block-align-top"
            />
          </span>
          and developed by EA
        </p>
      </div>
    </footer>
  );
}

export default Footer;
