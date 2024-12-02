import React, { useEffect, useState } from "react";
import {
  gcd,
  modular_inverse,
  modular_exponentiation,
  isPrime,
} from "../utils/common";
import CommonAPI from "../api/modules/common.api";
import { Box, Typography, TextField, Button } from "@mui/material";

const RSA = () => {
  const [qIsPrime, setqIsPrime] = useState(true);
  const [pIsPrime, setpIsPrime] = useState(true);
  const [pIsNaN, setpIsNaN] = useState(false);
  const [qIsNaN, setqIsNaN] = useState(false);
  const [pequalq, setpequalq] = useState(false);
  const [phi, setPhi] = useState("");
  const [gcdephi, setGcdephi] = useState(null);
  const [p, setP] = useState("21013");
  const [q, setQ] = useState("21191");
  const [e, setE] = useState("");
  const [isEValid, setIsEValid] = useState(true);
  const [d, setD] = useState(null);
  const [n, setN] = useState("");
  const [message, setMessage] = useState("");
  const [message_code, setMessage_code] = useState("");
  const [encryptNum, setEncryptNum] = useState("");
  const [encryptNum2, setEncryptNum2] = useState("");
  const [decryptNum, setdecryptNum] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // API Handling

  const handleCheckPrime = async (num) => {
    try {
      const result = await CommonAPI.checkPrime({ n: num });
      if (!result.is_prime) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  };
  const handleCalSum = async (a, b) => {
    try {
      const result = await CommonAPI.sum({ a: a, b: b });
      return result;
    } catch (err) {
      return null;
    }
  };
  const handleCalProduct = async (a, b) => {
    try {
      const result = await CommonAPI.product({ a: a, b: b });
      return result;
    } catch (err) {
      return null;
    }
  };
  const handleCalGCD = async (a, b) => {
    try {
      const result = await CommonAPI.gcd({ a: a, b: b });
      return result;
    } catch (err) {
      handleShowError("Error checking if the number is a prime.");
      return null;
    }
  };
  const handleModular_inverse = async (a, n) => {
    try {
      const result = await CommonAPI.modularInverse({ a: n, b: a });
      return result;
    } catch (err) {
      return null;
    }
  };
  const handleEcrypt = async (a) => {
    try {
      const result = await CommonAPI.encrypt({ text: a });
      return result;
    } catch (err) {
      return null;
    }
  };
  const handleDecrypt = async (a) => {
    try {
      const result = await CommonAPI.decrypt({ number: a });
      return result;
    } catch (err) {
      return null;
    }
  };
  const handleModular_exponentiation = async (a, b, n) => {
    try {
      const result = await CommonAPI.pow({ base: a, exponent: b, modulus: n });
      return result;
    } catch (err) {
      return null;
    }
  };
  const updatePrimeStatus = async (num, setIsPrime, setIsNaN) => {
    if (num != "") {
      setIsNaN(false);
      const isPrime = await handleCheckPrime(num);
      setIsPrime(isPrime);
    } else {
      setIsNaN(true);
      setIsPrime(true);
    }
  };

  useEffect(() => {
    const pVal = p;
    const qVal = q;
    const calculateValues = async () => {
      await updatePrimeStatus(pVal, setpIsPrime, setpIsNaN);
      // Check if p equals q
      setpequalq(pVal === qVal);
    };

    calculateValues();
  }, [p]);
  useEffect(() => {
    const pVal = p;
    const qVal = q;
    const calculateValues = async () => {
      await updatePrimeStatus(qVal, setqIsPrime, setqIsNaN);
      setpequalq(pVal === qVal);
    };

    calculateValues();
  }, [q]);

  useEffect(() => {
    const pVal = p;
    const qVal = q;
    if (pVal != "" && qVal != "") {
      const calculateValues = async () => {
        const product = await handleCalProduct(pVal, qVal);
        const v1 = await handleCalSum(pVal, "-1");
        const v2 = await handleCalSum(qVal, "-1");
        const product_phi = await handleCalProduct(v1.result, v2.result);
        setN(product.result);
        setPhi(product_phi.result);
      };

      calculateValues();
    }
  }, [p, q]);

  useEffect(() => {
    const eVal = e;
    if (eVal != "" && phi !== null) {
      const check = async () => {
        const check = await handleCalGCD(eVal, phi);
        if (check.result !== "1") {
          setIsEValid(false);
        } else {
          setIsEValid(true);
        }
        setGcdephi(check.result);
      };
      check();
    } else setIsEValid(true);
  }, [e, phi]);

  useEffect(() => {
    if (isEValid && e !== "" && phi !== null) {
      const calculate = async () => {
        const dValue = await handleModular_inverse(e, phi);
        setD(dValue.modular_inverse);
      };
      calculate();
    } else {
      setD(null);
    }
  }, [e, phi, isEValid]);

  useEffect(() => {
    setPublicKey(`Public key (n, e): (${n}, ${e})`);
    setPrivateKey(`Private key (n, d): (${n}, ${d})`);
  }, [n, e, d]);

  // Encrypt the message whenever it changes
  useEffect(() => {
    if (message !== "" && n && e) {
      const value = message;
      const calculate = async () => {
        const encrypt = await handleEcrypt(value);
        setMessage_code(encrypt.encrypted_value);
      };
      calculate();
    } else {
      setMessage_code("");
    }
  }, [message]);

  useEffect(() => {
    if (message_code !== "" && n && e) {
      const eVal = e;
      const nVal = n;
      const value = message_code;
      const calculate = async () => {
        const encrypt = await handleModular_exponentiation(value, eVal, nVal);
        setEncryptNum(encrypt.result);
        setEncryptNum2(encrypt.result);
      };
      calculate();
    } else {
      setEncryptNum("");
    }
  }, [message_code, n, e]);

  // Decrypt the message whenever encryptedMessage changes
  useEffect(() => {
    if (encryptNum2 !== null && n && d !== null) {
      const nVal = n;
      const dVal = d;
      const value = encryptNum2;
      const calculate = async () => {
        const decryptNum = await handleModular_exponentiation(
          value,
          dVal,
          nVal
        );
        const decryptMess = await handleDecrypt(decryptNum.result);
        setDecryptedMessage(decryptMess.decrypted_value);
        setdecryptNum(decryptNum.result);
      };
      calculate();
    }
  }, [encryptNum2, n, d]);

  return (
    <Box sx={{ padding: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            position: "relative",
          }}
        >
          RSA Encryption/Decryption
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 2, marginTop: 10 }}>
        <Typography fontSize={"35px"} fontWeight={"Bold"}>
          Step 1: Set prime number
        </Typography>
        <Typography marginBottom={1} marginTop={3}>
          Enter RSA Parameters:
        </Typography>

        <Box sx={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
          <Typography sx={{ marginRight: "1.5vw" }}>p = </Typography>
          <TextField
            sx={{ width: "90%" }}
            type="text"
            value={p}
            multiline
            onChange={(e) => setP(e.target.value)}
          />
        </Box>
        {!pIsPrime && (
          <Typography marginTop={1} color="red">
            p is not a prime number
          </Typography>
        )}
        {pIsNaN && (
          <Typography marginTop={1} marginBottom={1} color="red">
            p must have a value
          </Typography>
        )}

        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ marginRight: "1.5vw" }}>q = </Typography>
          <TextField
            sx={{ width: "90%" }}
            type="text"
            value={q}
            multiline
            onChange={(e) => setQ(e.target.value)}
          />
        </Box>
        {!qIsPrime && (
          <Typography marginTop={1} color="red">
            q is not a prime number
          </Typography>
        )}
        {qIsNaN && (
          <Typography marginTop={1} color="red">
            q must have a value
          </Typography>
        )}
        <Typography marginTop={1}>
          For the algorithm to work, the two prime numbers must be different.
        </Typography>
        {pequalq && (
          <Typography marginTop={1} color="red">
            p and q are not different
          </Typography>
        )}
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography fontSize={"35px"} fontWeight={"Bold"} marginTop={4}>
          Step 2: Calculate Key values
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Typography fontSize={"25px"} fontWeight={"Bold"} marginTop={2}>
            n (Step 2.1)
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, marginTop: 2 }}>
            To calculate <strong>n</strong>, simply multiply <strong>p</strong>{" "}
            and <strong>q</strong>.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, marginTop: 2 }}>
            n = p ⋅ q
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              marginTop: 2,
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            n = {p} ⋅ {q}
          </Typography>
          <Typography
            variant="body1"
            sx={{ wordWrap: "break-word", whiteSpace: "normal" }}
          >
            n = {n}
          </Typography>
          <Typography fontSize={"25px"} fontWeight={"Bold"} marginTop={2}>
            φ(n) (Step 2.2)
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, marginTop: 2 }}>
            To calculate φ(n), use the simplified formula:
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, marginTop: 2 }}>
            φ(n) = (p - 1) × (q - 1)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              marginTop: 2,
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            φ({n}) = ({p} - 1) × ({q} - 1)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              marginTop: 2,
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            φ({n}) = {phi}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography fontSize={"25px"} fontWeight={"Bold"} marginTop={2}>
            e (Step 2.3)
          </Typography>
          <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
            Choose a value for e such that it is coprime to ϕ(n) (i.e., gcd(e,
            φ(n)) = 1).
          </Typography>

          <Box sx={{ marginBottom: 0, display: "flex", alignItems: "center" }}>
            <Typography sx={{ marginRight: "1.5vw" }}>e = </Typography>
            <TextField
              sx={{ width: "90%" }}
              type="string"
              multiline
              value={e}
              onChange={(e) => setE(e.target.value)}
            />
          </Box>

          {!isEValid && (
            <Typography
              sx={{ marginBottom: 1, marginTop: 2 }}
              color="error"
              variant="body2"
            >
              e is not coprime to φ(n). Please choose a different e.
            </Typography>
          )}
          <Typography
            sx={{
              marginBottom: 1,
              marginTop: 2,
              wordWrap: "break-word",
              whiteSpace: "normal",
            }}
          >
            gcd(e, φ(n)) = gcd({e},{phi}) = {gcdephi}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography fontSize={"25px"} fontWeight={"Bold"} marginTop={2}>
            d (Step 2.4)
          </Typography>
          <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
            The number <strong>d</strong> is the multiplicative inverse of{" "}
            <strong>e</strong> modulo <strong>ϕ(n)</strong>. This means that:
          </Typography>
          <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
            (e * d) mod ϕ(n) = 1
          </Typography>
          <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
            If <strong>e</strong> and <strong>ϕ(n)</strong> are coprime,{" "}
            <strong>d</strong> can be calculated using the extended Euclidean
            algorithm.
          </Typography>
          {d !== null ? (
            <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
              d = {d}
            </Typography>
          ) : (
            <Typography sx={{ marginBottom: 1, marginTop: 2 }} color="red">
              d is undefined because <strong>e</strong> and{" "}
              <strong>ϕ(n)</strong> are not coprime.
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography fontSize={"25px"} fontWeight={"Bold"} marginTop={2}>
          Resulting keys
        </Typography>
        <Typography
          sx={{
            marginBottom: 1,
            marginTop: 2,
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {publicKey}
        </Typography>
        <Typography
          sx={{
            marginBottom: 1,
            marginTop: 2,
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {privateKey}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 2 }}>
        <Typography fontSize={"35px"} fontWeight={"Bold"} marginTop={4}>
          Step 3: Encrypt
        </Typography>
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          To encrypt a number m m to ciphertext c c the following formula is
          applied.
        </Typography>
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          It uses the numbers of the public key:
        </Typography>
        <Typography sx={{ marginBottom: 3, marginTop: 4 }}>
          c = m<sup>e</sup> modn
        </Typography>
        <Box
          sx={{
            marginBottom: 3,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ marginRight: "3.9vw" }}>m (text) = </Typography>
          <TextField
            type="text"
            sx={{ width: "80%" }}
            multiline
            value={message}
            onChange={(e) => setMessage(e.target.value.toUpperCase())}
          />
        </Box>
        <Box
          sx={{
            marginBottom: 3,
            marginTop: 4,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ marginRight: "1.5vw" }}>m (number) = </Typography>
          <TextField
            type="text"
            sx={{ width: "80%" }}
            multiline
            value={message_code}
            onChange={(e) => setMessage_code(e.target.value)}
          />
        </Box>

        <Typography
          sx={{
            marginBottom: 1,
            marginTop: 2,
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
          variant="subtitle1"
        >
          c = {message_code}
          <sup>{e}</sup> mod {n}
        </Typography>
        <Typography>c = {encryptNum}</Typography>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Typography fontSize={"35px"} fontWeight={"Bold"} marginTop={4}>
          Step 4: Decrypt
        </Typography>
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          To encrypt a number m m to ciphertext c c the following formula is
          applied.
        </Typography>
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          It uses the numbers of the public key:
        </Typography>
        <Typography sx={{ marginBottom: 3, marginTop: 4 }}>
          m'= c<sup>d</sup> modn
        </Typography>
        <Box
          sx={{
            marginBottom: 0,
            marginTop: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ marginRight: "1.5vw" }}>c = </Typography>
          <TextField
            type="number"
            sx={{ width: "90%" }}
            value={encryptNum2}
            multiline
            onChange={(e) => setEncryptNum2(e.target.value)}
          />
        </Box>
        <Typography
          sx={{
            marginBottom: 1,
            marginTop: 2,
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
          variant="subtitle1"
        >
          m' = {encryptNum2}
          <sup>{d}</sup> mod {n}
        </Typography>
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          m'(number) = {decryptNum}
        </Typography>{" "}
        <Typography sx={{ marginBottom: 1, marginTop: 2 }}>
          m'(text) = {decryptedMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default RSA;
