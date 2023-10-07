import { Box, Stack, Typography } from "@mui/material";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";
import { ListeUtilisateur } from "./ListeUtilisateur";

export const PageUtilisateur = () => {
  const { users } = USE_USER_CONTEXTE();
  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        pb={2}
      >
        Listes des utilisateurs
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="div"
      >
        {users?.map((membre) => {
          return <ListeUtilisateur key={membre._id} membre={membre} />;
        })}
      </Stack>
    </Box>
  );
};
