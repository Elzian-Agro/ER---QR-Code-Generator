import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/login";
import QR from "../src/pages/qrGenerator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/qr" element={<QR />} />
      </Routes>
    </Router>
  );
}

export default App;
