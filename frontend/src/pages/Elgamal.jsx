import React, { useState } from "react";
import ElGamalAPI from "../api/modules/elgamal.api";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Paper,
  Alert,
} from "@mui/material";

const ElGamal = () => {
  const [p, setP] = useState(23); // Prime number
  const [alpha, setAlpha] = useState(""); // Primitive root of module p
  const [a, setA] = useState(""); // Random number, private key
  const [x, setX] = useState(""); // Message to encrypt
  const [k, setK] = useState(""); // Random number, encryption number

  const [keyResult, setKeyResult] = useState(null);
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [decryptedResult, setDecryptedResult] = useState(null);

  const [error, setError] = useState("");

  // API Handling
  const handlePrimitiveGenerate = async () => {
    try {
      const result = await ElGamalAPI.primitiveElement({ n: p });
      setAlpha(result.primitive_root);
      setError("");
    } catch (err) {
      setError("Cannot find primitive root. Check the value of p.");
    }
  };

  const handleKeyGenerate = async () => {
    try {
      const result = await ElGamalAPI.keyGenerate({ p, alpha, a });
      setKeyResult(result);
      setError("");
    } catch (err) {
      setError("Error generating keys. Check the input values.");
    }
  };

  const handleEncrypt = async () => {
    try {
      const result = await ElGamalAPI.encrypt({ p, alpha, a, x, k });
      setEncryptedResult(result);
      setError("");
    } catch (err) {
      setError("Cannot encrypt. Check the input values.");
    }
  };

  const handleDecrypt = async () => {
    try {
      if (!encryptedResult) {
        setError("No encrypted data available for decryption.");
        return;
      }
      const result = await ElGamalAPI.decrypt({
        p,
        a,
        y1: encryptedResult.y1,
        y2: encryptedResult.y2,
      });
      setDecryptedResult(result);
      setError("");
    } catch (err) {
      setError("Decryption failed. Check the input data.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        ElGamal Cryptography Demo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {/* Key Generate Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Step 1: KEY GENERATION
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          To generate the key pair, we need:
          <ul>
            <li>
              <strong>p</strong>: A prime number.
            </li>
            <li>
              <strong>alpha</strong>: A primitive root modulo p.
            </li>
            <li>
              <strong>a</strong>: A random private key.
            </li>
          </ul>
          The public and private keys are generated as follows:
          <br />
          <strong>Private Key (a):</strong> A random number.
          <br />
          <strong>Public Key (p, alpha, beta):</strong>
          <br />
          <code>beta = alpha^a mod p</code>
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="p (Prime Number)"
            type="number"
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            helperText="Enter a large prime number for security."
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Alpha (Primitive Root)"
              type="number"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              helperText="Enter or auto-generate the primitive root."
              fullWidth
            />
          </Stack>
          <Button variant="contained" onClick={handlePrimitiveGenerate}>
            Generate Alpha
          </Button>

          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="a (Private Key)"
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              helperText="Enter a random number as your private key."
              fullWidth
            />
          </Stack>
          <Button variant="contained" onClick={handleKeyGenerate}>
            Generate Keys
          </Button>
        </Stack>
        {keyResult && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Private Key:</strong> a = {keyResult.private_key} <br />
            <strong>Public Key:</strong>
            <br />
            p = {keyResult.public_key[0]} <br />
            a = {keyResult.public_key[1]} <br />
            beta = {keyResult.public_key[2]}
          </Typography>
        )}
      </Paper>

      {/* Encryption Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          Step 2: Encryption
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          To encrypt a message, we need:
          <ul>
            <li>
              <strong>x</strong>: The message to encrypt (must be less than p).
            </li>
            <li>
              <strong>k</strong>: A random encryption number.
            </li>
          </ul>
          The encryption is done as follows:
          <br />
          <strong>Encryption:</strong>
          <br />
          <code>y1 = alpha^k mod p</code>
          <br />
          <code>y2 = (beta^k * x) mod p</code>
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="x (Message to Encrypt)"
            type="number"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            helperText="Enter the message to encrypt."
          />
          <TextField
            label="k (Random Encryption Number)"
            type="number"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            helperText="Enter a random number different from previous encryption values."
          />
          <Button variant="contained" onClick={handleEncrypt}>
            Encrypt
          </Button>
        </Stack>
        {encryptedResult && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Encrypted Message:</strong>
            <br />
            <strong>y1:</strong> {encryptedResult.y1}
            <br />
            <strong>y2:</strong> {encryptedResult.y2}
          </Typography>
        )}
      </Paper>

      {/* Decryption Section */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Step 3: Decryption
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          To decrypt the message, we need:
          <ul>
            <li>
              <strong>y1</strong> and <strong>y2</strong>: The encrypted components.
            </li>
            <li>
              <strong>a</strong>: The private key used during encryption.
            </li>
          </ul>
          The decryption is done as follows:
          <br />
          <strong>Decryption:</strong>
          <br />
          <code>x = (y2 * (y1^(-a) mod p)) mod p</code>
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleDecrypt}>
            Decrypt
          </Button>
        </Stack>
        {decryptedResult && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Decrypted Message:</strong> {decryptedResult.decrypted_message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ElGamal;
