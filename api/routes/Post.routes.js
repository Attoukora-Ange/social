import express from "express";
import {
  deleteOneInformationRoute,
  deleteOnePostRoute,
  deleteOneProblemeRoute,
  getAllInformationRoute,
  getAllPostsRoute,
  getAllPostsSouvenirRoute,
  getAllProblemeRoute,
  getOnePostRoute,
  getOneProblemeRoute,
  pathDeleteOnePostCommentaireRoute,
  pathModifieOnePostCommentaireRoute,
  pathOnePostCommentaireRoute,
  pathOnePostLikdRoute,
  pathOnePostUnLikdRoute,
  postCreateOneInformationRoute,
  postCreateOnePostRoute,
  postCreateOneProblemeRoute,
  putOnePostRoute,
} from "../controllers/PostController.js";
import {
  fileFilterImage,
  fileFilterImageSeul,
  multerErrorMiddleware,
  upload,
} from "../multer/multer.js";
import { auth, authAdmin } from "../middleware/Auth.js";

export const postRoutes = express.Router();

// Configuration de routes Post
postRoutes.get("/poster", getAllPostsRoute);
postRoutes.get("/poster/souvenir", auth, getAllPostsSouvenirRoute);
postRoutes.get("/poster/:id", auth, getOnePostRoute);
postRoutes.post(
  "/poster",
  auth,
  upload("fichier_post", fileFilterImage),
  multerErrorMiddleware,
  postCreateOnePostRoute
);
postRoutes.put(
  "/poster/:id",
  auth,
  upload("fichier_post", fileFilterImage),
  multerErrorMiddleware,
  putOnePostRoute
);
postRoutes.delete("/poster/:id", auth, deleteOnePostRoute);

//Commentaire des postes
postRoutes.patch("/poster/commentaire/:id", auth, pathOnePostCommentaireRoute);
postRoutes.patch(
  "/poster/commentaire/delete/:id",
  auth,
  pathDeleteOnePostCommentaireRoute
);
postRoutes.patch(
  "/poster/commentaire/modifie/:id",
  auth,
  pathModifieOnePostCommentaireRoute
);

//Like et dislike des postes
postRoutes.patch("/poster/like/:id", auth, pathOnePostLikdRoute);
postRoutes.patch("/poster/unlike/:id", auth, pathOnePostUnLikdRoute);

// Configuration de routes Information
postRoutes.get("/information", getAllInformationRoute);
postRoutes.post(
  "/information",
  authAdmin,
  upload("fichier_information", fileFilterImageSeul),
  multerErrorMiddleware,
  postCreateOneInformationRoute
);

postRoutes.delete("/information/:id", authAdmin, deleteOneInformationRoute);

// Configuration de routes Contact
postRoutes.get("/probleme", authAdmin, getAllProblemeRoute);
postRoutes.get("/probleme/:id", authAdmin, getOneProblemeRoute);
postRoutes.post("/probleme", auth, postCreateOneProblemeRoute);
postRoutes.delete("/probleme/:id", authAdmin, deleteOneProblemeRoute);
