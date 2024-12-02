import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx"; // Import Layout component
import ECC from "./pages/ECC.jsx";
import RSA from "./pages/RSA.jsx";
import ElGamal from "./pages/Elgamal.jsx";
import ECDSA from "./pages/ECDSA.jsx";
import Homepage from "./pages/Homepage.jsx";
import Factors from "./pages/Factors.jsx";

import { createTheme, ThemeProvider } from "@mui/material";

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
            <Route path="/ecc" element={<ECC />} />
            <Route path="/factors" element={<Factors />} />
            <Route path="/ecdsa" element={<ECDSA />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
