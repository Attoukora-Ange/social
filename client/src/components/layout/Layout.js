import React from "react";
import { Navigation } from "../navigation/Navigation";
import { Footer } from "../footer/Footer";
import { Box, styled } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    width: 600,
  },
}));

export const Layout = ({ children }) => {
  return (
    <StyledBox>
      <Navigation />
      <Box sx={{ mt: 8 }}>{children}</Box>
      <Footer />
    </StyledBox>
  );
};
