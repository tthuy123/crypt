import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CommonAPI from "../api/modules/common.api";

const Generate_prime = () => {
  const [bitCount, setBitCount] = useState(""); // State to store the number of bits
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [primeNumber, setPrimeNumber] = useState(null); // State to store generated prime number

  const handleGeneratePrime = async () => {
    if (!bitCount || isNaN(bitCount) || bitCount <= 0) {
      setError("Please enter a valid number of bits.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true);

    try {
      // Call the API to generate a prime number using the provided number of bits
      const result = await CommonAPI.generate_prime({ n: bitCount });
      if (result && result.result) {
        setPrimeNumber(result.result);
      } else {
        setError("Failed to generate a prime number.");
      }
    } catch (err) {
      setError("An error occurred while generating the prime number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 4,
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Generate Prime
      </Typography>
      <TextField
        label="Number of Bits"
        variant="outlined"
        fullWidth
        value={bitCount}
        onChange={(e) => setBitCount(e.target.value)}
        type="number"
        helperText="Enter the number of bits for generating a prime number"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePrime}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Generate"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {primeNumber !== null && (
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="h6">Generated Prime Number:</Typography>
          <Typography variant="body1" sx={{ width: "90vw", wordBreak: "break-word" }}>
            {primeNumber}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Generate_prime;
