import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login"; // Update the import path
// import RegisterForm from "./pages/RegisterForm";
import QrGenerator from "./pages/qrGenerator";
import unAuth from "./pages/unauthorized";
import { Auth } from "./AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Certificate from "./pages/certificate";

function App() {
  return (
    <Auth>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/qr" element={<QrGenerator />} />
          <Route path="/unAuth" element={<unAuth />} />
          <Route path="/certificate" element={<Certificate />} />
        </Routes>
        <Footer />
      </Router>
    </Auth>
  );
}

export default App;
