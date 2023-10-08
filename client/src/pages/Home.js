import { Stack, createTheme } from "@mui/material";
import { Left } from "../components/home/Left";
import { Middle } from "../components/home/Middle";
import { Right } from "../components/home/Right";
import { USE_USER_CONTEXTE } from "../reduce/Contexte";
import { PageNotConnected } from "./PageNotConnected";
import { useEffect, useState } from "react";
import { USER, USERS } from "../reduce/Action";
import axios from "axios";

export const Home = () => {
  const { connect, user, dispatch } = USE_USER_CONTEXTE();

  //Configuration du mode sombre et claire
  const [mode, setMode] = useState("light");
  const darkTheme = createTheme({
    palette: {
      mode,
    },
  });

  // Fonction asynchrone pour récupérer la liste des utilisateurs
  const fetchUserList = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Utilisation de Promise.all pour paralléliser les appels axios
      const [USER_DATA_USER, USER_DATA] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/user/${user?._id}`, OPTIONS),
        axios.get(`${process.env.REACT_APP_API}/user`, OPTIONS),
      ]);

      // Mise à jour de l'état avec les données récupérées
      dispatch({ type: USER, payload: USER_DATA_USER.data.user });
      dispatch({ type: USERS, payload: USER_DATA.data.user });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Appel de la fonction pour récupérer les données des utilisateurs
    fetchUserList();
  }, [connect, user?._id]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Stack direction="row">
        {connect && <Left mode={mode} setMode={setMode}/>}
        <Middle />
        {connect ? <Right /> : <PageNotConnected />}
      </Stack>
    </ThemeProvider>
  );
};
