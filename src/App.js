import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login";
import QrGenerator from "./pages/qrGenerator";
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
          <Route path="/ER---QR-Code-Generator" element={<LoginForm />} />
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
