import { Container, Divider, Typography, styled } from "@mui/material";
import { AdminInfo } from "../components/admin/AdminInfo";
import { Link } from "react-router-dom";

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "#0f0f0f",
  display: "block",
  textTransform: "capitalize",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: 16,
  padding: 10,
  fontFamily: "Roboto",
  transition: "color .3s ease",
  "&:hover": {
    color: "#099e4c",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: 10,
    textAlign: "center",
  },
}));
export const Admin = () => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "center", gap: 5, mt: 2 }}
      >
        <StyledTypography component={Link} to="/administrateur/utilisateurs">
         LISTE DES UTILISATEURS
        </StyledTypography>
        <StyledTypography component={Link} to="/administrateur/problemes">
          PROBLEMES DECRITS
        </StyledTypography>
      </Container>
      <Container maxWidth="xl" sx={{ my: 1 }}>
        <Divider />
      </Container>
      <AdminInfo />
    </>
  );
};
