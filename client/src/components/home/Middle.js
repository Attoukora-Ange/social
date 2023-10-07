import { Alert, Box, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Haut } from "./middle/Haut";
import { Contenu } from "./middle/Contenu";
import { useEffect, useState } from "react";
import { USE_POST_CONTEXTE, USE_USER_CONTEXTE } from "../../reduce/Contexte";
import {
  ALL_INFO,
  ALL_POST,
  ALL_PROBLEME,
  ERROR,
  LOADING,
} from "../../reduce/Action";
import axios from "axios";
import { ContenuPasConnect } from "./middle/ContenuPasConnect";

export const Middle = () => {
  const { posts, loading, error, dispatch } = USE_POST_CONTEXTE();
  const { user, connect } = USE_USER_CONTEXTE();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Afficher le chargement pendant le chargement des données
        dispatch({ type: LOADING });

        // Récupérer le token d'authentification depuis le localStorage
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        // Fonction pour récupérer les publications
        const fetchPosts = async () => {
          try {
            const POST_DATA = await axios.get(
              `${process.env.REACT_APP_API}/post/poster`,
              OPTIONS
            );
            dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
          } catch (error) {
            dispatch({ type: ERROR });
          }
        };

        // Fonction pour récupérer les informations
        const fetchInfo = async () => {
          try {
            const OPTIONS = {};
            const POST_INFO_DATA = await axios.get(
              `${process.env.REACT_APP_API}/post/information`,
              OPTIONS
            );
            dispatch({ type: ALL_INFO, payload: POST_INFO_DATA.data.information });
          } catch (error) {
            dispatch({ type: ERROR });
          }
        };

        // Fonction pour récupérer les problèmes (si l'utilisateur est admin)
        const fetchProbleme = async () => {
          try {
            const POST_PROBLEME_DATA = await axios.get(
              `${process.env.REACT_APP_API}/post/probleme`,
              OPTIONS
            );
            dispatch({
              type: ALL_PROBLEME,
              payload: POST_PROBLEME_DATA.data.post,
            });
          } catch (error) {
            dispatch({ type: ERROR });
          }
        };

        // Exécution séquentielle des fonctions de récupération des données
        await fetchPosts();
        await fetchInfo();

        // Si l'utilisateur est administrateur, récupérer également les problèmes
        if (user?.isAdmin) {
          await fetchProbleme();
        }
      } catch (error) {
        // Gérer les erreurs générales ici
        dispatch({ type: ERROR });
      }
    };

    // Appeler la fonction fetchData une fois lorsque les dépendances changent
    fetchData();
  }, [dispatch, user?.isAdmin]);

  useEffect(() => {
    // Fonction de gestion du défilement
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight // seuil de déclenchement
      ) {
        // Charger plus de données lorsque le seuil est atteint
        const AXIOS_TO_GET_POST = async () => {
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };
          // On fetcht sur tous les posters de la page suivante
          const nextPage = page + 1;
          const POST_DATA = await axios.get(
            `${process.env.REACT_APP_API}/post/poster?page=${nextPage}`,
            OPTIONS
          );

          // Vérifier si de nouvelles données ont été chargées
          if (posts?.length !== POST_DATA.data.post.length) {
            dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
            setPage(nextPage);
          }
        };
        AXIOS_TO_GET_POST();
      }
    }

    // Ajouter un écouteur d'événements de défilement
    window.addEventListener("scroll", handleScroll);

    // Supprimer l'écouteur d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts?.length, dispatch, page]);

  return (
    <Stack
      sx={{ maxWidth: { xs: "100%", md: 600 }, mr: 2 }}
      flexGrow={2}
      p={1}
      gap={2}
    >
      {connect && <Haut />}

      {loading ? (
        <Typography
          variant="body1"
          component="div"
          color="green"
          textAlign="center"
        >
          <CircularProgress color="inherit" />
        </Typography>
      ) : error ? (
        <Alert severity="error">Erreur au cours du chargement...</Alert>
      ) : connect ? (
        posts.map((post) => (
          <Box key={post._id}>
            <Contenu post={post} />
          </Box>
        ))
      ) : (
        posts.map((post) => (
          <Box key={post._id}>
            <ContenuPasConnect post={post} />
          </Box>
        ))
      )}
    </Stack>
  );
};
