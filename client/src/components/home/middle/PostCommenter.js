import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  InputBase,
  Avatar,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { ALL_POST, ALL_SOUVENIR, ERROR } from "../../../reduce/Action";
import { USE_POST_CONTEXTE, USE_USER_CONTEXTE } from "../../../reduce/Contexte";
import { forwardRef, useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  minWidth: 400,
  backgroundColor: "inherit",
  "&:hover": {
    backgroundColor: "#F2F3F5",
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  fontSize: 25,
  "& .MuiInputBase-input": {
    borderRadius: 10,
    padding: theme.spacing(1, 1, 1, 0),
    backgroundColor: "#F2F3F5",
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const PostCommenter = ({ open, handleClose, id }) => {
  const { user } = USE_USER_CONTEXTE();
  const { dispatch } = USE_POST_CONTEXTE();
  const [content, setContent] = useState("");
  const [openErreur, setOpenErreur] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleCloseSnackBar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleCommentaire = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Effectuer la mise à jour du commentaire
      await axios.patch(
        `${process.env.REACT_APP_API}/post/poster/commentaire/${id}`,
        { content },
        OPTIONS
      );

      // Fermer le dialogue de commentaire
      handleClose();

      // Rafraîchir la liste des commentaires
      const AXIOS_TO_GET_POST = async () => {
        const OPTIONS = {};
        const POST_DATA = await axios.get(
          `${process.env.REACT_APP_API}/post/poster`,
          OPTIONS
        );

        // Rafraîchir la liste des souvenirs
        AXIOS_TO_GET_POST_SOUVENIR();

        // Mettre à jour le state avec les nouveaux commentaires
        dispatch({ type: ALL_POST, payload: POST_DATA.data.post });

        // Réinitialiser le contenu du commentaire
        setContent("");
      };

      // Rafraîchir la liste des souvenirs
      const AXIOS_TO_GET_POST_SOUVENIR = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        const POST_DATA_SOUVENIR = await axios.get(
          `${process.env.REACT_APP_API}/post/poster/souvenir`,
          OPTIONS
        );

        // Mettre à jour le state avec les nouveaux souvenirs
        dispatch({
          type: ALL_SOUVENIR,
          payload: POST_DATA_SOUVENIR.data.post,
        });
      };

      // Appeler la fonction pour rafraîchir la liste des commentaires
      AXIOS_TO_GET_POST().catch(() => {
        dispatch({ type: ERROR });
      });
    } catch (error) {
      setOpenErreur(true);
      setErreur(error.message);
      dispatch({ type: ERROR });
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center", fontSize: 30 }}
        id="customized-dialog-title"
      >
        Poster votre commentaire
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ overflowY: "initial" }} dividers>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ p: 0.5 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  alt={user?.nom_prenoms}
                  src={user?.photo}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user?.nom_prenoms}
                secondary="Commenter maintenant.."
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Search>
          <StyledInputBase
            placeholder="Ecrire un commentaire public..."
            inputProps={{ "aria-label": "search" }}
            multiline
            rows={2}
            value={content}
            onChange={handleChange}
          />
        </Search>
      </DialogContent>
      <DialogActions>
        <Button
          color="success"
          autoFocus
          startIcon={<SendIcon />}
          onClick={() => handleCommentaire(id)}
        >
          Envoyer
        </Button>
      </DialogActions>
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
    </Dialog>
  );
};
