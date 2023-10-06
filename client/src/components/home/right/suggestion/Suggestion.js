import { Box, Typography } from "@mui/material";
import { SuggestionDetail } from "./SuggestionDetail";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";

export const Suggestion = () => {
  const { user, users } = USE_USER_CONTEXTE();

  return (
    <Box>
      <Typography variant="body1" component="div" color="#0f0f0f">
        Suggestions
      </Typography>
      {user?.suggestion.map((sugg) => {
        const membre = users?.find((membre) => membre._id === sugg);
        if (membre && user?._id !== membre._id) {
          return <SuggestionDetail key={membre._id} membre={membre} />;
        }
        return null;
      })}
    </Box>
  );
};
