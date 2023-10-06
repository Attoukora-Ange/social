import { Box, Typography } from "@mui/material";
import { AnniverssaireDetail } from "./AnniverssaireDetail";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";
import { alerterAnniversaire } from "../../../../utils/utils";

export const Anniverssaire = () => {
  const { users, user } = USE_USER_CONTEXTE();

  return (
    <Box flexGrow={1} p={1}>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Anniversaires
      </Typography>
      {user?.following.map((followingId) => {
        const following = users.find(
          (membre) =>
            membre._id === followingId &&
            alerterAnniversaire(membre.date_naissance)
        );
        if (following) {
          return <AnniverssaireDetail key={following._id} membre={following} />;
        }

        return null; // Ignorer les followers sans correspondance
      })}
    </Box>
  );
};
