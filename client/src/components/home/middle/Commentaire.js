import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { ModCommentaire } from "./ModCommentaire";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { USE_POST_CONTEXTE, USE_USER_CONTEXTE } from "../../../reduce/Contexte";
import { ALL_POST, ALL_SOUVENIR, ERROR } from "../../../reduce/Action";
import { calculerJoursDepuisCreationArticle } from "../../../utils/utils";

export const Commentaire = ({ postId, comment }) => {
  const { user, connect } = USE_USER_CONTEXTE();
  const { dispatch } = USE_POST_CONTEXTE();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteCommentaire = async (id) => {
    try {
      // Récupérer le token depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Effectuer la suppression du commentaire spécifié
      await axios.patch(
        `${process.env.REACT_APP_API}/post/poster/commentaire/delete/${id}`,
        { contentId: comment._id },
        OPTIONS
      );

      // Rafraîchir la liste des publications après la suppression du commentaire
      await refreshPostList();

      // Rafraîchir la liste des souvenirs après la suppression du commentaire
      await refreshSouvenirList();
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  const refreshPostList = async () => {
    try {
      const OPTIONS = {};
      const POST_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/poster`,
        OPTIONS
      );

      // Mettre à jour le state avec les nouvelles publications
      dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  const refreshSouvenirList = async () => {
    try {
      // Récupérer le token depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      };

      const POST_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/poster/souvenir`,
        OPTIONS
      );

      // Mettre à jour le state avec les nouveaux souvenirs
      dispatch({ type: ALL_SOUVENIR, payload: POST_DATA.data.post });
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  return (
    <CardContent sx={{ backgroundColor: "#EBEDF0", borderRadius: 5, m: 5 }}>
      <List sx={{ width: "100%", p: 0 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ p: 0.5 }}>
            <ListItemAvatar>
              <Avatar
                sx={{ width: 30, height: 30 }}
                alt={comment.commentaireUser.nom_prenoms}
                src={comment.commentaireUser.photo}
              />
            </ListItemAvatar>
            <ListItemText
              primary={comment.commentaireUser.nom_prenoms}
              secondary={`${calculerJoursDepuisCreationArticle(
                new Date(comment.timestamp)
              )} `}
            />
          </ListItemButton>
          {connect &&
            (user?._id === comment.commentaireUser._id ? (
              <>
                <IconButton
                  component={Link}
                  to={"/mon-compte"}
                  aria-label="visible"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen} aria-label="editer">
                  <ModeEditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCommentaire(postId)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  component={Link}
                  to={"/utilisateur/" + comment.commentaireUser._id}
                  aria-label="visible"
                >
                  <VisibilityIcon />
                </IconButton>
              </>
            ))}
        </ListItem>
      </List>
      <Typography paragraph>{comment.commentairetexte}</Typography>
      <ModCommentaire
        postId={postId}
        contentId={comment._id}
        contentComment={comment.commentairetexte}
        open={open}
        handleClose={handleClose}
      />
    </CardContent>
  );
};
