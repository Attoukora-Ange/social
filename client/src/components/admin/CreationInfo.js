import TextField from "@mui/material/TextField";
import { Button, Stack, Snackbar, styled } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useState } from "react";
import axios from "axios";
import { ALL_INFO, ALL_POST, ERROR } from "../../reduce/Action";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CreationInfo = () => {
  const { dispatch } = USE_USER_CONTEXTE();
  const [fichier, setFichier] = useState(null);
  const [openErreur, setOpenErreur] = useState(false);
  const [openSucces, setOpenSucces] = useState(false);
  const [erreur, setErreur] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState({
    title: "",
    content: "",
  });

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
    setOpenSucces(false);
  };

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      };

      const data = new FormData();
      data.set("title", info.title);
      data.set("content", info.content);
      data.set("fichier_information", fichier);

      await axios.post(
        `${process.env.REACT_APP_API}/post/information`,
        {
          title: data.get("title"),
          content: data.get("content"),
          fichier_information: data.get("fichier_information"),
        },
        OPTIONS
      );
      setOpenSucces(true);
      setSuccess("Information envoyé");

      //On fetch sur tous les poster

      const POST_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/poster`,
        OPTIONS
      );
      dispatch({ type: ALL_INFO, payload: POST_DATA.data.post });
      dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
    } catch (error) {
      setOpenErreur(true);
      setErreur(error.response?.data?.error || error.message);
      dispatch({ type: ERROR });
    }
  };

  return (
    <Stack gap={1} justifyContent="center" component="form">
      <StyledTextField
        id="title"
        label="Titre de l'info"
        type="text"
        variant="outlined"
        size="small"
        name="title"
        value={info.title}
        onChange={handleChange}
      />
      <StyledTextField
        id="content"
        label="Contenu de l'info"
        type="text"
        variant="outlined"
        size="small"
        multiline
        rows={6}
        name="content"
        value={info.content}
        onChange={handleChange}
      />
      <StyledTextField
        id="fichier_information"
        type="file"
        variant="outlined"
        size="small"
        name="fichier_information"
        onChange={handleFileChange}
      />
      <StyledButton variant="contained" color="success" onClick={handleClick}>
        Envoyez
      </StyledButton>
      <Snackbar open={openSucces} autoHideDuration={3000} onClose={handleClose}>
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
