import { Box, Divider } from "@mui/material";
import { Suggestion } from "./right/suggestion/Suggestion";
import { Anniverssaire } from "./right/anniversaire/Anniverssaire";
import { Information } from "./right/information/Information";
import { styled } from "@mui/material/styles";
import { Suivi } from "./right/suivi/Suivi";
import { Follower } from "./right/follower/Follower";
import { Utilisateur } from "./right/utilisateur/Utilisateur";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "block",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const Right = () => {
  return (
    <StyledBox flexGrow={1} p={1}>
      <Information />
      <Divider />
      <Anniverssaire />
      <Divider />
      <Suggestion />
      <Divider />
      <Suivi />
      <Divider />
      <Follower />
      <Divider />
      <Utilisateur />
    </StyledBox>
  );
};
