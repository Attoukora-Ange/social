import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UserCard } from "../components/user/UserCard";
import { InfoUser } from "../components/user/InfoUser";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "stretch",
  marginBottom: 20,
  gap: 12,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));

export const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postUser, setPostUser] = useState(null); // Utilisation de null au lieu d'une chaîne vide pour postUser

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_API}/user/${id}`,
          OPTIONS
        );
        setPostUser(response.data.user);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
        navigate("/connexion");
      }
    };

    fetchUser();
  }, [id, navigate]);

  return (
    <Box sx={{ padding: 2, minWidth: 400 }}>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        py={2}
      >
        Compte {postUser?.nom_prenoms}
      </Typography>
      <StyledBox>
        {postUser ? (
          <>
            <UserCard postUser={postUser} />
            <InfoUser postUser={postUser} />
          </>
        ) : (
          // Afficher un indicateur de chargement ou un message d'erreur
          <Typography variant="body1" textAlign="center">
            Chargement en cours...
          </Typography>
        )}
      </StyledBox>
    </Box>
  );
};
