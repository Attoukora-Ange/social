import { Box, Stack, Typography } from "@mui/material";
import { ListeSuggestion } from "./ListeSuggestion";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const PageSuggestion = () => {
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
        Listes des suggestions
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="div"
      >
        {user?.suggestion.map((suggId) => {
          const membre = users?.find((membre) => membre._id === suggId);
          if (membre && user?._id !== membre._id) {
            return <ListeSuggestion key={membre._id} membre={membre} />;
          }
          return null;
        })}
      </Stack>
    </Box>
  );
};
