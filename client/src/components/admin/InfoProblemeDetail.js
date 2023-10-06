import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MuiAlert from "@mui/material/Alert";
import { Box, Button, Stack, Snackbar, Typography } from "@mui/material";
import { USE_POST_CONTEXTE } from "../../reduce/Contexte";
import { useState, forwardRef } from "react";
import axios from "axios";
import { ALL_PROBLEME } from "../../reduce/Action";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const InfoProblemeDetail = () => {
  const { probleme, dispatch } = USE_POST_CONTEXTE();
  const [openSucces, setOpenSucces] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [succes, setSucces] = useState("");
  const [error, setError] = useState("");
  const [dataVoir, setDataVoir] = useState("");
  const [voir, setVoir] = useState(false);

  const performGetRequest = async (url, successMessage) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const DATA_PROBLEME_ONE = await axios.get(url, OPTIONS);
      setDataVoir(DATA_PROBLEME_ONE.data.post);
      setOpenSucces(true);
      setVoir(true);
      setSucces(successMessage);

      // Actualiser la liste des utilisateurs après l'action
      fetchProblemeList();
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };
  const performDeleteRequest = async (url, successMessage) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(url, OPTIONS);
      setOpenSucces(true);
      setVoir(false);
      setSucces(successMessage);

      fetchProblemeList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    const url = `${process.env.REACT_APP_API}/post/probleme/${id}`;
    performDeleteRequest(url, "Suppression réussie");
  };
  
  const handleVoir = (id) => {
    const url = `${process.env.REACT_APP_API}/post/probleme/${id}`;
    performGetRequest(url, "Ouverture du message réussi");
  };

  const fetchProblemeList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const PROBLEME_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/probleme`,
        OPTIONS
      );
      dispatch({ type: ALL_PROBLEME, payload: PROBLEME_DATA.data.post });
    } catch (error) {
      console.error(error);
      setOpenError(true);
      setError(error.message);
    }
  };

  return (
    <>
      <TableContainer
        sx={{ maxWidth: 1000, maxHeight: "50vh" }}
        component={Paper}
      >
        <Table
          sx={{ minWidth: 650, maxWidth: "100%" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f0f0" }}>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Id</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Genre
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Nom et prénoms
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Pays</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Email
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Nature du problème
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Message
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {probleme?.map((prob, index) => (
              <TableRow
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 500 }}
                  component="th"
                  scope="row"
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {prob.postUser.genre}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {prob.postUser.nom_prenoms}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {prob.postUser.pays}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {prob.postUser.email}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {prob.nature}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 500, color: "yellowgreen" }}
                  component={Button}
                  size="small"
                  scope="row"
                  onClick={() => handleVoir(prob._id)}
                >
                  Voir problème
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 500, color: "red" }}
                  component={Button}
                  size="small"
                  scope="row"
                  onClick={() => handleDelete(prob._id)}
                >
                  Supprimer
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {voir && (
        <Stack
          mt={2}
          p={1}
          gap={1}
          border="1px solid black"
          borderRadius={2}
          maxWidth={1000}
        >
          <Typography variant="body1" component={Box}>
            {dataVoir?.postUser.genre} {dataVoir?.postUser.nom_prenoms}
          </Typography>
          <Typography variant="body2" component={Box} fontWeight={400}>
            Nature du problème : {dataVoir?.nature}
          </Typography>
          <Typography variant="body2" component={Box} fontWeight={300}>
            Message : {dataVoir?.message}
          </Typography>
        </Stack>
      )}
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
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={() => setOpenSucces(false)}
      >
        <Alert
          onClose={() => setOpenSucces(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
