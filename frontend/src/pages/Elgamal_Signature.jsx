import React, { useState } from "react";
import ElGamalAPI from "../api/modules/elgamal.api";
import CommonAPI from "../api/modules/common.api";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import MathJax from "react-mathjax"; // Import MathJax


const ElGamalSignature = () => {
  const [p, setP] = useState("253832077567910969318490676867875139739"); // Prime number
  const [alpha, setAlpha] = useState(""); // Primitive root of p
  const [a, setA] = useState(""); // Private key
  const [k, setK] = useState("77777177"); // Random number for signing

  const [message, setMessage] = useState(""); // Message to sign
  const [encodedMessage, setEncodedMessage] = useState(""); // Encoded message
  const [r, setR] = useState(""); // Signature component r
  const [s, setS] = useState(""); // Signature component s
  const [isVerified, setIsVerified] = useState(null); // Verification result

  const [keyResult, setKeyResult] = useState(null);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowError = (message) => {
    setError(message);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setError("");
  };

  const handleEncodeMessage = async () => {
    try {
      const result = await CommonAPI.encrypt({ text: message });
      setEncodedMessage(result.encrypted_value);
      setError("");
    } catch (err) {
      handleShowError("Error encoding the message.");
    }
  };

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
      const result = await ElGamalAPI.keyGenerate({ p: p, alpha: alpha, a: a });
      console.log(result);
      setKeyResult(result);
      setError("");
    } catch (err) {
      handleShowError("Error generating keys. Check the input values.");
    }
  };

  const handleSignMessage = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      const result = await ElGamalAPI.sign({
        p,
        alpha,
        a,
        k,
        s: encodedMessage,
      });
      setR(result.y1);
      setS(result.y2);
      console.log(err)
      setError("");
    } catch (err) {
      handleShowError("Error signing the message. Check the input values.");
    }
  };

  const handleVerifySignature = async () => {
    if (!(await handleCheckPrime())) return;
    try {
      const result = await ElGamalAPI.verify({
        p,
        alpha,
        beta: keyResult?.public_key[2],
        y1: r,
        y2: s,
        s: encodedMessage,
      });
      setIsVerified(result.valid_signature);
      setError("");
    } catch (err) {
      handleShowError("Verification failed. Check the signature and inputs.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
    >
      <Typography variant="h3" gutterBottom fontWeight="bold">
        ElGamal Digital Signature
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

      {/* Key Generation Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 1: Key Generation
        </Typography>
        <Typography variant="h6" >
          To generate the keys:
        </Typography>
        <Typography variant="body1" >
          1. Choose a large prime number p.
        </Typography>
        <Typography variant="body1" >
          2. Select a primitive root alpha modulo p.
        </Typography>
        <Typography variant="body1" >
          3. Choose a private key a in range (1, p - 1)
        </Typography>
        <Typography variant="body1" >
          4. Compute the public key with formula as follow:
        </Typography>

        <MathJax.Provider>
          <Typography variant="h6">
          <MathJax.Node formula={`\\beta = \\alpha^a \\mod p`} />
          </Typography>
        </MathJax.Provider>
        <Stack spacing={2}>
          <TextField
            label="p (Prime Number)"
            type="text"
            value={p}
            onChange={(e) => setP(e.target.value)}
            helperText="Enter a prime number."
          />
          <TextField
            label="alpha (Primitive Root)"
            type="text"
            value={alpha}
            onChange={(e) => setAlpha(e.target.value)}
            helperText="Enter or generate the primitive root."
          />
          <Button variant="contained" onClick={handlePrimitiveGenerate}>
            Generate Alpha
          </Button>
          <TextField
            label="a (Private Key)"
            type="text"
            value={a}
            onChange={(e) => setA(e.target.value)}
            helperText="Enter a random private key."
          />
          <Button variant="contained" onClick={handleKeyGenerate}>
            Generate Keys
          </Button>
        </Stack>
        {keyResult && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Private Key:</strong> a = {keyResult.private_key} <br />
            <strong>Public Key:</strong> (p, alpha, beta) = (
            {keyResult.public_key.join(", ")})
          </Typography>
        )}
      </Paper>

      {/* Signing Section */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 2: Sign a Message
        </Typography>
        <Typography variant="body1">
          To sign a message:
        </Typography>
        <Typography variant="body1" >
          1. Encode the message m into a number
        </Typography>
        <Typography variant="body1">
          2. Choose a random number k
        </Typography>
        <Typography variant="body1">
          4. Compute the signature component r, s as:
        </Typography>
        
        <MathJax.Provider>
          <Typography variant="h6">
          <MathJax.Node formula={`r = \\alpha^k \\mod p`} />
          <MathJax.Node formula={`s = (m' - a \\cdot r) \\cdot k^{-1} \\mod (p-1)`} />
          </Typography>
          
        </MathJax.Provider>
        <Stack spacing={2}>
          <TextField
            label="Message to Sign"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            helperText="Enter the message to sign."
          />
          <TextField
            label="Encoded Message"
            type="text"
            value={encodedMessage}
            onChange={(e) => setEncodedMessage(e.target.value)}
            helperText="Get the encoded message."
          />
          <Button variant="contained" onClick={handleEncodeMessage}>
            Encode Message
          </Button>
          <TextField
            label="k (Random Number)"
            type="text"
            value={k}
            onChange={(e) => setK(e.target.value)}
            helperText="Enter a random number. gcd (k, p - 1) = 1"
          />
          <Button variant="contained" onClick={handleSignMessage}>
            Sign Message
          </Button>
        </Stack>
        {r && s && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Signature:</strong> (r, s) = ({r}, {s})
          </Typography>
        )}
      </Paper>

      {/* Verification Section */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Step 3: Verify the Signature
        </Typography>
        <Typography variant="body1">
          To verify the signature:
        </Typography>
        <Typography variant="body1" >
          1. Compute V1
        </Typography>
        <Typography variant="body1">
          2. Compute V2
        </Typography>
        <Typography variant="body1" >
          3. If  V1 = V2 , the signature is valid. Otherwise, it is invalid.
        </Typography>

        <MathJax.Provider>
          <Typography variant="h6" >
          <MathJax.Node formula={`V_1 = \\beta^r \\cdot r^s \\mod p`} />
          <MathJax.Node formula={`V_2 = \\alpha^{m'} \\mod p`} />
          </Typography>
          
        </MathJax.Provider>
        <Stack spacing={2} sx={{ marginTop: 2 }}>
          <Button variant="contained" onClick={handleVerifySignature}>
            Verify Signature
          </Button>
        </Stack>
        {isVerified !== null && (
          <Typography sx={{ marginTop: 2 }}>
            <strong>Verification Result:</strong>{" "}
            {isVerified ? (
              <Typography color="green">Valid</Typography>
            ) : (
              <Typography color="red">Invalid</Typography>
            )}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ElGamalSignature;
