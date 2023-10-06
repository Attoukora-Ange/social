import React from "react";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

const SuiviDetail = ({ suivis }) => {
  const { users } = USE_USER_CONTEXTE();

  return (
    <AvatarGroup max={6} total={suivis.length}>
      {suivis.map((suivi) => {
        const membre = users.find((m) => m._id === suivi);

        if (membre) {
          return (
            <Box key={membre._id}>
              <Avatar alt={membre.nom_prenoms} src={`${membre.photo}`} />
            </Box>
          );
        }

        return null; // Ignorer les suivis sans correspondance
      })}
    </AvatarGroup>
  );
};

export default SuiviDetail;
