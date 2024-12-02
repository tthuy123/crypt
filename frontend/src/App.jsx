import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx"; // Import Layout component
import ECC from "./pages/ECC.jsx";
import RSA from './pages/RSA.jsx';  
import ElGamal from './pages/Elgamal.jsx';
import Homepage from './pages/Homepage.jsx';
import Factors from './pages/Factors.jsx';

import { createTheme, ThemeProvider } from "@mui/material";
import RSA_Signature from "./pages/RSA_Signature.jsx";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Homepage />} />
            <Route path="/elgamal" element={<ElGamal />} />
            <Route path="/rsa" element={<RSA />} />
            <Route path="/rsa-signature" element={<RSA_Signature />} />
            <Route path="/ecc" element={<ECC />} />
            <Route path="/factors" element={<Factors />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
