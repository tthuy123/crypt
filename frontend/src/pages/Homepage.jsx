import React from "react";
import { Link } from "react-router-dom"; // Thêm Link từ react-router-dom
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const Homepage = () => {
  const projects = [
    {
      title: "RSA",
      description:
        "A popular asymmetric encryption algorithm used in secure communication and digital signatures. Try our RSA tool now!",
      color: "green",
      link: "/rsa", // Thêm link tương ứng cho mỗi dự án
    },
    {
      title: "ElGamal",
      description:
        "Another asymmetric encryption algorithm based on the Diffie-Hellman key exchange. Try our ElGamal tool now!",
      color: "red",
      link: "/elgamal", // Thêm link tương ứng cho mỗi dự án
    },
    {
      title: "ECC",
      description:
        "Elliptic Curve Cryptography is a modern cryptographic system used in secure communication and digital signatures.",
      color: "blue",
      link: "/ecc", // Thêm link tương ứng cho mỗi dự án
    },
  ];

  const signatureDiagrams = [
    {
      title: "RSA Signature",
      description:
        "Learn how RSA digital signatures work and how they are used to verify the authenticity of messages.",
      color: "purple",
      link: "/rsa-signature", // Thêm link tương ứng cho mỗi hình chữ ký
    },
    {
      title: "ElGamal Signature",
      description:
        "Explore ElGamal digital signatures and how they are used in secure communication.",
      color: "brown",
      link: "/elgamal-signature", // Thêm link tương ứng cho mỗi hình chữ ký
    },
    {
      title: "Elliptic Curve Signature",
      description:
        "Explore elliptic curve-based digital signatures for more secure cryptographic methods.",
      color: "orange",
      link: "/ecc-signature", // Thêm link tương ứng cho mỗi hình chữ ký
    },
  ];

  const relatedAlgorithms = [
    {
      title: "Factorization",
      description:
        "Factorization is the process of finding prime numbers that multiply together to get the original number.",
      color: "cyan",
      link: "/factors", // Thêm link tương ứng cho mỗi thuật toán liên quan
    },
    {
      title: "Primality Testing",
      description:
        "Primality testing is the process of determining whether a number is prime or composite.",
      color: "teal",
      link: "/primality-testing", // Thêm link tương ứng cho mỗi thuật toán liên quan
    },
    {
      title: "Generate Primes",
      description:
        "Generate Primes helps create random prime numbers of specified bit lengths, which are essential for cryptographic applications and secure data transmission.",
      color: "indigo", // Thay đổi màu sắc cho Generate Primes
      link: "/generate-prime",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      {/* Cryptographic Systems Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
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
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              fontWeight="bold"
            >
              {project.title}
            </Typography>
            <Typography>{project.description}</Typography>
            <Link to={project.link} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  backgroundColor: "white",
                  color: project.color,
                }}
              >
                Try Now
              </Button>
            </Link>
          </Box>
        ))}
      </Box>

      {/* Signature Section */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 4 }}
        fontWeight="bold"
      >
        Signature Diagrams
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
            <Link to={diagram.link} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  backgroundColor: "white",
                  color: diagram.color,
                }}
              >
                Try Now
              </Button>
            </Link>
          </Box>
        ))}
      </Box>

      {/* Các thuật toán liên quan Section */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 4 }}
        fontWeight="bold"
      >
        Related Algorithms
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
              borderRadius: "10px",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {algorithm.title}
            </Typography>
            <Typography>{algorithm.description}</Typography>
            <Link to={algorithm.link} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  backgroundColor: "white",
                  color: algorithm.color,
                }}
              >
                Learn More
              </Button>
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Homepage;
