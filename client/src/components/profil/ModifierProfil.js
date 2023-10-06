import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Stack, Snackbar, styled } from "@mui/material";
import { forwardRef, useState } from "react";
import axios from "axios";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import MuiAlert from "@mui/material/Alert";
import { USER } from "../../reduce/Action";

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
const StyledButton = styled(Button)(({ theme }) => ({
  margin: "0 auto",
}));

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
const matrimoniale = ["Célibataire", "En couple", "Marié", "Autre"];

export const ModifierProfil = ({ setShowModifierProfil }) => {
  const { user, dispatch } = USE_USER_CONTEXTE();
  const [openErreur, setOpenErreur] = useState(false);
  const [openSucces, setOpenSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [userMod, setUserMod] = useState({
    genre: user?.genre,
    nom_prenoms: user?.nom_prenoms,
    date_naissance: "",
    email: user?.email,
    pays: user?.pays,
    profession: user?.profession,
    matrimoniale: user?.matrimoniale,
    biographie: user?.biographie,
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

  const handleChangeAutocomplete = (name) => (_, newValeur) => {
    setUserMod((prev) => ({
      ...prev,
      [name]: newValeur,
    }));
  };

  const handleModifierMonProfil = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const USER_DATA = await axios.put(
        `${process.env.REACT_APP_API}/user/${id}`,
        userMod,
        OPTIONS
      );
      setOpenSucces(true);
      setSucces(USER_DATA.data.success);
      dispatch({ type: USER, payload: USER_DATA.data.user });
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
      <StyledAutocomplete
        size="small"
        disablePortal
        id="genre"
        options={genre}
        renderInput={(params) => <TextField {...params} label="Genre" />}
        onChange={handleChangeAutocomplete("genre")}
      />
      <StyledTextField
        id="nom_prenoms"
        label="Nom et prénoms"
        type="text"
        variant="outlined"
        size="small"
        name="nom_prenoms"
        value={userMod?.nom_prenoms}
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
      <StyledTextField
        id="date_naissance"
        label="Date de naissance"
        type="date"
        variant="outlined"
        size="small"
        name="date_naissance"
        onChange={handleChange}
      />

      <StyledTextField
        id="email"
        label="Email"
        type="email"
        variant="outlined"
        size="small"
        name="email"
        value={userMod?.email}
        onChange={handleChange}
      />
      <StyledAutocomplete
        size="small"
        disablePortal
        id="matrimoniale"
        options={matrimoniale}
        renderInput={(params) => (
          <TextField {...params} label="Situation matrimoniale" />
        )}
        onChange={handleChangeAutocomplete("matrimoniale")}
      />
      <StyledTextField
        id="ville"
        label="Ville actuelle"
        type="text"
        variant="outlined"
        size="small"
        name="ville"
        value={userMod?.ville}
        onChange={handleChange}
      />
      <StyledTextField
        id="profession"
        label="Profession"
        type="text"
        variant="outlined"
        size="small"
        name="profession"
        value={userMod?.profession}
        onChange={handleChange}
      />
      <StyledTextField
        id="biographie"
        label="Biographie"
        type="text"
        variant="outlined"
        size="small"
        name="biographie"
        value={userMod?.biographie}
        onChange={handleChange}
      />
      <Stack direction="row" gap={2}>
        <StyledButton
          onClick={() => handleModifierMonProfil(user?._id)}
          variant="contained"
          color="success"
          disableElevation
        >
          Modifier
        </StyledButton>
        <StyledButton
          onClick={() => setShowModifierProfil(false)}
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
