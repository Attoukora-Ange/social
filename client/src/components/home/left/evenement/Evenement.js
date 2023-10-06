import { Box, Stack, Typography } from "@mui/material";
import { EvenementDetail } from "./EvenementDetail";
import { USE_POST_CONTEXTE } from "../../../../reduce/Contexte";

export const Evenement = () => {
  const { info } = USE_POST_CONTEXTE();
  return (
    <Box
      sx={{
        minWidth: 450,
        padding: 2,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" component="div" color="#099e4c">
        Listes des évènements
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="div"
      >
        {info?.map((inf) => (
          <EvenementDetail key={inf._id} inf={inf} />
        ))}
      </Stack>
    </Box>
  );
};
