import React, { useState } from "react";
import {
  gcd,
  modular_inverse,
  modular_exponentiation,
  isPrime,
} from "../utils/common";

const RSA = () => {
  const [p, setP] = useState("13");
  const [q, setQ] = useState("17");
  const [e, setE] = useState("");
  const [n, setN] = useState("");
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [steps, setSteps] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  // Generate RSA Keys and Steps
  const generateKeys = () => {
    const pVal = parseInt(p);
    const qVal = parseInt(q);
    const eVal = parseInt(e);

    const n = pVal * qVal;
    const phi = (pVal - 1) * (qVal - 1);
    const d = modular_inverse(eVal, phi);

    // Set RSA steps and keys
    setPublicKey(`Public key (n, e): (${n}, ${eVal})`);
    setPrivateKey(`Private key (n, d): (${n}, ${d})`);
    setSteps(`
      Step 1: n = p * q = ${pVal} * ${qVal} = ${n}
      Step 2: φ(n) = (p-1) * (q-1) = (${pVal}-1) * (${qVal}-1) = ${phi}
      Step 3: e = ${eVal} (public key)
      Step 4: d = e⁻¹ mod φ(n) = ${d} (private key)
    `);
  };

  // Encrypt Message
  const encryptMessage = () => {
    const n = parseInt(p) * parseInt(q);
    const eVal = parseInt(e);
    const encrypted = modular_exponentiation(parseInt(message), eVal, n);
    setEncryptedMessage(encrypted);
  };

  // Decrypt Message
  const decryptMessage = () => {
    const n = parseInt(p) * parseInt(q);
    const d = modular_inverse(
      parseInt(e),
      (parseInt(p) - 1) * (parseInt(q) - 1)
    );
    const decrypted = modular_exponentiation(parseInt(encryptedMessage), d, n);
    setDecryptedMessage(decrypted);
  };

  return (
    <div>
      <h1>RSA Encryption/Decryption</h1>

      <div>
        <h3>Enter RSA Parameters</h3>
        <label>Prime p:</label>
        <input
          type="number"
          value={p}
          onChange={(e) => setP(e.target.value)}
          onBlur={(e) => {
            if (!isPrime(e.target.value)) {
              alert("Please enter a prime number for p");
            }
          }}
        />
        <br />
        <label>Prime q:</label>
        <input
          type="number"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={(e) => {
            if (!isPrime(e.target.value)) {
              alert("Please enter a prime number for q");
            }
          }}
        />
        <br />
        <label>Public key e:</label>
        <input type="number" value={e} onChange={(e) => setE(e.target.value)} />
        <br />
        <button onClick={generateKeys}>Generate Keys</button>
      </div>

      <div>
        <h3>Public Key and Private Key</h3>
        <p>{publicKey}</p>
        <p>{privateKey}</p>
      </div>

      <div>
        <h3>Steps</h3>
        <p>{steps}</p>
      </div>

      <div>
        <h3>Encrypt Message</h3>
        <input
          type="number"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <br />
        <button onClick={encryptMessage}>Encrypt</button>
        <p>Encrypted Message: {encryptedMessage}</p>
      </div>

      <div>
        <h3>Decrypt Message</h3>
        <input
          type="number"
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value)}
          placeholder="Enter encrypted message"
        />
        <br />
        <button onClick={decryptMessage}>Decrypt</button>
        <p>Decrypted Message: {decryptedMessage}</p>
      </div>
    </div>
  );
};

export default RSA;
