import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="Logo"
            height="30"
            className="d-inline-block"
          />
        </Link>
        <div className="d-flex gap-3 text-white">
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faYoutube} />
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
      </div>
    </nav>
  );
};

export default Header;