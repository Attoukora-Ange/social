import { Outlet } from "react-router-dom";
import { Home } from "./Home";
import { USE_USER_CONTEXTE } from "../reduce/Contexte";

export const PrivateAdmin = () => {
  // Récupération de l'information utilisateur depuis le contexte
  const { user } = USE_USER_CONTEXTE();

  return (
    <>
      {/* Vérifie si l'utilisateur a le statut d'administrateur */}
      {user?.isAdmin && <Outlet />}
      {!user?.isAdmin && <Home />}
    </>
  );
};
