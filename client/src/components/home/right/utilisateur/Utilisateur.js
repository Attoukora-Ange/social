import { Box, Typography } from "@mui/material";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";
import { UtilisateurDetail } from "./UtilisateurDetail";

export const Utilisateur = () => {
  const { user, users } = USE_USER_CONTEXTE();

  return (
    <Box>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Utilisateurs à suivre
      </Typography>
      {users?.map((membre) => {
        return <UtilisateurDetail key={membre._id} membre={membre} />;
      })}
    </Box>
  );
};
