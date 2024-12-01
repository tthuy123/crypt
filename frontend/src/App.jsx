import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RSA from "./pages/RSA.jsx"; // Import RSA component from file RSA.jsx
import ElGamal from "./pages/Elgamal.jsx";
import ECC from "./pages/ECC.jsx";
import Homepage from "./pages/Homepage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/elgamal" element={<ElGamal />} />
        <Route path="/rsa" element={<RSA />} />
        <Route path="/ecc" element={<ECC />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
