import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import { CONNEXION, USERS } from "../../reduce/Action";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import axios from "axios";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 600,
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));
const StyledLink = styled(Link)({
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "Montserrat",
  color: "#0175C4",
  textDecoration: "none",
  "&:hover": {
    color: "#34d25f",
  },
});
const StyledButton = styled(Button)({
  margin: "0 auto",
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Connexion = () => {
  const { dispatch } = USE_USER_CONTEXTE();
  const navigate = useNavigate();
  const [openErreur, setOpenErreur] = useState(false);
  const [erreur, setErreur] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleConnexion = async () => {
    try {
      const OPTIONS = {};
      const USER_DATA = await axios.post(
        `${process.env.REACT_APP_API}/user/connexion`,
        user,
        OPTIONS
      );

      // Enregistre le token dans le localStorage
      localStorage.setItem("token", JSON.stringify(USER_DATA.data.token));

      // Met à jour l'état de l'utilisateur
      dispatch({ type: CONNEXION, payload: USER_DATA.data.user });

      // Réinitialise les champs du formulaire
      setUser({
        email: "",
        password: "",
      });

      // Récupère la liste de tous les utilisateurs
      await AXIOS_TO_GET_USER();
    } catch (error) {
      // Gère les erreurs de connexion (par exemple, affiche un message d'erreur)
      setOpenErreur(true);
      setErreur(
        error.response?.data?.error ||
          "Une erreur s'est produite lors de la connexion."
      );
    }
  };

  const AXIOS_TO_GET_USER = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        // Si le token n'est pas présent, l'utilisateur n'est pas connecté
        return;
      }

      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const USER_DATA = await axios.get(
        `${process.env.REACT_APP_API}/user`,
        OPTIONS
      );

      // Met à jour la liste de tous les utilisateurs
      dispatch({ type: USERS, payload: USER_DATA.data.user });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      // Gère les erreurs de récupération des utilisateurs (par exemple, affiche un message d'erreur)
      navigate("/error");
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
        AIHCI
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
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {erreur}
          </Alert>
        </Snackbar>
        <StyledTextField
          id="emailConnexion"
          label="Email"
          type="email"
          variant="outlined"
          size="small"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <StyledTextField
          id="passwordConnexion"
          label="Mot de passe"
          type="password"
          variant="outlined"
          autoComplete="false"
          size="small"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
        <Stack direction="row" gap={2}>
          <StyledButton
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleConnexion}
          >
            Se connecter
          </StyledButton>
        </Stack>
        <StyledLink to="/mot_passe/oublie">Mot de passe oublié</StyledLink>
        <StyledLink to="/inscription">Créer nouveau compte</StyledLink>
      </Stack>
    </Box>
  );
};
