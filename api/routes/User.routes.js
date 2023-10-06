import express from "express";
import {
  deleteOneUserRoute,
  getAllUsersRoute,
  getOneUserRoute,
  patchOneFollowerRoute,
  patchOneUnFollowerRoute,
  patchOneUnSuggestionRoute,
  postConnectOneUserRoute,
  postCreateOneUserRoute,
  postDisconnectOneUserRoute,
  postEmailReinitialisation,
  postPasswordReinitialisation,
  putOneImageRoute,
  putOneUserRoute,
  putPasswordOneUserRoute,
} from "../controllers/UserController.js";
import {
  fileFilterImageSeul,
  multerErrorMiddleware,
  upload,
} from "../multer/multer.js";
import { auth, authAdmin } from "../middleware/Auth.js";

export const userRoutes = express.Router();

// Configuration de routes user
userRoutes.get("/", auth, getAllUsersRoute);
userRoutes.get("/:id", auth, getOneUserRoute);
userRoutes.post("/", postCreateOneUserRoute);
userRoutes.post("/connexion", postConnectOneUserRoute);
userRoutes.post("/deconnexion", postDisconnectOneUserRoute);
userRoutes.post("/reinitialisation/email", postEmailReinitialisation);
userRoutes.put("/reinitialisation/password", postPasswordReinitialisation);
userRoutes.put("/:id", auth, putOneUserRoute);
// Configuration de routes Image du profil
userRoutes.put(
  "/image/:id",
  auth,
  upload("images/image_profil", "image_profil", fileFilterImageSeul),
  multerErrorMiddleware,
  putOneImageRoute
);
userRoutes.put("/password/:id", auth, putPasswordOneUserRoute);
userRoutes.patch("/follower/:id", auth, patchOneFollowerRoute);
userRoutes.patch("/unfollower/:id", auth, patchOneUnFollowerRoute);
userRoutes.patch("/unsuggestion/:id", auth, patchOneUnSuggestionRoute);
userRoutes.delete("/:id", authAdmin, deleteOneUserRoute);
