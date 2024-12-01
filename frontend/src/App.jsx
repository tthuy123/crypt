import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RSA from './pages/RSA.jsx';  // Import RSA component from file RSA.jsx
import ElGamal from './pages/Elgamal.jsx';
import Homepage from './pages/Homepage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/elgamal" element={<ElGamal />} />
        <Route path="/rsa" element={<RSA />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
