import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import { forwardRef, useState } from "react";
import axios from "axios";

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "Montserrat",
  color: "#0175C4",
  paddingTop: 1,
  marginLeft: 3,
  marginTop: 5,
  marginBottom: 5,
  textDecoration: "none",
  transition: "color .3s ease-in-out",
  "&:hover": {
    color: "#34d25f",
  },
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
    fontSize: 12,
    margin: 50,
    padding: "10px",
    marginLeft: 0,
    marginTop: 0,
    marginBottom: "10px",
    width: "100%",
  },
}));
const StyledButton = styled(Button)({
  margin: "0 auto",
});
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const pays = [
  "Bénin",
  "Burkina Faso",
  "Côte d'Ivoire",
  "Guinée-Bisseau",
  "Mali",
  "Niger",
  "Sénégal",
  "Togo",
];
const genre = ["Homme", "Femme", "Indifférent"];

export const Inscription = () => {
  const [openErreur, setOpenErreur] = useState(false);
  const [openSucces, setOpenSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [user, setUser] = useState({
    nom_prenoms: "",
    date_naissance: "",
    email: "",
    pays: "",
    genre: "",
    password: "",
    password_conf: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
    setOpenSucces(false);
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAutocomplete = (name) => (_, newValeur) => {
    setUser((prev) => ({
      ...prev,
      [name]: newValeur,
    }));
  };

  const handleInscription = async () => {
    try {
      const OPTIONS = {};
      const USER_DATA = await axios.post(
        `${process.env.REACT_APP_API}/user`,
        user,
        OPTIONS
      );
      setOpenSucces(true);
      setSucces(USER_DATA.data.success);
      setUser({
        nom_prenoms: "",
        date_naissance: "",
        email: "",
        pays: "",
        genre: "",
        password: "",
        password_conf: "",
      });
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      setOpenErreur(true);
      setErreur(errorMessage);
    }
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
        Rejoignez AttoNexa réseau social
      </Typography>
      <Stack
        gap={1}
        justifyContent="center"
        alignItems="center"
        direction="column"
        component="form"
      >
        <Snackbar
          open={openErreur}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {erreur}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSucces}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {succes}
          </Alert>
        </Snackbar>

        <StyledTextField
          id="nom_prenoms"
          label="Nom et prénoms"
          type="text"
          variant="outlined"
          size="small"
          name="nom_prenoms"
          value={user.nom_prenoms}
          onChange={handleChange}
        />
        <StyledTextField
          id="date_naissance"
          label="Date de naissance"
          type="date"
          variant="outlined"
          size="small"
          name="date_naissance"
          value={user.date_naissance}
          onChange={handleChange}
        />
        <StyledTextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <StyledAutocomplete
          size="small"
          disablePortal
          id="pays"
          options={pays}
          renderInput={(params) => <TextField {...params} label="Pays" />}
          onChange={handleChangeAutocomplete("pays")}
        />
        <StyledAutocomplete
          size="small"
          disablePortal
          id="genre"
          options={genre}
          renderInput={(params) => <TextField {...params} label="Genre" />}
          onChange={handleChangeAutocomplete("genre")}
        />
        <StyledTextField
          id="password"
          label="Choisir un mot de passe"
          type="password"
          variant="outlined"
          autoComplete="false"
          size="small"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
        <StyledTextField
          id="password_conf"
          label="Répéter le mot de passe"
          type="password"
          variant="outlined"
          autoComplete="false"
          size="small"
          name="password_conf"
          value={user.password_conf}
          onChange={handleChange}
        />
        <Stack direction="row" gap={2}>
          <StyledButton
            onClick={handleInscription}
            variant="contained"
            color="success"
            disableElevation
          >
            S'inscrire
          </StyledButton>
        </Stack>
        <StyledLink to="/connexion">
          Déjà inscrit(e) ? Je me connecte
        </StyledLink>
      </Stack>
    </Box>
  );
};
