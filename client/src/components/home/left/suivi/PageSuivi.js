import { Box, Stack, Typography } from "@mui/material";
import { ListeSuivi } from "./ListeSuivi";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const PageSuivi = () => {
  const { user, users } = USE_USER_CONTEXTE();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        pb={2}
      >
        Listes des personnes suivies
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="div"
      >
        {user?.following.map((followingId) => {
          const following = users.find((membre) => membre._id === followingId);
          if (following) {
            return <ListeSuivi key={following._id} membre={following} />;
          }
          return null;
        })}
      </Stack>
    </Box>
  );
};
