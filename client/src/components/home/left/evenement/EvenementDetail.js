import React, { useState } from "react";
import {
  Box,
  Card,
  Snackbar,
  Button,
  styled,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";
import {
  USE_POST_CONTEXTE,
  USE_USER_CONTEXTE,
} from "../../../../reduce/Contexte";
import axios from "axios";
import { ALL_INFO } from "../../../../reduce/Action";

const StyledButton = styled(Button)({
  margin: "0 auto",
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const EvenementDetail = ({ inf }) => {
  const { dispatch } = USE_POST_CONTEXTE();
  const { user } = USE_USER_CONTEXTE();
  const [openSucces, setOpenSucces] = useState(false);
  const [succes, setSucces] = useState("");

  const performDeletRequest = async (url, successMessage) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(url, OPTIONS);
      setOpenSucces(true);
      setSucces(successMessage);

      // Actualiser la liste des utilisateurs après l'action
      fetchUserList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const url = `${process.env.REACT_APP_API}/post/information/${inf._id}`;
    performDeletRequest(url, "Suppression réussie");
  };

  const fetchUserList = async () => {
    try {
      const OPTIONS = {};
      const POST_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/information`,
        OPTIONS
      );
      dispatch({ type: ALL_INFO, payload: POST_DATA.data.information });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ display: "flex", my: 1, minWidth: 400 }}>
      <CardMedia
        component="img"
        sx={{ width: 200 }}
        image={`${inf.fichier}`}
        alt={inf.title}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {inf.title}
          </Typography>
          <Typography component="div" variant="body2">
            {inf.content}
          </Typography>
        </CardContent>
        <CardActions>
          {user?.isAdmin && (
            <StyledButton
              onClick={handleDelete}
              variant="contained"
              color="error"
              disableElevation
            >
              Supprimer
            </StyledButton>
          )}
        </CardActions>
      </Box>
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
    </Card>
  );
};
