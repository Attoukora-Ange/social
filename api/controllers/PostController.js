import mongoose from "mongoose";
import {
  InformationModel,
  PostModel,
  ProblemeModel,
} from "../models/PostModel.js";
import cloudinary from "../helper/upload.js";

// Configuration des controles de Routes Post
export const getAllPostsRoute = async (req, res) => {
  // Récupérer le numéro de la page à partir de la requête (par défaut : page 1)
  const page = parseInt(req.query.page) || 1;

  // Nombre d'posts par page
  const perPage = 3;

  // Calculer l'indice de début et l'indice de fin pour la pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  try {
    // Récupérer les posts paginés avec la population des champs postUser et commentaire.commentaireUser
    const post = await PostModel.find()
      .populate("postUser", "-password -codePasseGenere") // Exclure les champs sensibles
      .populate("commentaire.commentaireUser", "-password -codePasseGenere") // Exclure les champs sensibles
      .skip(0)
      .limit(endIndex)
      .sort({ createdAt: -1 }); // Tri par date de création décroissante

    // Renvoyer les posts paginés en réponse

    return res.status(200).json({ post });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const getAllPostsSouvenirRoute = async (req, res) => {
  // Récupérer l'ID de l'utilisateur à partir de la requête
  const userId = req.user.id;

  try {
    // Rechercher tous les posts associés à l'ID de l'utilisateur
    const post = await PostModel.find({ postUser: userId })
      .populate("postUser", "-password -codePasseGenere") // Population du champ "postUser"
      .populate("commentaire.commentaireUser", "-password -codePasseGenere") // Population des champs "commentaire.commentaireUser"
      .sort({ createdAt: -1 }); // Tri des posts par date de création décroissante

    // Renvoyer les posts trouvés en réponse avec le statut 200
    return res.status(200).json({ post });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const getOnePostRoute = async (req, res) => {
  // Récupérer l'ID du post à partir des paramètres de la requête
  const { id } = req.params;

  try {
    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Rechercher du post par son ID, en effectuant la population des champs "postUser" et "commentaire.commentaireUser"
    const post = await PostModel.findById(id)
      .populate("postUser", "-password -codePasseGenere") // Population du champ "postUser"
      .populate("commentaire.commentaireUser", "-password -codePasseGenere") // Population des champs "commentaire.commentaireUser"
      .lean(); // Utilisation de la méthode lean() pour une requête MongoDB plus légère

    // Vérifier si le post a été trouvé
    if (!post) {
      return res
        .status(404)
        .json({ error: `Le post avec l'ID ${id} n'a pas été trouvé` });
    }

    // Renvoyer le post trouvé en réponse avec le statut 200
    return res.status(200).json({ post });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postCreateOnePostRoute = async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  const allowedMimeTypesImage = ["image/jpeg", "image/jpg", "image/png"];
  const allowedMimeTypesVideo = ["video/mp4", "video/webm", "video/ogg"];

  try {
    // Vérifier si le champ "content" ou le champ "file" est présent dans la requête
    if (!content && !req.file) {
      return res
        .status(400)
        .json({ error: "Veuillez vérifier les champs du formulaire" });
    }

    // Vérifier si l'ID de l'utilisateur est valide
    if (!userId) {
      return res.status(400).json({ error: "Vous n'êtes pas autorisé" });
    }

    let post = new PostModel({
      postUser: userId,
    });

    // Vérifier si un fichier a été ajouté à la requête
    if (req.file) {
      // Vérifier si c'est une image
      if (allowedMimeTypesImage.includes(req.file.mimetype)) {
        const postFichier = await cloudinary.uploader.upload(req.file.path, {
          folder: "social/post",
        });
        post.image = postFichier.secure_url;
      }
      // Vérifier si c'est une vidéo
      else if (allowedMimeTypesVideo.includes(req.file.mimetype)) {
        const postFichier = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "social/post",
        });

        post.video = postFichier.secure_url;
      }
    }

    // Si le champ "content" est présent dans la requête, l'ajouter au post
    if (content) {
      post.content = content;
    }

    // Sauvegarder le post dans la base de données
    await post.save();

    return res
      .status(201)
      .json({ message: "Le post a été ajouté avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const putOnePostRoute = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const allowedMimeTypesImage = ["image/jpeg", "image/jpg", "image/png"];
  const allowedMimeTypesVideo = ["video/mp4", "video/webm", "video/ogg"];

  try {
    // Vérifier si le champ "content" ou le champ "file" est présent dans la requête
    if (!content && !req.file) {
      return res
        .status(400)
        .json({ error: "Veuillez vérifier les champs du formulaire" });
    }

    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    let updateFields = {};

    // Vérifier si un fichier a été ajouté à la requête
    if (req.file) {
      // Vérifier si c'est une image
      if (allowedMimeTypesImage.includes(req.file.mimetype)) {
        const postFichier = await cloudinary.uploader.upload(req.file.path, {
          folder: "social/post",
        });
        updateFields.image = postFichier.secure_url;
      }
      // Vérifier si c'est une vidéo
      else if (allowedMimeTypesVideo.includes(req.file.mimetype)) {
        const postFichier = await cloudinary.uploader.upload(req.file.path, {
          resource_type:"video",
          folder: "social/post",
        });
        updateFields.video = postFichier.secure_url;
      }
    }

    // Si le champ "content" est présent dans la requête, l'ajouter aux champs à mettre à jour
    if (content) {
      updateFields.content = content;
    }

    // Mettre à jour le post en fonction des champs à mettre à jour
    const post = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({ post, success: "Modification réussie" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOnePostRoute = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Supprimer le post par son ID
    await PostModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: "Le post a été supprimé avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

//Commentaire des Poster
export const pathOnePostCommentaireRoute = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { content } = req.body;

  try {
    // Vérifier si le champ "content" est présent dans la requête
    if (!content) {
      return res
        .status(400)
        .json({ error: "Veuillez vérifier les champs du formulaire" });
    }

    // Vérifier si l'ID du commentaire et l'ID de l'utilisateur sont valides en utilisant mongoose
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res
        .status(400)
        .json({ error: `${id} ou ${userId} n'est pas valide` });
    }

    // Mettre à jour le post en ajoutant le commentaire
    await PostModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          commentaire: {
            commentaireUser: userId,
            commentairetexte: content,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: "Commentaire ajouté avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const pathModifieOnePostCommentaireRoute = async (req, res) => {
  const { id } = req.params;
  const { contentId, content } = req.body;

  try {
    // Vérifier si les champs "contentId" et "content" sont présents dans la requête
    if (!contentId || !content) {
      return res
        .status(400)
        .json({ error: "Veuillez vérifier les champs du formulaire" });
    }

    // Vérifier si l'ID de le post est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID du commentaire est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ error: `${contentId} n'est pas valide` });
    }

    // Rechercher le post par son ID
    const post = await PostModel.findById(id);

    // Mettre à jour le texte du commentaire en recherchant le commentaire correspondant
    post.commentaire.forEach((comment) => {
      if (comment._id.toString() === contentId) {
        comment.commentairetexte = content;
      }
    });

    // Sauvegarder les modifications de le post
    await post.save();

    return res.status(200).json({ success: "Commentaire modifié avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const pathDeleteOnePostCommentaireRoute = async (req, res) => {
  const { id } = req.params;
  const { contentId } = req.body;

  try {
    // Vérifier si le champ "contentId" est présent dans la requête
    if (!contentId) {
      return res
        .status(400)
        .json({ error: "Veuillez vérifier les champs du formulaire" });
    }

    // Vérifier si l'ID de le post est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID du commentaire est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ error: `${contentId} n'est pas valide` });
    }

    // Supprimer le commentaire de le post en utilisant $pull
    await PostModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          commentaire: {
            _id: contentId,
          },
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Commentaire supprimé avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

//Like des Poster

export const pathOnePostLikdRoute = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // Vérifier si l'ID de le post est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID de l'utilisateur est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Mettre à jour le post en ajoutant l'ID de l'utilisateur à la liste des "like"
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          like: userId,
        },
      },
      { new: true } // Pour renvoyer la version mise à jour de le post
    );

    // Vérifier si le post a été trouvé
    if (!updatedPost) {
      return res
        .status(404)
        .json({ error: `Le post avec l'ID ${id} n'a pas été trouvé` });
    }

    return res.status(200).json({ success: "Like réussi" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const pathOnePostUnLikdRoute = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // Vérifier si l'ID de Le post est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID de l'utilisateur est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Mettre à jour Le post en supprimant l'ID de l'utilisateur de la liste des "like"
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          like: userId,
        },
      },
      { new: true } // Pour renvoyer la version mise à jour de Le post
    );

    // Vérifier si Le post a été trouvé
    if (!updatedPost) {
      return res
        .status(404)
        .json({ error: `Le post avec l'ID ${id} n'a pas été trouvé` });
    }

    return res.status(200).json({ success: "Like retiré avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

// Configuration des controles de Routes Information
export const getAllInformationRoute = async (_, res) => {
  try {
    // Récupérer toutes les informations de la base de données
    const information = await InformationModel.find()
      .populate("admin", "-password -codePasseGenere") // Remplir les références à l'administrateur sans afficher le mot de passe et le code généré
      .sort({ created: -1 }); // Trier les informations par date de création décroissante

    // Renvoyer les informations au format JSON avec le statut 200 (Succès)
    return res.status(200).json({ information });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postCreateOneInformationRoute = async (req, res) => {
  const userId = req.user.id;
  const { title, content } = req.body;

  try {
    // Vérifier si les champs requis sont présents dans la requête
    if (!title || !content || !req.file) {
      return res
        .status(400)
        .json({ error: "Vérifiez les champs du formulaire" });
    }

    // Vérifier si l'ID de l'utilisateur est valide
    if (!userId) {
      return res.status(400).json({ error: "Vous n'êtes pas autorisé" });
    }

    // Vérifier si un poste avec le même titre existe déjà
    const postExist = await InformationModel.findOne({ title });
    if (postExist) {
      return res.status(400).json({ postExist: "Ce titre existe déjà" });
    }

    const postFichier = await cloudinary.uploader.upload(req.file.path, {
      folder: "social/info",
    });

    // Créer un nouveau poste d'information
    const post = new InformationModel({
      title,
      content,
      fichier: postFichier.secure_url,
      admin: userId,
    });

    // Sauvegarder le poste dans la base de données
    await post.save();

    // Renvoyer le poste créé au format JSON avec le statut 201 (Créé avec succès)
    return res.status(201).json({ post });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOneInformationRoute = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Supprimer l'information de la base de données en utilisant l'ID
    await InformationModel.findByIdAndDelete(id);

    // Renvoyer une réponse JSON avec le statut 200 (Succès) après la suppression
    return res
      .status(200)
      .json({ success: "L'information a été supprimée avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

// Configuration des controles de Routes Probleme
export const getAllProblemeRoute = async (_, res) => {
  try {
    // Récupérer tous les problèmes de la base de données
    const probleme = await ProblemeModel.find()
      .populate("postUser", "-password -codePasseGenere") // Remplir les références à l'utilisateur sans afficher le mot de passe et le code généré
      .sort({ updatedAt: -1 }); // Trier les problèmes par date de mise à jour décroissante

    // Renvoyer les problèmes au format JSON avec le statut 200 (Succès)
    return res.status(200).json({ post: probleme });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const getOneProblemeRoute = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Rechercher le problème correspondant dans la base de données en utilisant l'ID et remplir les références à l'utilisateur sans afficher le mot de passe et le code généré
    const probleme = await ProblemeModel.findById(id).populate(
      "postUser",
      "-password -codePasseGenere"
    );

    // Vérifier si le problème a été trouvé
    if (!probleme) {
      return res
        .status(404)
        .json({ error: `Le problème avec l'ID ${id} n'a pas été trouvé` });
    }

    // Renvoyer le problème au format JSON avec le statut 200 (Succès)
    return res.status(200).json({ post: probleme });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postCreateOneProblemeRoute = async (req, res) => {
  const userId = req.user.id;
  const { nature, message } = req.body;

  try {
    // Vérifier si les champs requis sont présents dans la requête
    if (!nature || !message) {
      return res
        .status(400)
        .json({ error: "Vérifiez les champs du formulaire" });
    }

    // Créer un nouveau problème en utilisant les données de l'utilisateur actuel et les champs nature et message
    const probleme = new ProblemeModel({
      postUser: userId,
      nature,
      message,
    });

    // Sauvegarder le problème dans la base de données
    await probleme.save();

    // Renvoyer une réponse JSON avec le statut 201 (Créé avec succès) et un message de succès
    return res.status(201).json({ message: "Problème signalé avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOneProblemeRoute = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si l'ID est valide en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Supprimer le problème de la base de données en utilisant l'ID
    await ProblemeModel.findByIdAndDelete(id);

    // Renvoyer une réponse JSON avec le statut 200 (Succès) après la suppression
    return res
      .status(200)
      .json({ success: "Le problème a été supprimé avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};
