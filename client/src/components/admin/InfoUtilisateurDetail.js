import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import { USERS } from "../../reduce/Action";
import { useState, forwardRef } from "react";
import axios from "axios";
import { calculateAge } from "../../utils/utils";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const InfoUtilisateurDetail = () => {
  const { users, dispatch } = USE_USER_CONTEXTE();
  const [openSucces, setOpenSucces] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [succes, setSucces] = useState("");
  const [error, setError] = useState("");

  const performDeleteRequest = async (url, successMessage) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(url, OPTIONS);
      setSucces(successMessage);

      fetchUsersList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    const url = `${process.env.REACT_APP_API}/user/${id}`;
    performDeleteRequest(url, "Suppression réussie");
  };

  const fetchUsersList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const USERS_DATA = await axios.get(
        `${process.env.REACT_APP_API}/user`,
        OPTIONS
      );
      dispatch({ type: USERS, payload: USERS_DATA.data.user });
    } catch (error) {
      setOpenError(true);
      setError(error.message);
    }
  };

  return (
    <Stack gap={3} justifyContent="center" alignItems="center">
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
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Age</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Pays</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Email
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Situation matrimoniale
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Ville
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                profession
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                followers
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                following
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                suggestion
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Admin
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow
                hover
                key={user._id}
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
                  sx={{ fontSize: 12, fontWeight: 500 }}
                  component="th"
                  scope="row"
                >
                  {user.genre}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.nom_prenoms}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {calculateAge(user.date_naissance)}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.pays}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.email}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.matrimoniale}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.ville}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.profession}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.followers?.length}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.following?.length}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.suggestion?.length}
                </TableCell>
                <TableCell
                  sx={{ fontSize: 12, fontWeight: 300 }}
                  component="th"
                  scope="row"
                >
                  {user.isAdmin ? "Admin" : "Utilisateur"}
                </TableCell>
                {!user.isAdmin && (
                  <TableCell
                    sx={{ fontSize: 12, fontWeight: 500, color: "red" }}
                    component={Button}
                    size="small"
                    scope="row"
                    onClick={() => handleDelete(user._id)}
                  >
                    Supprimer
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </Stack>
  );
};
