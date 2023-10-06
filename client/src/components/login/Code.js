import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Stack,
  Typography,
  Snackbar,
  styled,
} from "@mui/material";
import { useState, forwardRef } from "react";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

export const Code = () => {
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");
  const [openSucces, setOpenSucces] = useState(false);
  const [succes, setSucces] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    codePasseGenere: "",
    newPassword: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSucces(false);
  };

  const performPostRequest = async (url) => {
    try {
      const id = JSON.parse(localStorage.getItem("id"));
      const OPTIONS = {
        headers: {
          id,
        },
      };
      const DATA_EMAIL = await axios.put(
        url,
        {
          ...user,
        },
        OPTIONS
      );
      setOpenSucces(true);
      setSucces(DATA_EMAIL.data.message);
      localStorage.setItem("id", JSON.stringify(DATA_EMAIL.data.userId));

      setTimeout(() => {
        navigate("/connexion");
      }, 7000);
    } catch (error) {
      console.log(error);
      setOpenError(true);
      setError(error.response.data.error);
    }
  };

  const handleClick = (e) => {
    try {
      e.preventDefault();
      const url = `${process.env.REACT_APP_API}/user/reinitialisation/password`;
      performPostRequest(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAnnuler = () => {
    setUser({
      codePasseGenere: "",
      newPassword: "",
    });
  };

  return (
    <Box sx={{ padding: 2, minWidth: 400 }}>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        pb={2}
      >
        AIHCI
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="form"
      >
        <StyledTextField
          id="codePasseGenere"
          label="Entrer votre code à 6 chiffres"
          type="text"
          variant="outlined"
          size="small"
          name="codePasseGenere"
          value={user.codePasseGenere}
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
          value={user.newPassword}
          onChange={handleChange}
        />
        <Stack direction="row" gap={2}>
          <StyledButton
            onClick={handleAnnuler}
            variant="outlined"
            color="error"
            disableElevation
          >
            Annuler
          </StyledButton>
          <StyledButton
            onClick={handleClick}
            variant="contained"
            color="primary"
            disableElevation
          >
            Continuer
          </StyledButton>
        </Stack>
      </Stack>
      <Snackbar open={openSucces} autoHideDuration={7000} onClose={handleClose}>
        <Alert
          onClose={() => setOpenSucces(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {succes}
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
