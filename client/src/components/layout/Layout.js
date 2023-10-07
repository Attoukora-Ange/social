import React from "react";
import { Navigation } from "../navigation/Navigation";
import { Footer } from "../footer/Footer";
import { Box, Container } from "@mui/material";

export const Layout = ({ children }) => {
  return (
    <Container
      maxWidth="xl"
      sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 2 }}
    >
      <Navigation />
      <Box sx={{ mt: 8 }}>{children}</Box>
      <Footer />
    </Container>
  );
};
