import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import MathJax from "react-mathjax";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "Neue Helvetica Condensed BQ", "san-serif"].join(
      ","
    ),
  },
});

const ECDSA = () => {
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

  const [a, setA] = useState(null);
  const [b, setB] = useState(null);
  const [p, setP] = useState(null);
  const [generatorPointX, setGeneratorPointX] = useState(null);
  const [generatorPointY, setGeneratorPointY] = useState(null);
  const [senderPointX, setSenderPointX] = useState(null);
  const [senderPointY, setSenderPointY] = useState(null);
  const [k, setK] = useState(null);
  const isSenderPointOnCurve = useState(false);
  const satistyHasseTheorem = false;

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
                type="number"
                value={a ?? ""}
                onChange={(e) => setA(Number(e.target.value))}
              />
              <TextField
                label="b"
                fullWidth
                type="number"
                value={b ?? ""}
                onChange={(e) => setB(Number(e.target.value))}
              />
              <TextField
                label="p"
                fullWidth
                type="number"
                value={p ?? ""}
                onChange={(e) => setP(Number(e.target.value))}
              />
              <Typography>
                The order of the elliptic curve is the total number of points on
                the curve, including the point at infinity. It is typically
                chosen such that it satisfies the Hasse theorem, which bounds
                the order 𝑛 n by:
              </Typography>
              <MathJax.Provider>
                <Typography variant="body1">
                  <MathJax.Node formula={hasseFormula} />
                </Typography>
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
                type="number"
                value={generatorPointX ?? ""}
                onChange={(e) => setGeneratorPointX(e.target.value)}
              />
              <TextField
                label="Generator Point y"
                fullWidth
                type="number"
                value={generatorPointY ?? ""}
                onChange={(e) => setGeneratorPointY(e.target.value)}
              />
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
                type="number"
                value={s ?? ""}
                onChange={(e) => setS(e.target.value)}
              />

              <Button variant="contained">Generate Public Key</Button>
              <Typography>
                The public key is P = kG = <b>Point P</b>.
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Private Key, Public Key and the Generator Point in ECC
            </Typography>
            <Stack p={2} spacing={2}>
              <Typography gutterBottom>
                After the abovementioned steps, in ECC we have:
                <ul>
                  <li>
                    Elliptic curve parameters: (a, b, p) = ({a}, {b}, {p})
                  </li>
                  <li>
                    Generator point: G({generatorPointX}, {generatorPointY})
                  </li>
                  <li>Private key: {s}</li>
                  <li>Public key: P = (,)</li>
                </ul>
              </Typography>
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
                type="number"
                value={senderPointX ?? ""}
                onChange={(e) => setSenderPointX(e.target.value)}
              />
              <TextField
                label="Sender Point y"
                fullWidth
                type="number"
                value={senderPointY ?? ""}
                onChange={(e) => setSenderPointY(e.target.value)}
              />
              <Button variant="contained">
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
                type="number"
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
                <Typography variant="body1">
                  <MathJax.Node formula={encryptionSteps} />
                </Typography>
              </MathJax.Provider>
              <Typography>
                The cipher text is: <b>(M1, M2)</b>: <b>(,), (,)</b>. The sender
                can now send this ciphertext to the receiver.
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
                <Typography variant="body1">
                  <MathJax.Node formula={decryptionSteps} />
                </Typography>
              </MathJax.Provider>
              <Typography>
                The original message M is: <b>(,)</b>.
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ECDSA;
