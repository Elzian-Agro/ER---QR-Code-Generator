import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login"; // Update the import path
// import RegisterForm from "./pages/RegisterForm"; 
import QrGenerator from "./pages/qrGenerator";
import { Auth } from './AuthContext';

function App() {
  return (
    <Auth>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/qr" element={<QrGenerator />} />
          
        </Routes>
      </Router>
    </Auth>
  );
}

export default App;
