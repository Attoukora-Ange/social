import TextField from "@mui/material/TextField";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  Button,
  Stack,
  Typography,
  styled,
  Snackbar,
} from "@mui/material";
import { useState, forwardRef } from "react";
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

export const PasswordOublie = () => {
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");
  const [openSucces, setOpenSucces] = useState(false);
  const [succes, setSucces] = useState("");
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
    setOpenSucces(false);
  };

  const performPostRequest = async (url) => {
    try {
      const OPTIONS = {};
      const DATA_EMAIL = await axios.post(url, { email }, OPTIONS);
      setOpenSucces(true);
      setSucces(DATA_EMAIL.data.message);
      localStorage.setItem("id", JSON.stringify(DATA_EMAIL.data.userId));

      setTimeout(() => {
        navigate("/mot_passe/code");
      }, 7000);
    } catch (error) {
      setOpenError(true);
      setError(error.response.data.error);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API}/user/reinitialisation/email`;
    performPostRequest(url);
  };

  const handleAnnuler = () => {
    setEmail("");
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
        AttoNexa
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="form"
      >
        <StyledTextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            Rechercher
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
