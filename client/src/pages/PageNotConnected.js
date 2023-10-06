import { Box, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Connexion } from "../components/login/Connexion";
import { Inscription } from "../components/register/Inscription";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "block",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const PageNotConnected = () => {
  return (
    <StyledBox bgcolor="#ffffff" flexGrow={1} p={1} m={1} >
      <Connexion />
      <Divider />
      <Inscription />
    </StyledBox>
  );
};
