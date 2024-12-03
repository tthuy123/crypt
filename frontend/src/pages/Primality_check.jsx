import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CommonAPI from "../api/modules/common.api";

const Primality_check = () => {
  const [number, setNumber] = useState(""); // Input number
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [check, setCheck] = useState("");
  const [hasChecked, setHasChecked] = useState(false); // New state to track if checked
  useEffect(() => {
    setHasChecked(false);
  }, [number]);
  const handlePrimeCheck = async () => {
    if (!number) {
      setError("Please enter a number.");
      return;
    }
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const result = await CommonAPI.checkPrime({ n: number });
      console.log(result);
      setCheck(result.is_prime);
    } catch (err) {
      setError("An error occurred while checking the number.");
    } finally {
      setLoading(false);
    }
    setHasChecked(true)
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: 2,
        padding: 4,
        maxWidth: "500px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Primality Testing
      </Typography>
      <TextField
        label="Enter a number"
        variant="outlined"
        fullWidth
        value={number}
        multiline
        onChange={(e) => setNumber(e.target.value)}
        type="number"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrimeCheck}
        disabled={loading}
        fullWidth
      >
        Check
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {hasChecked && number && (
        <Box>
          This number is{" "}
          <Typography
            component="span"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            {check ? "a prime" : "not a prime"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Primality_check;
