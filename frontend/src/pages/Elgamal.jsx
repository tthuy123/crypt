import React, { useState } from "react";
import ElGamalAPI from "../api/modules/elgamal.api";
import CommonAPI from "../api/modules/common.api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const ElGamal = () => {
  const [p, setP] = useState("253832077567910969318490676867875139739"); // Prime number
  const [alpha, setAlpha] = useState(""); // Primitive root of module p
  const [a, setA] = useState(""); // Random number, private key
  const [k, setK] = useState(""); // Random number, encryption number

  const [message, setMessage] = useState(""); // Message to encrypt
  const [x, setX] = useState(""); // number that encrypt from message
  const [decryptedMessage, setDecryptedMessage] = useState(""); // Decrypted message

  const [keyResult, setKeyResult] = useState(null);
  const [encryptedResult, setEncryptedResult] = useState(null);
  const [decryptedResult, setDecryptedResult] = useState(null);

  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const key_generate_formula = `
    \\beta  =  \\alpha^{a} \\mod p
`;

  const encrypt_formula1 = `
    y1 = \\alpha^k \\mod p
  `;
  const encrypt_formula2 = `
    y2 = \\beta^k \\cdot x \\mod p
  `;
  const decrypt_formula = `
    x = \\left( y_2 \\cdot \\left( y_1^{-1} \\right) \\right) \\mod p
  `;

  const handleShowError = (message) => {
    setError(message);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setError("");
  };

  // API Handling

  const handleCheckPrime = async () => {
    try {
      const result = await CommonAPI.checkPrime({ n: p });
      if (!result.is_prime) {
        handleShowError(`The value of p (${p}) is not a prime number.`);
        return false;
      }
      setError("");
      return true;
    } catch (err) {
      handleShowError("Error checking if p is a prime number.");
      return false;
    }
  };
  const handleEncryptMessage = async () => {
    try {
      const result = await CommonAPI.encrypt({ text: message });
      setX(result.encrypted_value);
      setError("");
    } catch (err) {
      handleShowError("Cannot encrypt message. Check the input values.");
    }
  };

  const handleDecryptMessage = async () => {
    try {
      const result = await CommonAPI.decrypt({ number: x });
      setDecryptedMessage(result.decrypted_value);
      setError("");
    } catch (err) {
      handleShowError("Cannot decrypt message. Check the input values.");
    }
  };
  const handlePrimitiveGenerate = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      const result = await ElGamalAPI.primitiveElement({ n: p });
      setAlpha(result.primitive_root);
      setError("");
    } catch (err) {
      handleShowError("Cannot find primitive root. Check the value of p.");
    }
  };

  const handleKeyGenerate = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      console.log(p, alpha, a);
      const result = await ElGamalAPI.keyGenerate({ p: p, alpha, a });
      setKeyResult(result);
      console.log(result);
      setError("");
    } catch (err) {
      handleShowError("Error generating keys. Check the input values.");
    }
  };

  const handleEncrypt = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      const result = await ElGamalAPI.encrypt({
        p: p,
        alpha: alpha,
        a: a,
        x: x,
        k: k,
      });
      setEncryptedResult(result);
      setError("");
    } catch (err) {
      handleShowError("Cannot encrypt. Check the input values.");
    }
  };

  const handleDecrypt = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      if (!encryptedResult) {
        handleShowError("No encrypted data available for decryption.");
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
      handleShowError("Decryption failed. Check the input data.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h3" gutterBottom fontWeight="bold">
          ElGamal Cryptography
        </Typography>
      </Box>
      {/* Snackbar for errors */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Key Generate Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          position="relative"
        >
          Step 1: Key Generation
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          To generate the key pair, we need:
          <ul>
            <li>
              <strong>p</strong>: a prime number.
            </li>
            <li>
              <strong>alpha</strong>: a primitive root modulo p.
            </li>
            <li>
              <strong>a</strong>: a random private key.
            </li>
          </ul>
          The public and private keys are generated as follows:
          <br />
          <strong>Private Key (a):</strong> a random number.
          <br />
          <MathJaxContext>
            <strong>Public Key (p, alpha, beta): </strong>
            <MathJax>{`\\[${key_generate_formula}\\]`}</MathJax>
          </MathJaxContext>
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="p (Prime Number)"
            type="text"
            value={p}
            multiline
            onChange={(e) => {
              setP(e.target.value);
            }}
            helperText="Enter a large prime number for security."
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="alpha (Primitive Root)"
              type="text"
              value={alpha}
              onChange={(e) => setAlpha(e.target.value)}
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
              type="text"
              value={a}
              onChange={(e) => setA(e.target.value)}
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
            <strong>Public Key:</strong> (p, alpha, beta) = (
            {keyResult.public_key[0]}, {keyResult.public_key[1]},{" "}
            {keyResult.public_key[2]})
          </Typography>
        )}
      </Paper>

      {/* Encryption Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 2: Encryption
        </Typography>
        <MathJaxContext>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            To encrypt a message, we need:
            <ul>
              <li>
                <strong>x</strong>: The message to encrypt (must be less than
                p).
              </li>
              <li>
                <strong>k</strong>: A random encryption number.
              </li>
            </ul>
            The encryption is done as follows:
            <br />
            <MathJax>{`\\[${encrypt_formula1}\\]`}</MathJax>
            <MathJax> {`\\[${encrypt_formula2}\\]`}</MathJax>
          </Typography>
        </MathJaxContext>

        <Stack spacing={2}>
          <TextField
            label="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            helperText="Enter the message to encrypt."
          />
          <TextField
            label="x (Message to Encrypt)"
            type="text"
            value={x}
            onChange={(e) => setX(e.target.value)}
            helperText="Enter the message to encrypt."
          />
          <Button variant="contained" onClick={handleEncryptMessage}>
            Encode Message
          </Button>
          <TextField
            label="k (Random Encryption Number)"
            type="text"
            value={k}
            onChange={(e) => setK(e.target.value)}
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
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 3: Decryption
        </Typography>
        <MathJaxContext>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            To decrypt the message, we need:
            <ul>
              <li>
                <strong>y1</strong> and <strong>y2</strong>: The encrypted
                components.
              </li>
              <li>
                <strong>a</strong>: The private key used during encryption.
              </li>
            </ul>
            The decryption is done as follows:
            <br />
            <MathJax>{`\\[${decrypt_formula}\\]`}</MathJax>
          </Typography>
        </MathJaxContext>

        <Stack spacing={2}>
          <Button variant="contained" onClick={handleDecrypt}>
            Decrypt to number
          </Button>
          <Button variant="contained" onClick={handleDecryptMessage}>
            Decrypt to message
          </Button>
        </Stack>
        {decryptedResult && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Decrypted Number:</strong>{" "}
            {decryptedResult.decrypted_message}
          </Typography>
        )}
        {decryptedMessage && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Decrypted Text:</strong> {decryptedMessage}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ElGamal;
