import React, { useState } from "react";
import { TextField, Button, Box, Typography, CircularProgress, Alert } from "@mui/material";
import ElGamalAPI from "../api/modules/elgamal.api";

const Factors = () => {
  const [number, setNumber] = useState(""); // Input number
  const [factorsResult, setFactorsResult] = useState(null); // API response for factors
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const handleFactorsRequest = async () => {
    if (!number) {
      setError("Please enter a valid number.");
      return;
    }

    setLoading(true);
    setFactorsResult(null);
    setError("");

    try {
      const data = { n: Number(number) }; // Sending number as `n` in the API request
      const response = await ElGamalAPI.factors(data);
      console.log(response);

      if (response) {
        setFactorsResult(response.factors);
      } else {
        setError(response.error || "An error occurred while fetching factors.");
      }
    } catch (err) {
      setError("Failed to fetch factors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: 2,
        padding: 4,
        maxWidth: "400px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Factor Calculator
      </Typography>
      <TextField
        label="Enter a number"
        variant="outlined"
        fullWidth
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        type="number"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFactorsRequest}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Get Factors"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {factorsResult && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Factors:</Typography>
          <Typography>{factorsResult.join(", ")}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Factors;
