import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTypographyNumber = styled(Typography)(({ theme }) => ({
  fontSize: 100,
  fontWeight: 700,
  fontFamily: "Montserrat",
  color: "red",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    fontSize: 50,
    width: "100%",
  },
}));

const StyledTypographyText1 = styled(Typography)(({ theme }) => ({
  fontSize: 50,
  fontWeight: 500,
  fontFamily: "Montserrat",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    fontSize: 30,
    width: "100%",
  },
}));

const StyledTypographyText2 = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 500,
  fontFamily: "Montserrat",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    fontSize: 14,
    width: "100%",
  },
}));

const StyledContainer = styled(Container)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  minHeight: "65vh",
  minWidth:400
}));

export const PageNotFound = () => {
  return (
    <StyledContainer >
      <StyledTypographyNumber>404</StyledTypographyNumber>
      <StyledTypographyText1>Page non trouvée</StyledTypographyText1>
      <StyledTypographyText2>
        Nous sommes désolée, la page que vous recherchée n'existe pas sur notre
        site web !
      </StyledTypographyText2>
    </StyledContainer>
  );
};
