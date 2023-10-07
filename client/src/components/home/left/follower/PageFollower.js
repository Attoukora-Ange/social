import { Box, Stack, Typography } from "@mui/material";
import { ListeFollower } from "./ListeFollower";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const PageFollower = () => {
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
        Listes de mes Folowers
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="div"
      >
        {user?.followers.map((followerId) => {
          const follower = users.find((membre) => membre._id === followerId);
          if (follower) {
            return <ListeFollower key={follower._id} membre={follower} />;
          }
          return null;
        })}
      </Stack>
    </Box>
  );
};
