import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button } from "@mui/material";

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState("");

  const handleMenuOpen = (event, menuName) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menuName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu("");
  };

  const menuItems = {
    RSA: [
      { label: "RSA Tool", link: "/rsa" },
      { label: "RSA Signature", link: "/rsa-signature" },
    ],
    ElGamal: [
      { label: "ElGamal Tool", link: "/elgamal" },
      { label: "ElGamal Signature", link: "/elgamal-signature" },
    ],
    ECC: [
      { label: "ECC Tool", link: "/ecc" },
      { label: "ECC Signature", link: "/ecc-signature" },
    ],
    "Related Algorithms": [
      { label: "Factorization", link: "/factors" },
      { label: "Primality Testing", link: "/primality-testing" },
      { label: "Generate Primes", link: "/generate-prime"}
    ],
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1a1a1a", padding: "0.5rem 1rem" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            fontSize: "1.5rem",
            color: "white",
          }}
        >
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            CryptLearn
          </Link>
        </Typography>

        {/* Menu Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {Object.keys(menuItems).map((menuName) => (
            <div key={menuName} style={{ position: "relative" }}>
              <Button
                onClick={(event) => handleMenuOpen(event, menuName)}
                sx={{
                  color: "white",
                  textTransform: "capitalize",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                {menuName}
              </Button>

              {/* Render Menu */}
              <Menu
                anchorEl={openMenu === menuName ? anchorEl : null}
                open={openMenu === menuName}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
                    padding: "0.5rem 0",
                  },
                }}
              >
                {menuItems[menuName].map((item, index) => (
                  <MenuItem
                    key={index}
                    component={Link}
                    to={item.link}
                    sx={{
                      fontSize: "1rem",
                      padding: "0.7rem 2rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
