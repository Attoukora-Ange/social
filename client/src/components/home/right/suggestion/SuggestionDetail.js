import React, { useState } from "react";
import {
  Avatar,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import { Link } from "react-router-dom";
import axios from "axios";
import { forwardRef } from "react";
import { USE_USER_CONTEXTE } from "../../../../reduce/Contexte";
import { USER, USERS } from "../../../../reduce/Action";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SuggestionDetail = ({ membre }) => {
  const { user, dispatch } = USE_USER_CONTEXTE();
  const [openSucces, setOpenSucces] = useState(false);
  const [succes, setSucces] = useState("");

  // Fonction générique pour effectuer des appels PATCH
  const performPatchRequest = async (url, successMessage) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      await axios.patch(url, {}, OPTIONS);
      setOpenSucces(true);
      setSucces(successMessage);

      // Actualiser la liste des utilisateurs après l'action
      fetchUserList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const url = `${process.env.REACT_APP_API}/user/unsuggestion/${membre._id}`;
    performPatchRequest(url, "Suppression réussie");
  };

  const handleValidate = () => {
    const url = `${process.env.REACT_APP_API}/user/follower/${membre._id}`;
    performPatchRequest(url, "Validation réussie");
  };

  const fetchUserList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const USER_DATA = await axios.get(
        `${process.env.REACT_APP_API}/user`,
        OPTIONS
      );
      const USER_DATA_USER = await axios.get(
        `${process.env.REACT_APP_API}/user/${user?._id}`,
        OPTIONS
      );
      dispatch({ type: USER, payload: USER_DATA_USER.data.user });
      dispatch({ type: USERS, payload: USER_DATA.data.user });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <List sx={{ width: "100%", p: 0 }}>
      <ListItem sx={{ width: 250 }} disablePadding>
        <ListItemButton
          sx={{ p: 0.5 }}
          component={Link}
          to={`/utilisateur/${membre._id}`}
        >
          <ListItemAvatar>
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt={membre.nom_prenoms}
              src={`${membre.photo}`}
            />
          </ListItemAvatar>
          <ListItemText primary={membre.nom_prenoms} />
        </ListItemButton>
        <Tooltip onClick={handleDelete} title="Supprimer">
          <RemoveCircleIcon color="error" />
        </Tooltip>
        <Tooltip onClick={handleValidate} title="Suivre">
          <DownloadDoneIcon color="success" />
        </Tooltip>
      </ListItem>
      <Snackbar
        open={openSucces}
        autoHideDuration={3000}
        onClose={() => setOpenSucces(false)}
      >
        <Alert
          onClose={() => setOpenSucces(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {succes}
        </Alert>
      </Snackbar>
    </List>
  );
};
