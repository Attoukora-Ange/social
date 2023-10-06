import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";

export const InfoUtilisateurDetail = () => {
  const handleDelete = async (e) => {
    // e.preventDefault();
    alert("Vous n'avez pas encore configuré cette option !")
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
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Genre</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Nom et prénoms
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Date de naissance
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>Pays</TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Email
              </TableCell>
              <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>
                Situation matrimoniale
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              hover
              key={"index"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                sx={{ fontSize: 12, fontWeight: 500 }}
                component="th"
                scope="row"
              >
                {"index + 1"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 500 }}
                component="th"
                scope="row"
              >
                {"Genre"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 300 }}
                component="th"
                scope="row"
              >
                {"row.nom_prenoms"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 300 }}
                component="th"
                scope="row"
              >
                {"row.date_naissance"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 300 }}
                component="th"
                scope="row"
              >
                {"row.pays"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 300 }}
                component="th"
                scope="row"
              >
                {"row.email"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 300 }}
                component="th"
                scope="row"
              >
                {"row.matrimoniale"}
              </TableCell>
              <TableCell
                sx={{ fontSize: 12, fontWeight: 500, color: "red" }}
                component={Button}
                size="small"
                scope="row"
                onClick={handleDelete()}
              >
                Supprimer
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
