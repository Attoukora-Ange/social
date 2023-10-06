import TextField from "@mui/material/TextField";
import { Button, Stack, Snackbar, styled } from "@mui/material";
import { forwardRef, useState } from "react";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
const StyledButton = styled(Button)({
  margin: "0 auto",
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ModifierPassword = ({ setShowModifierPassword }) => {
  const { user } = USE_USER_CONTEXTE();
  const [openErreur, setOpenErreur] = useState(false);
  const [openSucces, setOpenSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [userMod, setUserMod] = useState({
    holdPassword: "",
    newPassword: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
    setOpenSucces(false);
  };

  const handleChange = (e) => {
    setUserMod((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModifierPassword = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const USER_DATA = await axios.put(
        `${process.env.REACT_APP_API}/user/password/${id}`,
        userMod,
        OPTIONS
      );
      setOpenSucces(true);
      setSucces(USER_DATA.data.success);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      setOpenErreur(true);
      setErreur(errorMessage);
    }
  };

  return (
    <Stack
      py={2}
      gap={1}
      justifyContent="center"
      alignItems="center"
      direction="column"
      component="form"
    >
      <StyledTextField
        id="password"
        label="Ancien mot de passe"
        type="password"
        variant="outlined"
        autoComplete="false"
        size="small"
        name="holdPassword"
        value={userMod.holdPassword}
        onChange={handleChange}
      />
      <StyledTextField
        id="newPassword"
        label="Nouveau mot de passe"
        type="password"
        variant="outlined"
        autoComplete="false"
        size="small"
        name="newPassword"
        value={userMod.newPassword}
        onChange={handleChange}
      />
      <Stack direction="row" gap={2}>
        <StyledButton
          onClick={() => handleModifierPassword(user?._id)}
          variant="contained"
          color="success"
          disableElevation
        >
          Modifier
        </StyledButton>
        <StyledButton
          onClick={() => setShowModifierPassword(false)}
          variant="contained"
          color="error"
          disableElevation
        >
          Annuler
        </StyledButton>
      </Stack>
      <Snackbar open={openErreur} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {erreur}
        </Alert>
      </Snackbar>
      <Snackbar open={openSucces} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {succes}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
