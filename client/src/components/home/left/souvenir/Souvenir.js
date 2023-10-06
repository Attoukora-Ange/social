import { useEffect } from "react";
import { SouvenirDetail } from "./SouvenirDetail";
import { Alert, Stack, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ALL_SOUVENIR } from "../../../../reduce/Action";
import { USE_POST_CONTEXTE } from "../../../../reduce/Contexte";
import axios from "axios";

export const Souvenir = () => {
  const { souvenir, loading, error, dispatch } = USE_POST_CONTEXTE();
  useEffect(() => {
    try {
      const fetchPostSouvenirList = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        const POST_DATA = await axios.get(
          `${process.env.REACT_APP_API}/post/poster/souvenir`,
          OPTIONS
        );
        dispatch({ type: ALL_SOUVENIR, payload: POST_DATA.data.post });
      };
      fetchPostSouvenirList();
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <Stack>
      <Typography
        variant="h5"
        component="div"
        textAlign="center"
        color="#099e4c"
        pb={2}
      >
        Listes de mes souvenirs
      </Typography>

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
      ) : (
        <Stack
          minWidth={450}
          height="100%"
          gap={1}
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
        >
          {souvenir?.map((souv) => {
            if (souv) {
              return <SouvenirDetail key={souv._id} post={souv} />;
            }
            return null;
          })}
        </Stack>
      )}
    </Stack>
  );
};
