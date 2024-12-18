import React, { useState, useEffect } from "react";
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
import { MathJax, MathJaxContext } from "better-react-mathjax";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const ECDSA = () => {
  const kValidationSteps1 = `
  \\begin{align}
  kG &= (x_1, y_1) \\\\
  r &= x_1 mod n
  \\end{align}
  `;

  const kValidationSteps2 = `
  \\begin{align*}
  &s = k^{-1} * (h + d * r) \\\\
  &\\text{where } h = H(m) \\\\
  \\end{align*}
  `;

  const verificationSteps1 = `
  \\begin{align*}
  &w = s^{-1} \\mod n \\\\
  &u_1 = h \\cdot w \\mod n \\\\
  &u_2 = r \\cdot w \\mod n \\\\
  &u_1G + u_2Q = (x_0, y_0) \\\\
  &v = x_0 \\mod n
  \\end{align*}
`;

  const [error, setError] = useState("");
  const handleShowError = (message) => {
    setError(message);
  };
  const [a, setA] = useState("3");
  const [b, setB] = useState("6");
  const [p, setP] = useState("6559831");

  const [isPPrime, setIsPPrime] = useState(null);
  const [isNPrime, setIsNPrime] = useState(null);
  const [isTheNumberOfCurvePointsPrime, setIsTheNumberOfCurvePointsPrime] =
    useState(null);
  const [theNumberOfCurvePoints, setTheNumberOfCurvePoints] = useState(null);

  const [generatorPointX, setGeneratorPointX] = useState("2885735");
  const [generatorPointY, setGeneratorPointY] = useState("3280912");
  const [n, setN] = useState("");

  const [d, setD] = useState("947");
  const [qX, setQX] = useState("");
  const [qY, setQY] = useState("");

  const [message, setMessage] = useState("");
  const [hashedMessage, setHashedMessage] = useState("");
  const [r, setR] = useState("");
  const [s, setS] = useState("");

  const [k, setK] = useState("97742");
  const [isGeneratorPointOnCurve, setIsGeneratorPointOnCurve] = useState(null);
  const [isKValid, setIsKValid] = useState(null);

  const [v, setV] = useState("");
  const [isSignatureValid, setIsSignatureValid] = useState(null);

  const handleCheckIfNPrime = async () => {
    try {
      const result = await CommonApi.checkPrime({ n });
      setIsNPrime(result.is_prime);
      setError("");
    } catch (err) {
      handleShowError("Cannot check if n is prime", err.message);
    }
  };

  const handleCheckIfPPrime = async () => {
    try {
      setIsPPrime(null);
      setIsTheNumberOfCurvePointsPrime(null);
      setTheNumberOfCurvePoints(null);
      const result = await CommonApi.checkPrime({ n: p });
      setIsPPrime(result.is_prime);
      setError("");

      handleCalculateTheNumberOfCurvePoints();
    } catch (err) {
      handleShowError("Cannot check if p is prime", err.message);
    }
  };

  const handleCalculateTheNumberOfCurvePoints = async () => {
    try {
      const result = await ECCApi.curve_points({ a, b, p });
      setTheNumberOfCurvePoints(result.result);

      // handleCheckIfTheNumberOfCurvePointsPrime();
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot calculate the number of curve points",
        err.message
      );
    }
  };

  useEffect(() => {
    if (n !== "") {
      handleCheckIfNPrime();
    }
  }, [n]);

  useEffect(() => {
    if (theNumberOfCurvePoints !== null) {
      handleCheckIfTheNumberOfCurvePointsPrime();
    }
  }, [theNumberOfCurvePoints]);

  const handleCheckIfTheNumberOfCurvePointsPrime = async () => {
    try {
      const result = await CommonApi.checkPrime({ n: theNumberOfCurvePoints });
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
      handleCalculateOrderOfGeneratorPoint();
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot check if generator point is on curve",
        err.message
      );
    }
  };

  const handleCalculateOrderOfGeneratorPoint = async () => {
    try {
      const result = await ECDSAApi.getOrderOfPoint({
        pX: generatorPointX,
        pY: generatorPointY,
        a,
        b,
        p,
      });
      setN(result.result);
      setError("");
    } catch (err) {
      handleShowError("Cannot calculate the order of the point", err.message);
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

  const handleHashMessage = async () => {
    try {
      const response = await ECDSAApi.hash_message({ message });
      console.log("Hash result from API:", response);

      const hashedMessage = response.hashed_message;
      console.log("Hashed message:", hashedMessage);

      const nInt = parseInt(n, 10);
      console.log("Parsed n:", nInt);

      if (isNaN(nInt)) {
        throw new Error("Invalid value for n");
      }

      const reducedHash = BigInt(hashedMessage) % BigInt(nInt);
      setHashedMessage(reducedHash.toString());
      console.log("Reduced hash:", reducedHash.toString());
      setError("");
    } catch (err) {
      handleShowError("Cannot hash message", err.message);
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

      setIsSignatureValid(result.result.valid);
      setV(result.result.v);

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

              <Button variant="contained" onClick={handleCheckIfPPrime}>
                Check if parameters are valid
              </Button>
              <Typography>
                The number p is:{" "}
                {p == null || isPPrime == null ? (
                  ""
                ) : (
                  <b>{isPPrime ? "Prime" : "Not Prime"}</b>
                )}
              </Typography>
              <Typography>
                The number of the points on the elliptic curve is:{" "}
                <b>
                  {theNumberOfCurvePoints}{" "}
                  {theNumberOfCurvePoints
                    ? isTheNumberOfCurvePointsPrime
                      ? "- Prime"
                      : "- Not Prime"
                    : ""}
                </b>
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
                  The order of the generator point is:{" "}
                  {n ? (
                    <b>
                      {n} - {isNPrime ? "Prime" : "Not Prime"}
                    </b>
                  ) : (
                    ""
                  )}
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

              <Typography>
                The hashed message is: <br />
                {hashedMessage != "" ? <b>{hashedMessage}</b> : ""}
              </Typography>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Step 4.2: Generate a random number k.
              </Typography>
              <Stack p={2} spacing={2}>
                <Typography>
                  The random number k is generated in the range [1, n-1]. In
                  addition, it should also satisfy the following conditions:
                </Typography>
                {/* TODO: insert the conditions */}
                <Typography>
                  Step 1. Choose k in range [1, n - 1]and calculate:
                </Typography>
                <MathJaxContext>
                  <MathJax>{`\\[${kValidationSteps1}\\]`}</MathJax>
                </MathJaxContext>

                <Typography>Step 2.If r = 0, return to step 1.</Typography>

                <Typography>Step 3. Calculate s</Typography>

                <MathJaxContext>
                  <MathJax>{`\\[${kValidationSteps2}\\]`}</MathJax>
                </MathJaxContext>

                <Typography>Step 4. If s = 0, return to step 1.</Typography>
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

              <MathJaxContext>
                <MathJax>{`\\[${verificationSteps1}\\]`}</MathJax>
              </MathJaxContext>

              <Typography>
                The signature is valid if and only if<b> r = v</b>.
              </Typography>
              <Button variant="contained" onClick={handleVerify}>
                Verify the signature!
              </Button>
              <Typography>
                The value of v is: <b>{v}</b>
              </Typography>
              <Typography>
                The value of r is: <b>{r}</b>
              </Typography>
              <Typography>
                The signature is valid:{" "}
                <strong>
                  {isSignatureValid !== null
                    ? isSignatureValid
                      ? "Yes"
                      : "No"
                    : ""}
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
