import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MathJax from "react-mathjax";
import { createTheme, ThemeProvider } from "@mui/material";
import ECCApi from "../api/modules/ecc.api";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const ECC = () => {
  const hasseFormula = `
    p + 1 - 2\\sqrt{p} \\leq n \\leq p + 1 + 2\\sqrt{p}
  `;

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
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [p, setP] = useState("");
  const [generatorPointX, setGeneratorPointX] = useState("");
  const [generatorPointY, setGeneratorPointY] = useState("");
  const [senderPointX, setSenderPointX] = useState("");
  const [senderPointY, setSenderPointY] = useState("");
  const [pX, setPX] = useState("");
  const [pY, setPY] = useState("");
  const [m1X, setM1X] = useState("");
  const [m1Y, setM1Y] = useState("");
  const [m2X, setM2X] = useState("");
  const [m2Y, setM2Y] = useState("");
  const [k, setK] = useState("");
  const [decryptedPointX, setDecryptedPointX] = useState("");
  const [decryptedPointY, setDecryptedPointY] = useState("");
  const [isGeneratorPointOnCurve, setIsGeneratorPointOnCurve] = useState(null);
  const [isSenderPointOnCurve, setIsSenderPointOnCurve] = useState(null);
  const satistyHasseTheorem = false;

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

  const handleCheckIfSenderPointOnCurve = async () => {
    try {
      const result = await ECCApi.isPointOnCurve({
        a,
        b,
        p,
        pX: senderPointX,
        pY: senderPointY,
      });

      setIsSenderPointOnCurve(result.result);
      setError("");
    } catch (err) {
      handleShowError("Cannot check if point is on curve", err.message);
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

  const [s, setS] = useState(null);
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
              <Typography>
                The order of the elliptic curve is the total number of points on
                the curve, including the point at infinity. It is typically
                chosen such that it satisfies the Hasse theorem, which bounds
                the order 𝑛 n by:
              </Typography>
              <MathJax.Provider>
                <MathJax.Node formula={hasseFormula} />
              </MathJax.Provider>
              <Typography>
                The order of the entired elliptic curve is:{" "}
                <strong>order n</strong>, which does{" "}
                {satistyHasseTheorem ? "" : "not"} satisfy the Hasse theorem.{" "}
                <strong>
                  {satistyHasseTheorem
                    ? ""
                    : "Please choose different curve parameters."}
                </strong>
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
                The sender point is on the curve:{" "}
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
              <Typography textOverflow="break-word">
                The public key is P = kG
                {pX && pY ? <b>{` = (${pX}, ${pY})`}</b> : ""}
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
                        (a, b, p) = ({a}, {b}, {p})
                      </b>
                    ) : (
                      ""
                    )}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Generator point:{" "}
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
                    Private key: {s ? <b>{s}</b> : ""}
                  </Typography>
                </li>
                <li>
                  <Typography gutterBottom>
                    Public key:
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
              <Button
                variant="contained"
                onClick={handleCheckIfSenderPointOnCurve}
              >
                Check if this point is on the curve.
              </Button>
              <Typography>
                The sender point is on the curve:{" "}
                <strong>{isSenderPointOnCurve ? "Yes" : "No"}</strong>
              </Typography>
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
                The cipher text is:{" "}
                {m1X && m1Y ? (
                  <b>
                    M1 = ({m1X}, {m1Y})
                  </b>
                ) : (
                  ""
                )}{" "}
                {m2X && m2Y ? (
                  <>
                    ,{" "}
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
