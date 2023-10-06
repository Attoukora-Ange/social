import React from "react";
import { Box, Typography } from "@mui/material";
import { FollowerDetail } from "./FollowerDetail";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const Follower = () => {
  const { user, users } = USE_USER_CONTEXTE();

  return (
    <Box>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Followers
      </Typography>
      {user?.followers.map((followerId) => {
        const follower = users.find((membre) => membre._id === followerId);
        if (follower) {
          return <FollowerDetail key={follower._id} membre={follower} />;
        }

        return null;
      })}
    </Box>
  );
};
