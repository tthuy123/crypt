import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const Homepage = () => {
  const projects = [
    {
      title: "RSA",
      description:
        "Play around with different cryptographic algorithms directly in your browser. For PC and mobile. No download needed.",
      color: "green",
    },
    {
      title: "ElGamal",
      description:
        "Visual programming, cascades of cryptographic procedures, and lots of cryptanalysis methods. Download for Windows.",
      color: "red",
    },
    {
      title: "ECC",
      description:
        "International crypto cipher challenge, offering cryptographic riddles of 4 levels. Joint work of CrypTool and the University of Bochum.",
      color: "blue",
    },
  ];

  const signatureDiagrams = [
    {
      title: "Digital Signature",
      description:
        "Understand how digital signatures work and their importance in cryptographic systems.",
      color: "purple",
    },
    {
      title: "Elliptic Curve Signature",
      description:
        "Explore elliptic curve-based digital signatures for more secure cryptographic methods.",
      color: "orange",
    },
  ];

  const relatedAlgorithms = [
    {
      title: "AES",
      description:
        "Advanced Encryption Standard, a symmetric encryption algorithm used worldwide.",
      color: "cyan",
    },
    {
      title: "SHA-256",
      description:
        "A cryptographic hash function used in blockchain and data integrity applications.",
      color: "teal",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Crypt
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Here you can try crypto tools, learn cryptography, and solve puzzles. Our goal is to create interest in crypto techniques, raise awareness, and provide easy access.
      </Typography>

      {/* Cryptographic Systems Section */}
      <Typography variant="h5" gutterBottom>
        Cryptographic Systems
      </Typography>
      <Box display="flex" justifyContent="left" gap={3} flexWrap="wrap">
        {projects.map((project, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "28%" },
              padding: 3,
              backgroundColor: project.color,
              color: "white",
              textAlign: "center",
              borderRadius: "10px"
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {project.title}
            </Typography>
            <Typography>{project.description}</Typography>
            <Button
              variant="contained"
              sx={{ marginTop: 2, backgroundColor: "white", color: project.color }}
            >
              Learn More
            </Button>
          </Box>
        ))}
      </Box>

      {/* Sơ đồ chữ ký Section */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Sơ đồ chữ ký
      </Typography>
      <Box display="flex" justifyContent="left" gap={3} flexWrap="wrap">
        {signatureDiagrams.map((diagram, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "28%" },
              padding: 3,
              backgroundColor: diagram.color,
              color: "white",
              textAlign: "center",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {diagram.title}
            </Typography>
            <Typography>{diagram.description}</Typography>
            <Button
              variant="contained"
              sx={{ marginTop: 2, backgroundColor: "white", color: diagram.color }}
            >
              Learn More
            </Button>
          </Box>
        ))}
      </Box>

      {/* Các thuật toán liên quan Section */}
      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Các thuật toán liên quan
      </Typography>
      <Box display="flex" justifyContent="left" gap={3} flexWrap="wrap">
        {relatedAlgorithms.map((algorithm, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "28%" },
              padding: 3,
              backgroundColor: algorithm.color,
              color: "white",
              textAlign: "center",
              borderRadius: "10px"
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {algorithm.title}
            </Typography>
            <Typography>{algorithm.description}</Typography>
            <Button
              variant="contained"
              sx={{ marginTop: 2, backgroundColor: "white", color: algorithm.color }}
            >
              Learn More
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Homepage;
