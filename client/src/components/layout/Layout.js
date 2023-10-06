import React from "react";
import { Navigation } from "../navigation/Navigation";
import { Footer } from "../footer/Footer";
import { Box } from "@mui/material";

export const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <Box sx={{ mt: 8 }}>{children}</Box>
      <Footer />
    </>
  );
};
