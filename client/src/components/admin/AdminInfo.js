import { Stack, Container, Typography, styled, Box } from "@mui/material";
import { CreationInfo } from "./CreationInfo";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 500,
  fontFamily: "Montserrat",
  paddingTop: 1,
  marginLeft: 3,
  marginTop: 5,
  marginBottom: 5,
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    fontSize: 24,
    padding: "10px",
    marginLeft: 0,
    marginTop: 20,
    marginBottom: "10px",
    width: "100%",
  },
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "start",
  marginBottom: 10,
  [theme.breakpoints.down("md")]: {
    display: "block",
  },
}));

const StyleBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
  },
}));

export const AdminInfo = () => {
  return (
    <StyledStack direction="row">
      <StyleBox flexWrap="wrap">
        <Container maxWidth="xl">
          <StyledTypography variant="h4" textAlign="center" component="div">
            Création d'information
          </StyledTypography>
          <CreationInfo />
        </Container>
      </StyleBox>
    </StyledStack>
  );
};
