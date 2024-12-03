import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material";
import ECCApi from "../api/modules/ecc.api";
import ECDSAApi from "../api/modules/ecdsa.api";
import CommonApi from "../api/modules/common.api";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const ECDSA = () => {
  const [error, setError] = useState("");
  const handleShowError = (message) => {
    setError(message);
  };
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [p, setP] = useState("");

  const [isPPrime, setIsPPrime] = useState(null);
  const [isTheNumberOfCurvePointsPrime, setIsTheNumberOfCurvePointsPrime] =
    useState(null);
  const [theNumberOfCurvePoints, setTheNumberOfCurvePoints] = useState(null);

  const [generatorPointX, setGeneratorPointX] = useState("");
  const [generatorPointY, setGeneratorPointY] = useState("");
  const [n, setN] = useState(
    "3618502788666131213697322783095070105526743751716087489154079457884512865583"
  );

  const [d, setD] = useState("");
  const [qX, setQX] = useState("");
  const [qY, setQY] = useState("");

  const [message, setMessage] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");

  const [k, setK] = useState("");
  const [isGeneratorPointOnCurve, setIsGeneratorPointOnCurve] = useState(null);
  const [isKValid, setIsKValid] = useState(null);

  const handleCheckIfPPrime = async () => {
    try {
      const result = await CommonApi.checkPrime({ n: p });
      setIsPPrime(result.is_prime);
      setError("");
    } catch (err) {
      handleShowError("Cannot check if p is prime", err.message);
    }
  };

  const handleCheckParameters = async () => {
    handleCheckIfPPrime();
    handleCalculateTheNumberOfCurvePoints();
    handleCheckIfTheNumberOfCurvePointsPrime();
  };

  const handleCalculateTheNumberOfCurvePoints = async () => {
    try {
      const result = await ECCApi.curve_points({ a, b, p });
      setTheNumberOfCurvePoints(result.result);
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot calculate the number of curve points",
        err.message
      );
    }
  };

  const handleCheckIfTheNumberOfCurvePointsPrime = async () => {
    try {
      const numberOfPoints = await ECCApi.curve_points({ a, b, p });
      const result = await CommonApi.checkPrime({ n: numberOfPoints.result });
      setIsTheNumberOfCurvePointsPrime(result.is_prime);
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot check if the number of curve points is prime",
        err.message
      );
    }
  };

  const handleCheckIfGeneratorPointOnCurve = async () => {
    try {
      const result = await ECCApi.isPointOnCurve({
        a,
        b,
        p,
        pX: generatorPointX,
        pY: generatorPointY,
      });

      setIsGeneratorPointOnCurve(result.result);
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot check if generator point is on curve",
        err.message
      );
    }
  };

  const handleCalculateQ = async () => {
    try {
      const result = await ECCApi.pointMultiply({
        a,
        b,
        p,
        pX: generatorPointX,
        pY: generatorPointY,
        k: d,
      });

      setQX(result.result.x);
      setQY(result.result.y);
      setError("");
    } catch (err) {
      handleShowError("Cannot calculate P", err.message);
    }
  };

  const handleCheckK = async () => {
    try {
      const result = await ECDSAApi.isKValid({
        pX: generatorPointX,
        pY: generatorPointY,
        n,
        d,
        a,
        b,
        p,
        message: hashedMessage,
        k,
      });
      setIsKValid(result.result);
      setError("");
    } catch (err) {
      handleShowError("Cannot check if k is valid", err.message);
    }
  };

  const handleHashMessage = async () => {
    try {
      const result = await ECDSAApi.hash_message({ message });
      setHashedMessage(result.hashed_message);
      setError("");
      console.log(hashedMessage);
    } catch (err) {
      handleShowError("Cannot hash message", err.message);
    }
  };

  const handleSign = async () => {
    try {
      const result = await ECDSAApi.sign({
        pX: generatorPointX,
        pY: generatorPointY,
        a,
        b,
        p,
        d,
        message,
        k,
        n,
      });

      setR(result.signature["r"]);
      setS(result.signature["s"]);

      setError("");
    } catch (err) {
      handleShowError("Cannot hash message", err.message);
    }
  };

  const handleVerify = async () => {
    try {
      const result = await ECDSAApi.verify({
        pX: generatorPointX,
        pY: generatorPointY,
        a,
        b,
        p,
        qX,
        qY,
        message,
        r,
        s,
        n,
      });

      setError("");
    } catch (err) {
      handleShowError("Cannot hash message", err.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={5}>
        <Stack spacing={2} sx={{ padding: 3 }}>
          <Typography
            textAlign="center"
            variant="h3"
            fontWeight="bold"
            gutterBottom
          >
            ECDSA
          </Typography>
          <Typography component="p">
            The Elliptic Curve Digital Signature Algorithm (ECDSA) is a
            cryptographic protocol used for digital signatures. It is a variant
            of the Digital Signature Algorithm (DSA) that operates on elliptic
            curve groups, offering equivalent security with significantly
            smaller key sizes. This efficiency makes ECDSA an essential choice
            for modern systems, particularly in environments with constrained
            resources, such as mobile devices, IoT devices, and blockchain
            applications.
          </Typography>
          {/* Input Fields */}
          <Paper sx={{ padding: 3, marginBottom: 3 }}>
            {/* Elliptic curve parameters */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 1: Set up your elliptic curve parameters.
            </Typography>
            <Stack p={2} spacing={2}>
              <TextField
                label="a"
                fullWidth
                type="text"
                value={a ?? ""}
                onChange={(e) => setA(e.target.value)}
              />
              <TextField
                label="b"
                fullWidth
                type="text"
                value={b}
                onChange={(e) => {
                  setB(e.target.value);
                }}
              />
              <TextField
                label="p"
                fullWidth
                type="text"
                value={p ?? ""}
                onChange={(e) => setP(e.target.value)}
              />

              <Button variant="contained" onClick={handleCheckParameters}>
                Check if parameters are valid:{" "}
                {isPPrime && isTheNumberOfCurvePointsPrime ? "Yes" : "No"}
              </Button>
              <Typography>
                The number p is: <b>{isPPrime ? "Prime" : "Not Prime"}</b>
              </Typography>
              <Typography>
                The number of the points on the elliptic curve is:{" "}
                <b>{theNumberOfCurvePoints}</b> -{" "}
                {isTheNumberOfCurvePointsPrime ? "Prime" : "Not Prime"}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 2: Choose a generator point.
            </Typography>

            {/* Generator point */}
            <Stack p={2} spacing={2}>
              <Typography component="p">
                For the elliptic curves over finite fields, the ECC
                cryptosystems define a special pre-defined (constant) EC point
                called generator point G (base point), which can generate any
                other point in its subgroup over the elliptic curve by
                multiplying G by some integer in the range [0...n].
              </Typography>
              <Typography>
                The number n is called "order" of the cyclic subgroup generated
                by G.{" "}
                <strong>
                  The order of the generator point G should be a prime number
                </strong>
                .
              </Typography>
              <TextField
                label="Generator Point x"
                fullWidth
                type="text"
                value={generatorPointX}
                onChange={(e) => setGeneratorPointX(e.target.value)}
              />
              <TextField
                label="Generator Point y"
                fullWidth
                type="text"
                value={generatorPointY}
                onChange={(e) => setGeneratorPointY(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleCheckIfGeneratorPointOnCurve}
              >
                Check if this point is on the curve & If so, calculate its
                order.
              </Button>
              <Typography>
                The generator point is on the curve:{" "}
                <strong>
                  {isGeneratorPointOnCurve !== null
                    ? isGeneratorPointOnCurve
                      ? "Yes"
                      : "No"
                    : ""}
                </strong>
              </Typography>

              {isGeneratorPointOnCurve ? (
                <Typography>
                  The order of the generator point is: <strong>n = {n}</strong>
                </Typography>
              ) : (
                ""
              )}
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 3: Choose a private key.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                The private key is a randomly chosen integer in the range [1,
                n-1].
              </Typography>
              <TextField
                label="Private key d"
                fullWidth
                type="text"
                value={d}
                onChange={(e) => setD(e.target.value)}
              />

              <Button variant="contained" onClick={handleCalculateQ}>
                Generate Public Key
              </Button>
              <Typography textOverflow="anywhere">
                {qX && qY ? (
                  <>
                    The public key is <br /> <b>Q = {`(${qX}, ${qY})`}</b>
                  </>
                ) : (
                  ""
                )}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Private Key, Public Key and the Generator Point in ECDSA.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography gutterBottom>
                After the abovementioned steps, in ECDSA we have:
              </Typography>
              <ul>
                <li>
                  <Typography gutterBottom>
                    Elliptic curve parameters:{" "}
                    {a && b && p ? (
                      <b>
                        <br />a = {a}, <br />b = {b}, <br />p = {p}
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Generator point: <br />
                    {generatorPointX && generatorPointY ? (
                      <b>
                        G = ({generatorPointX}, {generatorPointY})
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Private key: <br />
                    {d ? <b>d = {d}</b> : ""}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Public key: <br />
                    {qX && qY ? (
                      <b>
                        {" "}
                        Q = ({qX}, {qY})
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                </li>
              </ul>

              <Typography gutterBottom>
                This private key is kept secret and will be used for signing
                messages.
              </Typography>
              <Typography gutterBottom>
                The public key is shared publicly and will be used for verifying
                signatures.
              </Typography>
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 4: Signing a Message.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                To create a digital signature for a message, the signer performs
                the following:
              </Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Step 4.1: Hash the message
              </Typography>
              <TextField
                label="Message"
                fullWidth
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="contained" onClick={handleHashMessage}>
                Hash the message!
              </Button>

              {hashedMessage ? (
                <Typography>
                  The hashed message is: <br />
                  <b>{hashedMessage}</b>
                </Typography>
              ) : (
                ""
              )}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Step 4.2: Generate a random number k.
              </Typography>
              <Stack p={2} spacing={2}>
                <Typography>
                  The random number k is generated in the range [1, n-1]. In
                  addition, it should also satisfy the following conditions:
                </Typography>
                {/* TODO: insert the conditions */}
                {/* <MathJax.Provider>
                  <MathJax.Node formula={kValidationSteps}/>
                </MathJax.Provider>
               */}
                <TextField
                  label="Random number k"
                  fullWidth
                  type="text"
                  value={k ?? ""}
                  onChange={(e) => setK(e.target.value)}
                />
                <Button variant="contained" onClick={handleCheckK}>
                  Check if K satisfies the abovementioned conditions
                </Button>
                <Typography>
                  The random number k is valid:{" "}
                  <strong>
                    {isKValid !== null ? (isKValid ? "Yes" : "No") : ""}
                  </strong>
                </Typography>
              </Stack>
              <Stack p={2} spacing={2}>
                <Button variant="contained" onClick={handleSign}>
                  Sign your message!
                </Button>
                <Typography>
                  Your signature is{" "}
                  {r && s ? (
                    <>
                      (r, s) ={" "}
                      <b>
                        ({r}, {s})
                      </b>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
              </Stack>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 5: Verify the signature.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                To verify a signature, the verifier performs the following:
              </Typography>
              <Button variant="contained" onClick={handleVerify}>
                Verify the signature!
              </Button>
              <Typography>
                The signature is valid:{" "}
                <strong>
                  {error ? "No" : "Yes"}
                  {error ? ` - ${error}` : ""}
                </strong>
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ECDSA;
