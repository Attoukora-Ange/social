import { Navigate, Outlet } from "react-router-dom";
import { USE_USER_CONTEXTE } from "../reduce/Contexte";

export const Public = () => {
  const { connect } = USE_USER_CONTEXTE();

  return <>{!connect ? <Outlet /> : <Navigate to="/" replace />}</>;
};
