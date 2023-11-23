import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login";
import QrGenerator from "./pages/qrGeneratorPage";
import { Auth } from "./AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Auth>
      <Router>
        <Header />
        <Routes>
          <Route path="/ER---QR-Code-Generator" element={<LoginForm />} />
          <Route path="/ER---QR-Code-Generator/qr" element={<QrGenerator />} />
          <Route path="/ER---QR-Code-Generator/unAuth" element={<unAuth />} />
        </Routes>
        <Footer />
      </Router>
    </Auth>
  );
}

export default App;
