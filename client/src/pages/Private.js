import { Navigate, Outlet } from "react-router-dom";
import { USE_USER_CONTEXTE } from "../reduce/Contexte";

export const Private = () => {
  const { connect } = USE_USER_CONTEXTE();
  return <>{connect ? <Outlet /> : <Navigate to="/connexion" />}</>;
};
