import { useState } from "react";
import { InfoProfil } from "../components/profil/InfoProfil";
import { ProfilCard } from "../components/profil/ProfilCard";
import { ModifierProfil } from "../components/profil/ModifierProfil";
import { Box, Button, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ModifierPassword } from "../components/profil/ModifierPassword";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "stretch",
  marginBottom: 20,
  gap: 12,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const Profil = () => {
  const [showModifierProfil, setShowModifierProfil] = useState(false);
  const [showModifierPassword, setShowModifierPassword] = useState(false);

  const handleModifierProfil = ()=>{
    setShowModifierProfil(true)
    setShowModifierPassword(false)
  }

  const handleModifierPassword = ()=>{
    setShowModifierProfil(false)
    setShowModifierPassword(true)
  }

  return (
    <Box sx={{ padding: 2, minWidth: 400 }}>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        py={2}
      >
        Mon compte
      </Typography>
      <StyledBox>
        <ProfilCard  />
        <InfoProfil />
      </StyledBox>
      <Stack
        gap={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          onClick={handleModifierProfil}
          variant="contained"
          color="info"
          disableElevation
        >
          Modifier mon compte
        </Button>
        <Button
          onClick={handleModifierPassword}
          variant="contained"
          color="success"
          disableElevation
        >
          Modifier mon mot de passe
        </Button>
      </Stack>
      {showModifierProfil && <ModifierProfil setShowModifierProfil={setShowModifierProfil}/>}
      {showModifierPassword && <ModifierPassword  setShowModifierPassword={setShowModifierPassword} />}
    </Box>
  );
};
