import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import { forwardRef, useRef, useState } from "react";
import { ERROR, USER } from "../../reduce/Action";
import axios from "axios";
import { Button, Stack } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ProfilCard = () => {
  const { user, dispatch } = USE_USER_CONTEXTE();
  const [selectedFile, setSelectedFile] = useState();
  const [openErreur, setOpenErreur] = useState(false);
  const [erreur, setErreur] = useState("");
  const inputFile = useRef();

  const handlePubler = async () => {
    const FD = new FormData();
    FD.set("image_profil", selectedFile);

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      };

      // Envoi de l'image de profil
      await axios.put(
        `${process.env.REACT_APP_API}/user/image/${user?._id}`,
        { image_profil: FD.get("image_profil") },
        OPTIONS
      );

      setSelectedFile(""); // Réinitialisation du fichier sélectionné

      // Mise à jour des données utilisateur
      const USER_DATA = await axios.get(
        `${process.env.REACT_APP_API}/user/${user?._id}`,
        OPTIONS
      );

      dispatch({ type: USER, payload: USER_DATA.data.user });
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : error.message;
      setOpenErreur(true);
      setErreur(errorMessage);
      dispatch({ type: ERROR });
    }
  };

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCloseSnackBar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };

  return (
    <Stack>
      {selectedFile ? (
        <Button onClick={handlePubler}>Enregistrer</Button>
      ) : (
        <Button onClick={() => inputFile.current.click()}>
          Modifier la photo
        </Button>
      )}

      <Card onClick={() => inputFile.current.click()} sx={{ maxWidth: 445 }}>
        <input
          ref={inputFile}
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileUpload}
          hidden
        />
        <CardMedia
          component="img"
          height={400}
          image={
            selectedFile
              ? URL.createObjectURL(selectedFile) // Affiche l'image sélectionnée
              : user?.photo // Affiche l'image du profil actuelle
          }
          alt={
            selectedFile ? "modification de l'image poste" : user?.nom_prenoms
          }
        />

        <Snackbar
          open={openErreur}
          autoHideDuration={3000}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {erreur}
          </Alert>
        </Snackbar>
      </Card>
    </Stack>
  );
};
