import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  addToRevokedTokens,
  generateAccessToken,
  isValidToken,
} from "../middleware/Auth.js";
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";
import { sendEmail } from "../nodemail/NodeMail.js";
import { isValidEmail } from "../utils/Utils.js";
import cloudinary from "../helper/upload.js";

const { compare, genSalt, hash } = bcrypt;

// Configuration des controles de Routes User
export const getAllUsersRoute = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs de la base de données en excluant les champs "password" et "codePasseGenere"
    const users = await UserModel.find().select("-password -codePasseGenere");

    // Renvoyer les utilisateurs au format JSON avec le statut 200 (Succès)
    return res.status(200).json({ user: users });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const getOneUserRoute = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Vérifier si les ID sont valides en utilisant mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Vérifier si l'ID de l'utilisateur existe dans la liste de following de l'utilisateur cible
    const existId = await UserModel.findById(id);

    if (!existId.following.includes(userId)) {
      // Si l'ID de l'utilisateur n'existe pas dans la liste de following, l'ajouter à la liste de suggestion
      await UserModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            suggestion: userId,
          },
        },
        { new: true }
      );
    }

    // Récupérer l'utilisateur cible en excluant les champs "password" et "codePasseGenere"
    const user = await UserModel.findById(id).select(
      "-password -codePasseGenere"
    );

    // Renvoyer l'utilisateur au format JSON avec le statut 200 (Succès)
    return res.status(200).json({ user });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postCreateOneUserRoute = async (req, res) => {
  const {
    nom_prenoms,
    date_naissance,
    pays,
    genre,
    email,
    password,
    password_conf,
  } = req.body;

  try {
    // Vérifier si tous les champs requis sont présents dans la requête
    if (
      !nom_prenoms ||
      !date_naissance ||
      !pays ||
      !genre ||
      !email ||
      !password ||
      !password_conf
    ) {
      return res
        .status(400)
        .json({ error: "Vérifier les champs du formulaire" });
    }

    // Vérifier si l'adresse e-mail est valide en utilisant une fonction isValidEmail (non fournie dans le code)
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "L'email n'est pas valide" });
    }

    // Vérifier si les mots de passe correspondent
    if (password !== password_conf) {
      return res
        .status(400)
        .json({ error: "Les mots de passe saisis ne correspondent pas" });
    }

    // Vérifier si l'adresse e-mail est déjà utilisée par un autre utilisateur
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        error: `${email} est déjà utilisé par un autre utilisateur`,
      });
    }

    // Générer un sel (Salt) pour le hachage du mot de passe
    const salt = await genSalt(10);

    // Hacher le mot de passe en utilisant le sel
    const hashPassword = await hash(password, salt);

    // Créer un nouvel utilisateur avec les données fournies et le mot de passe haché
    const user = new UserModel({
      nom_prenoms,
      date_naissance,
      genre,
      email,
      pays,
      password: hashPassword,
      isAdmin: false,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();

    // Renvoyer une réponse JSON avec le statut 201 (Créé avec succès) et un message de succès
    return res.status(201).json({
      success: `Le compte de ${user.nom_prenoms} a été créé avec succès`,
    });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postConnectOneUserRoute = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Étape 1 : Vérifier la présence des champs email et password dans la requête
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Vérifier les champs du formulaire" });
    }

    // Étape 2 : Vérifier si l'adresse e-mail est valide en utilisant une fonction isValidEmail (non fournie dans le code)
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: `L'email : ${email} n'est pas valide` });
    }

    // Étape 3 : Rechercher l'utilisateur dans la base de données en fonction de l'adresse e-mail
    const userExist = await UserModel.findOne({ email });

    // Étape 4 : Si aucun utilisateur n'est trouvé, renvoyer une erreur
    if (!userExist) {
      return res.status(400).json({
        error: "L'email ou le mot de passe n'est pas correct",
      });
    }

    // Étape 5 : Vérifier si le mot de passe fourni correspond au mot de passe haché dans la base de données
    const userVerifyHashPassword = await compare(password, userExist.password);

    // Étape 6 : Si les mots de passe ne correspondent pas, renvoyer une erreur
    if (!userVerifyHashPassword) {
      return res
        .status(400)
        .json({ error: "L'email ou le mot de passe n'est pas correct" });
    }

    // Étape 7 : Générer un jeton d'accès (token) pour l'utilisateur authentifié
    const token = generateAccessToken({
      id: userExist._id.toString(),
      isAdmin: userExist.isAdmin,
    });

    // Étape 8 : Supprimer les champs sensibles (password et codePasseGenere) de l'objet utilisateur
    delete userExist?._doc.password;
    delete userExist?._doc.codePasseGenere;

    // Étape 9 : Renvoyer une réponse JSON avec l'utilisateur et le jeton
    return res.status(200).json({ user: userExist, token });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const postDisconnectOneUserRoute = async (req, res) => {
  try {
    // Étape 1 : Vérifier si le jeton existe dans l'en-tête de la requête
    const tokenExist = req.headers.authorization;

    if (!tokenExist) {
      return res
        .status(401)
        .json({ error: "Token d'authentification manquant" });
    }

    // Étape 2 : Extraire le jeton à partir de l'en-tête
    const token = tokenExist.split(" ")[1];

    if (!isValidToken(token)) {
      return res
        .status(401)
        .json({ error: "Token d'authentification invalide" });
    }

    // Étape 3 : Ajouter le jeton à une liste de jetons révoqués (vous devez implémenter cette liste)
    addToRevokedTokens(token);

    // Étape 4 : Répondre avec un message indiquant que l'utilisateur est déconnecté
    return res
      .status(200)
      .json({ message: "Utilisateur déconnecté avec succès" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse JSON avec le statut 500 (Erreur interne du serveur) et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

export const putOneUserRoute = async (req, res) => {
  const { id } = req.params;
  const {
    nom_prenoms,
    genre,
    pays,
    date_naissance,
    email,
    matrimoniale,
    ville,
    profession,
    biographie,
  } = req.body;

  try {
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: `${id} n'est pas valide` });

    // Vérifier si l'utilisateur est autorisé à effectuer cette modification
    if (id !== req.user.id)
      return res.status(400).json({ error: `Vous n'êtes pas autorisé` });

    // Rechercher l'utilisateur
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          nom_prenoms,
          pays,
          genre,
          date_naissance,
          email,
          matrimoniale,
          ville,
          profession,
          biographie,
        },
      },
      { new: true }
    );

    // Vérifier si l'utilisateur a été trouvé
    if (!user)
      return res
        .status(400)
        .json({ error: `L'utilisateur n'a pas été trouvé` });

    // Supprimer des informations sensibles du résultat
    delete user._doc.password;
    delete user._doc.codePasseGenere;

    // Répondre avec le résultat
    return res
      .status(200)
      .json({ user, success: "Modification du profil réussie" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const putPasswordOneUserRoute = async (req, res) => {
  const { id } = req.params;
  const { newPassword, holdPassword } = req.body;

  try {
    // Vérifier si les champs newPassword et holdPassword sont fournis
    if (!newPassword || !holdPassword) {
      return res.status(400).json({ error: "Vérifier les champs" });
    }

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'utilisateur est autorisé à effectuer cette modification
    if (id !== req.user.id) {
      return res.status(400).json({ error: `Vous n'êtes pas autorisé` });
    }

    // Rechercher l'utilisateur
    const user = await UserModel.findById(id);

    // Vérifier si l'ancien mot de passe est correct
    const isValidPassword = await compare(holdPassword, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ error: `L'ancien mot de passe est incorrect` });
    }

    // Générer le nouveau hash de mot de passe
    const hashPassword = await hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashPassword,
        },
      },
      { new: true }
    );

    return res.status(200).json({ success: "Modification réussie" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Configuration des Followers
export const patchOneFollowerRoute = async (req, res) => {
  // Récupération de l'ID de l'utilisateur actuel depuis la requête
  const userId = req.user.id;
  // Récupération de l'ID de l'utilisateur cible depuis les paramètres de la requête
  const { id } = req.params;

  try {
    // Vérifier si l'ID de l'utilisateur cible est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }
    // Vérifier si l'ID de l'utilisateur actuel est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Étape 1 : Ajouter l'utilisateur cible à la liste des "following" de l'utilisateur actuel
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          following: id,
        },
      },
      { new: true }
    );

    // Étape 2 : Ajouter l'utilisateur actuel à la liste des "followers" de l'utilisateur cible
    await UserModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          followers: userId,
        },
      },
      { new: true }
    );

    // Étape 3 : Retirer l'utilisateur cible de la liste des "suggestions" de l'utilisateur actuel
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          suggestion: id,
        },
      },
      { new: true }
    );

    // Répondre avec un succès
    return res
      .status(200)
      .json({ success: "Vous suivez désormais cet utilisateur" });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse d'erreur en cas de problème
    return res.status(500).json({ error: error.message });
  }
};

export const patchOneUnSuggestionRoute = async (req, res) => {
  // Récupérer l'ID de l'utilisateur authentifié
  const userId = req.user.id;
  // Récupérer l'ID de l'utilisateur dont vous souhaitez supprimer la suggestion
  const { id } = req.params;

  try {
    // Vérifier si l'ID de l'utilisateur cible est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID de l'utilisateur authentifié est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Supprimer l'ID de l'utilisateur cible de la liste des suggestions de l'utilisateur authentifié
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          suggestion: id,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Vous n'avez plus de suggestion de cet utilisateur" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const patchOneUnFollowerRoute = async (req, res) => {
  // Récupérer l'ID de l'utilisateur authentifié
  const userId = req.user.id;
  // Récupérer l'ID de l'utilisateur que vous souhaitez arrêter de suivre
  const { id } = req.params;

  try {
    // Vérifier si l'ID de l'utilisateur cible est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    // Vérifier si l'ID de l'utilisateur authentifié est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `${userId} n'est pas valide` });
    }

    // Retirer l'ID de l'utilisateur cible de la liste des "following" de l'utilisateur authentifié
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          following: id,
        },
      },
      { new: true }
    );

    // Retirer l'ID de l'utilisateur authentifié de la liste des "followers" de l'utilisateur cible
    await UserModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          followers: userId,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: "Vous ne suivez plus cet utilisateur" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Configuration des controles de Routes Image
export const putOneImageRoute = async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier si un fichier (photo) a été correctement téléchargé
    if (!req.file) {
      return res.status(400).json({ error: "Vérifier le champ de la photo" });
    }

    // Vérifier si l'ID de l'utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    const postFichier = await cloudinary.uploader.upload(req.file.path, {
      folder: "social/user",
    });

    // Mettre à jour la photo de profil de l'utilisateur
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { photo: postFichier.secure_url },
      },
      { new: true }
    ).select("-password -codePasseGenere");

    // Renvoyer la réponse avec l'utilisateur mis à jour
    return res.status(200).json({ user, success: "Modification réussie" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse avec un code d'erreur 500 et un message d'erreur
    return res.status(500).json({ error: error.message });
  }
};

//On reinitialise le mot de passe a partir d'un code envoyé par email
export const postEmailReinitialisation = async (req, res) => {
  // Générer un code de réinitialisation de mot de passe aléatoire
  const codePasseGenere = Math.floor(Math.random() * 1000000 + 1);
  const { email } = req.body;

  try {
    // Vérifier si l'e-mail fourni est valide
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "L'email n'est pas valide" });
    }

    // Rechercher l'utilisateur par son adresse e-mail
    const userFound = await UserModel.findOne({ email });
    if (!userFound) {
      return res.status(400).json({
        error: `Aucun utilisateur n'a été trouvé avec cette adresse e-mail`,
      });
    }

    // Envoyer l'e-mail de réinitialisation avec le code généré
    sendEmail(email, userFound, codePasseGenere).then(async () => {
      await UserModel.findByIdAndUpdate(userFound._id, { codePasseGenere });
      res.status(200).json({
        userId: userFound._id.toString(),
        message: `Rendez-vous sur l'adresse ${email} pour valider la modification`,
      });
    });
  } catch (error) {
    // En cas d'erreur inattendue, renvoyer une réponse avec un code d'erreur 500
    res.status(500).json({ error: error.message });
  }
};

export const postPasswordReinitialisation = async (req, res) => {
  // Récupérer l'ID de l'utilisateur à partir des en-têtes de la requête
  const id = req.headers.id;
  const { codePasseGenere, newPassword } = req.body;

  try {
    // Rechercher l'utilisateur par son ID
    const user = await UserModel.findById(id);

    // Vérifier si le code de réinitialisation a été fourni
    if (!codePasseGenere) {
      return res.status(400).json({ error: `Veuillez entrer le code généré` });
    }

    // Vérifier si un utilisateur correspondant a été trouvé
    if (!user) {
      return res
        .status(400)
        .json({ error: `Aucun utilisateur n'a été trouvé` });
    }

    // Vérifier si le nouveau mot de passe a été fourni
    if (!newPassword) {
      return res
        .status(400)
        .json({ error: `Veuillez entrer le nouveau mot de passe` });
    }

    // Vérifier si le code de réinitialisation correspond à celui enregistré pour l'utilisateur
    if (user.codePasseGenere !== codePasseGenere) {
      return res.status(400).json({
        error: `Le code saisi est incorrect, veuillez entrer le bon code envoyé par e-mail`,
      });
    }

    // Générer un nouveau sel pour le mot de passe et le hacher
    const Salt = await genSalt(10);
    const hashPassword = await hash(newPassword, Salt);

    // Mettre à jour le mot de passe de l'utilisateur et supprimer le code de réinitialisation
    await UserModel.findByIdAndUpdate(id, {
      password: hashPassword,
      codePasseGenere: null,
    });

    // Renvoyer une réponse réussie
    res
      .status(200)
      .json({ message: `Le mot de passe a été réinitialisé avec succès` });
  } catch (error) {
    // En cas d'erreur inattendue, renvoyer une réponse avec un code d'erreur 500
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOneUserRoute = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `${id} n'est pas valide` });
    }

    if (id !== req.user.id && !req.user.isAdmin) {
      return res.status(400).json({ error: `Vous n'êtes pas autorisé` });
    }

    // Suppression de toutes les publications de l'utilisateur
    await PostModel.deleteMany({ postUser: id });

    // Suppression de tous les commentaires de l'utilisateur
    await PostModel.updateMany(
      { "commentaire.commentaireUser": id },
      { $pull: { commentaire: { commentaireUser: id } } }
    );

    // Récupération de tous les utilisateurs sauf celui à supprimer
    const otherUsers = await UserModel.find({ _id: { $ne: id } });

    // Suppression de l'utilisateur des listes de followers, following et suggestion des autres utilisateurs
    const bulkUpdateOps = otherUsers.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $pull: {
            followers: id,
            following: id,
            suggestion: id,
          },
        },
      },
    }));

    await UserModel.bulkWrite(bulkUpdateOps);

    // Suppression de l'utilisateur lui-même
    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({ success: "Suppression réussie" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
