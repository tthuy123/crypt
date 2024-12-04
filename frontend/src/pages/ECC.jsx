import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MathJax from "react-mathjax";
import { createTheme, ThemeProvider } from "@mui/material";
import ECCApi from "../api/modules/ecc.api";
import CommonApi from "../api/modules/common.api";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const ECC = () => {
  const encryptionSteps = `
  M_1 = kG \\\\
  M_2 = M + kP
`;
  const decryptionSteps = `
  M = M_2 - sM_1
`;

  const [error, setError] = useState("");
  const handleShowError = (message) => {
    setError(message);
  };
  const [a, setA] = useState("3");
  const [b, setB] = useState("6");
  const [p, setP] = useState("6559831");
  const [generatorPointX, setGeneratorPointX] = useState("2885735");
  const [generatorPointY, setGeneratorPointY] = useState("3280912");
  const [message, setMessage] = useState("");

  const [senderPointX, setSenderPointX] = useState("");
  const [senderPointY, setSenderPointY] = useState("");
  const [pX, setPX] = useState("");
  const [pY, setPY] = useState("");
  const [m1X, setM1X] = useState("");
  const [m1Y, setM1Y] = useState("");
  const [m2X, setM2X] = useState("");
  const [m2Y, setM2Y] = useState("");
  const [k, setK] = useState("97742");
  const [decryptedPointX, setDecryptedPointX] = useState("");
  const [decryptedPointY, setDecryptedPointY] = useState("");
  const [isGeneratorPointOnCurve, setIsGeneratorPointOnCurve] = useState(null);
  const [isSenderPointOnCurve, setIsSenderPointOnCurve] = useState(null);
  const [isPPrime, setIsPPrime] = useState(null);
  const [isTheNumberOfCurvePointsPrime, setIsTheNumberOfCurvePointsPrime] =
    useState(null);
  const [theNumberOfCurvePoints, setTheNumberOfCurvePoints] = useState(null);

  const handleCalculateSenderPoint = async () => {
    try {
      const result = await ECCApi.pointMultiply({
        a,
        b,
        p,
        pX: generatorPointX,
        pY: generatorPointY,
        k: message.length,
      });

      setSenderPointX(result.result.x);
      setSenderPointY(result.result.y);
      setError("");
    } catch (err) {
      handleShowError("Cannot calculate sender point", err.message);
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

      setError("");
    } catch (err) {
      handleShowError(
        "Cannot calculate the number of curve points",
        err.message
      );
    }
  };

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
      setError("");
    } catch (err) {
      handleShowError(
        "Cannot check if generator point is on curve",
        err.message
      );
    }
  };

  const handleCalculateP = async () => {
    try {
      const result = await ECCApi.pointMultiply({
        a,
        b,
        p,
        pX: generatorPointX,
        pY: generatorPointY,
        k: s,
      });

      setPX(result.result.x);
      setPY(result.result.y);
      setError("");
    } catch (err) {
      handleShowError("Cannot calculate P", err.message);
    }
  };

  const handleEncrypt = async () => {
    try {
      const result = await ECCApi.encrypt({
        a,
        b,
        p,
        mX: senderPointX,
        mY: senderPointY,
        pX: generatorPointX,
        pY: generatorPointY,
        bX: pX,
        bY: pY,
        k,
      });
      setM1X(result.result.m1X);
      setM1Y(result.result.m1Y);
      setM2X(result.result.m2X);
      setM2Y(result.result.m2Y);
    } catch (err) {
      handleShowError("Cannot encrypt", err.message);
    }
  };

  const handleDecrypt = async () => {
    try {
      const result = await ECCApi.decrypt({
        a,
        b,
        p,
        m1X,
        m1Y,
        m2X,
        m2Y,
        pX,
        pY,
        s,
      });

      setDecryptedPointX(result.result.x);
      setDecryptedPointY(result.result.y);
      console.log(decryptedPointX, decryptedPointY);
    } catch (err) {
      handleShowError("Cannot decrypt", err.message);
    }
  };

  const [s, setS] = useState("947");
  return (
    <ThemeProvider theme={theme}>
      <Box p={5}>
        <Stack spacing={2} sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom>
            Elliptic Curve Cryptography
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
                value={b} // Ensure value is a string or valid number
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
                Check if p is prime
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
                multiplying G by some integer in the range [0...r].
              </Typography>
              <Typography>
                The number r is called "order" of the cyclic subgroup generated
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
                Check if this point is on the curve.
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
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 3: Choose a private key.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                The private key is a randomly chosen integer in the range [1,
                r-1].
              </Typography>
              <TextField
                label="Private key s"
                fullWidth
                type="text"
                value={s ?? ""}
                onChange={(e) => setS(e.target.value)}
              />

              <Button variant="contained" onClick={handleCalculateP}>
                Generate Public Key
              </Button>
              <Typography textOverflow="anywhere">
                {pX && pY ? (
                  <>
                    The public key is <br /> P = <b>{`(${pX}, ${pY})`}</b>
                  </>
                ) : (
                  ""
                )}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Private Key, Public Key and the Generator Point in ECC
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography gutterBottom>
                After the abovementioned steps, in ECC we have:
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
                    {s ? <b>s = {s}</b> : ""}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Public key: <br />
                    {pX && pY ? (
                      <b>
                        {" "}
                        P = ({pX}, {pY})
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                </li>
              </ul>
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 4: Encrypt.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                The message must first be converted into a point 𝑀 on the
                elliptic curve. This can be achieved through encoding schemes
                that map the message to a valid curve point.
              </Typography>

              <TextField
                label="Message x"
                fullWidth
                type="text"
                onChange={(e) => setMessage(e.target.value)}
              />
              <TextField
                label="Sender Point x"
                fullWidth
                type="text"
                value={senderPointX ?? ""}
                onChange={(e) => setSenderPointX(e.target.value)}
              />
              <TextField
                label="Sender Point y"
                fullWidth
                type="text"
                value={senderPointY ?? ""}
                onChange={(e) => setSenderPointY(e.target.value)}
              />
              <Button variant="contained" onClick={handleCalculateSenderPoint}>
                Generate Message Point
              </Button>
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 4.1: Generate a random number k.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                The random number k is generated in the range [1, r-1].
              </Typography>
              <TextField
                label="Random number k"
                fullWidth
                type="text"
                value={k ?? ""}
                onChange={(e) => setK(e.target.value)}
              />
            </Stack>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 4.2: Calculate the cipher text.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>The cipher text is calculated as follows:</Typography>
              <MathJax.Provider>
                <MathJax.Node formula={encryptionSteps} />
              </MathJax.Provider>
              <Button variant="contained" onClick={handleEncrypt}>
                Encrypt
              </Button>

              <Typography>
                The cipher text is: <br />
                {m1X && m1Y ? (
                  <b>
                    M1 = ({m1X}, {m1Y})
                  </b>
                ) : (
                  ""
                )}{" "}
                <br />
                {m2X && m2Y ? (
                  <>
                    <b>
                      M2 = ({m2X}, {m2Y})
                    </b>
                  </>
                ) : (
                  ""
                )}
              </Typography>
              <Typography>
                {m1X && m1Y && m2X && m2Y
                  ? "The sender can now send this ciphertext to the receiver."
                  : ""}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Step 5: Decrypt.
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography>
                The receiver can calculate the original message M using the
                following formula:
              </Typography>
              <MathJax.Provider>
                <MathJax.Node formula={decryptionSteps} />
              </MathJax.Provider>
              <Button variant="contained" onClick={handleDecrypt}>
                Decrypt
              </Button>
              <Typography>
                The original message M is:{" "}
                {decryptedPointX && decryptedPointY ? (
                  <b>
                    ({decryptedPointX}, {decryptedPointY})
                  </b>
                ) : (
                  ""
                )}
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ECC;
