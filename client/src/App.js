import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Profil } from "./pages/Profil";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PasswordOublie } from "./components/login/PasswordOublie";
import { Code } from "./components/login/Code";
import { PageSuggestion } from "./components/home/left/suggestion/PageSuggestion";
import { PageFollower } from "./components/home/left/follower/PageFollower";
import { PageSuivi } from "./components/home/left/suivi/PageSuivi";
import { PageNotFound } from "./pages/PageNotFound";
import { Admin } from "./pages/Admin";
import { InfoUtilisateur } from "./components/admin/InfoUtilisateur";
import { Evenement } from "./components/home/left/evenement/Evenement";
import { Souvenir } from "./components/home/left/souvenir/Souvenir";
import { Probleme } from "./components/home/left/probleme/Probleme";
import { InfoProbleme } from "./components/admin/InfoProbleme";
import { User } from "./pages/User";
import { Public } from "./pages/Public";
import { Private } from "./pages/Private";
import { PrivateAdmin } from "./pages/PrivateAdmin";
import { useEffect } from "react";
import { USE_USER_CONTEXTE } from "./reduce/Contexte";
import { DECONNEXION, RELOADING, USER, USERS } from "./reduce/Action";
import axios from "axios";
import { PageUtilisateur } from "./components/home/left/utilisateur/PageUtilisateur";

function App() {
  const { dispatch, user, connect } = USE_USER_CONTEXTE();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token")) || null;
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        const AUTH = await axios.get(
          `${process.env.REACT_APP_API}/auth`,
          OPTIONS
        );
        
        dispatch({ type: RELOADING });

        const dataToStore = {
          connect,
          user: AUTH.data.user,
          token: AUTH.data.token,
        };

        // Stocker les données dans le stockage local (localStorage) pour une utilisation ultérieure
        Object.entries(dataToStore).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });

        if (connect) {
          // Si l'utilisateur est connecté, récupérer la liste de tous les utilisateurs
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };

          const [USER_DATA, USER_DATA_USER] = await Promise.all([
            axios.get(`${process.env.REACT_APP_API}/user`, OPTIONS),
            axios.get(
              `${process.env.REACT_APP_API}/user/${user?._id}`,
              OPTIONS
            ),
          ]);

          // Dispatch des actions pour mettre à jour les données de l'utilisateur et la liste des utilisateurs
          dispatch({ type: USER, payload: USER_DATA_USER.data.user });
          dispatch({ type: USERS, payload: USER_DATA.data.user });
        }
      } catch (error) {
        dispatch({ type: DECONNEXION });
      }
    };

    // Appeler la fonction pour récupérer les données de l'utilisateur
    fetchData();
  }, [dispatch, user?._id]);

  return (
    <Layout>
      <Routes>
        <Route element={<Private />}>
          <Route path="/mon-compte" element={<Profil />} />
          <Route path="/utilisateur/:id" element={<User />} />
          <Route path="/suggestions" element={<PageSuggestion />} />
          <Route path="/followers" element={<PageFollower />} />
          <Route path="/utilisateurs" element={<PageUtilisateur />} />
          <Route path="/suivis" element={<PageSuivi />} />
          <Route path="/evenements" element={<Evenement />} />
          <Route path="/souvenirs" element={<Souvenir />} />
          <Route path="/problemes" element={<Probleme />} />
          <Route path="/administrateur" element={<PrivateAdmin />}>
            <Route path="/administrateur" element={<Admin />} />
            <Route
              path="/administrateur/utilisateurs"
              element={<InfoUtilisateur />}
            />
            <Route
              path="/administrateur/problemes"
              element={<InfoProbleme />}
            />
          </Route>
        </Route>
        <Route element={<Public />}>
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot_passe/oublie" element={<PasswordOublie />} />
          <Route path="/mot_passe/code" element={<Code />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/error" element={<PageNotFound />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
