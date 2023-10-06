import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Snackbar, Stack, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StyledAutocomplete = styled(Autocomplete)({
  width: 400,
});

const StyledTextField = styled(TextField)({
  width: 400,
});

const StyledButton = styled(Button)({
  width: "0 auto",
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const nature = [
  "Assistance d'usage",
  "Abus d'usage",
  "Problème de confidentialité",
  "Problème de sécurité",
  "Autres",
];

export const Probleme = () => {
  const [openErreur, setOpenErreur] = useState(false);
  const [erreur, setErreur] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [success, setSucess] = useState("");
  const [probleme, setProbleme] = useState({
    nature: "",
    message: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };

  const handleChange = (e) => {
    setProbleme((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeAutocomplete = (name) => (_, newValeur) => {
    setProbleme((prev) => ({
      ...prev,
      [name]: newValeur,
    }));
  };
  
  const handleClick = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const PROBLEME_DATA = await axios.post(
        `${process.env.REACT_APP_API}/post/probleme`,
        probleme,
        OPTIONS
      );
      setProbleme({
        message: "",
        nature: "",
      });
      setSucess(PROBLEME_DATA.data.message);
      setOpenSuccess(true);
    } catch (error) {
      setOpenErreur(true);
      setErreur(error.response.data.error || error.message);
    }
  };
  

  return (
    <Stack
      minWidth={450}
      gap={1}
      justifyContent="center"
      alignItems="center"
      component="form"
    >
      <Typography
        variant="h6"
        component="div"
        textAlign="left"
        color="green"
        py={1}
      >
       VEUILLEZ DECLARER LE PROBLEME
      </Typography>

      <StyledAutocomplete
        size="small"
        disablePortal
        id="nature"
        options={nature}
        renderInput={(params) => (
          <TextField {...params} label="Nature du problème" />
        )}
        onChange={handleChangeAutocomplete("nature")}
      />
      <StyledTextField
        id="message"
        label="Description du problème"
        type="text"
        variant="outlined"
        size="small"
        multiline
        rows={4}
        name="message"
        value={probleme.message}
        onChange={handleChange}
      />
      <StyledButton onClick={handleClick} variant="contained" color="success">
        Envoyez
      </StyledButton>
      <Snackbar
        open={openSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={openErreur} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {erreur}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
