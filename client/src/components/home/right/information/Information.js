import { Box, Typography } from "@mui/material";
import { InformationDetail } from "./InformationDetail";
import { USE_POST_CONTEXTE } from "../../../../reduce/Contexte";

export const Information = () => {
  const { info } = USE_POST_CONTEXTE();
  return (
    <Box flexGrow={1} p={1}>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Informations
      </Typography>
      {info?.map((inf) => (
        <InformationDetail key={inf._id} inf={inf} />
      ))}
    </Box>
  );
};
