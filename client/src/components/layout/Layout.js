import React from "react";
import { Navigation } from "../navigation/Navigation";
import { Footer } from "../footer/Footer";
import { Box, Container } from "@mui/material";

export const Layout = ({ children }) => {
  return (
    <Container maxWidth="xl">
      <Navigation />
      <Box sx={{ mt: 8 }}>{children}</Box>
      <Footer />
    </Container>
  );
};
