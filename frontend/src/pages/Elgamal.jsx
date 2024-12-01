import React, { useState } from "react";
import ElGamalAPI from "../api/modules/elgamal.api";
import { TextField, Button, Box, Typography, Grid, Paper } from "@mui/material";

const Elgamal = () => {
  const [n, setN] = useState(15); // Ví dụ: nhập số n
  const [p, setP] = useState(23); // Ví dụ: nhập p
  const [alpha, setAlpha] = useState(5); // Ví dụ: nhập alpha
  const [a, setA] = useState(6); // Ví dụ: nhập a
  const [x, setX] = useState(10); // Ví dụ: nhập x
  const [k, setK] = useState(3); // Ví dụ: nhập k

  const [factorsResult, setFactorsResult] = useState(null);
  const [primitiveResult, setPrimitiveResult] = useState(null);
  const [keyResult, setKeyResult] = useState(null);
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [decryptedResult, setDecryptedResult] = useState(null);

  const handleFactorsRequest = async () => {
    const data = { n };
    const result = await ElGamalAPI.factors(data);
    setFactorsResult(result);
  };

  const handlePrimitiveRequest = async () => {
    const data = { n };
    const result = await ElGamalAPI.primitiveElement(data);
    setPrimitiveResult(result);
  };

  const handleKeyGenerateRequest = async () => {
    const data = { p, alpha, a };
    const result = await ElGamalAPI.keyGenerate(data);
    setKeyResult(result);
  };

  const handleEncryptRequest = async () => {
    const data = { p, alpha, a, x, k };
    const result = await ElGamalAPI.encrypt(data);
    setEncryptedResult(result);
  };

  const handleDecryptRequest = async () => {
    const data = { p, a, y1: encryptedResult.y1, y2: encryptedResult.y2 };
    const result = await ElGamalAPI.decrypt(data);
    setDecryptedResult(result);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        ElGamal Cryptography Demo
      </Typography>

      {/* Input Fields */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="N"
              fullWidth
              type="number"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="P"
              fullWidth
              type="number"
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Alpha"
              fullWidth
              type="number"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="A"
              fullWidth
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="X"
              fullWidth
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="K"
              fullWidth
              type="number"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Buttons to trigger API calls */}
      <Box sx={{ marginBottom: 3 }}>
        <Button variant="contained" onClick={handleFactorsRequest} sx={{ marginRight: 2 }}>
          Get Factors
        </Button>
        <Button variant="contained" onClick={handlePrimitiveRequest} sx={{ marginRight: 2 }}>
          Get Primitive Root
        </Button>
        <Button variant="contained" onClick={handleKeyGenerateRequest} sx={{ marginRight: 2 }}>
          Generate Keys
        </Button>
        <Button variant="contained" onClick={handleEncryptRequest} sx={{ marginRight: 2 }}>
          Encrypt
        </Button>
        <Button variant="contained" onClick={handleDecryptRequest}>
          Decrypt
        </Button>
      </Box>

      {/* Results */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Results
        </Typography>
        {factorsResult && (
          <Typography>
            <strong>Factors of {n}:</strong> {factorsResult.factors.join(", ")}
          </Typography>
        )}

        {primitiveResult && (
          <Typography>
            <strong>Primitive Root of {n}:</strong> {primitiveResult.primitive_root}
          </Typography>
        )}

        {keyResult && (
          <Typography>
            <strong>Private Key:</strong> {keyResult.private_key}
            <br />
            <strong>Public Key:</strong> {keyResult.public_key}
          </Typography>
        )}

        {encryptedResult && (
          <Typography>
            <strong>Encrypted Message:</strong>
            <br />
            Y1: {encryptedResult.y1}
            <br />
            Y2: {encryptedResult.y2}
          </Typography>
        )}

        {decryptedResult && (
          <Typography>
            <strong>Decrypted Message:</strong> {decryptedResult.decrypted_message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Elgamal;
