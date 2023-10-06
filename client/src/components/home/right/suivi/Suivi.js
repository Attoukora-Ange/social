import React from "react";
import { Box, Typography } from "@mui/material";
import SuiviDetail from "./SuiviDetail";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const Suivi = () => {
  const { user } = USE_USER_CONTEXTE();

  return (
    <Box>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Suivi(e)s
      </Typography>
      <SuiviDetail suivis={user?.following || []} />
    </Box>
  );
};
