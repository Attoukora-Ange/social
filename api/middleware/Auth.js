import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
const revokedTokens = [];

const options = {
  expiresIn: "1d", // Délai d'expiration du JWT
};

export const addToRevokedTokens = (token) => {
  // Ajoutez le jeton révoqué au tableau
  revokedTokens.push(token);
};

export const isValidToken = (token) => {
  // Vérifiez si le token est présent dans le tableau des tokens révoqués
  return !revokedTokens.includes(token);
};

/**
 * Génère un jeton d'accès JWT en utilisant le payload spécifié.
 * @param {object} payload - Les données à inclure dans le jeton JWT.
 * @returns {string} - Le jeton JWT généré.
 */
export const generateAccessToken = (payload) => {
  try {
    // Signe le payload avec la clé secrète pour créer un jeton JWT
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_KEY,
      options
    );

    // Retourne le jeton JWT généré
    return accessToken;
  } catch (error) {
    // Gestion des erreurs en cas d'échec de la génération du jeton
    throw new Error("Erreur lors de la génération du jeton d'accès.");
  }
};

/**
 * Middleware d'authentification pour vérifier la validité du token JWT.
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction de middleware suivante.
 */
export const auth = (req, res, next) => {
  try {
    // Vérifier si le token existe dans les en-têtes de la requête
    const tokenExist = req.headers.authorization;
    if (!tokenExist) {
      return res.status(401).json({ error: "Vous n'êtes pas autorisé" }); // Token manquant
    }

    // Extraire le token de l'en-tête "Authorization"
    const token = tokenExist && req.headers.authorization.split(" ")[1];

    // Vérifier si le token est révoqué (dans la liste des tokens révoqués)
    if (revokedTokens.includes(token)) {
      return res.status(401).json({ error: "Vous êtes déconnecté" }); // Token révoqué
    }

    // Vérifier la validité du token en le décodant avec la clé secrète
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Vous n'êtes pas connecté" }); // Token invalide
      }
      // Si le token est valide, ajouter le payload décodé à l'objet de requête (req)
      req.user = decodedToken;
      // Passer à la middleware suivante
      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Middleware d'authentification pour vérifier si un utilisateur est un administrateur.
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 * @param {function} next - La fonction de middleware suivante.
 */
export const authAdmin = (req, res, next) => {
  try {
    // Vérifier si le token existe dans les en-têtes de la requête
    const tokenExist = req.headers.authorization;
    if (!tokenExist) {
      return res.status(400).json({ error: "Vous n'êtes pas autorisé" }); // Token manquant
    }

    // Extraire le token de l'en-tête "Authorization"
    const token = tokenExist && req.headers.authorization.split(" ")[1];

    // Vérifier si le token est révoqué (dans la liste des tokens révoqués)
    if (revokedTokens.includes(token)) {
      return res.status(200).json({ error: "Utilisateur déconnecté" }); // Token révoqué
    }

    // Vérifier la validité du token en le décodant avec la clé secrète
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ error: "Vous n'êtes pas connecté" }); // Token invalide
      }

      // Vérifier si l'utilisateur a le rôle d'administrateur
      if (!decodedToken.isAdmin) {
        return res.status(400).json({ error: "Vous n'êtes pas autorisé" });
      }

      // Si l'utilisateur est un administrateur, ajouter le payload décodé à l'objet de requête (req)
      req.user = decodedToken;

      // Passer à la middleware suivante
      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Récupère les données de l'utilisateur actuellement authentifié et génère un nouveau token.
 * @param {object} req - L'objet de requête Express.
 * @param {object} res - L'objet de réponse Express.
 */
export const authData = async (req, res) => {
  try {
    // Rechercher l'utilisateur en utilisant l'ID stocké dans req.user
    const userExist = await UserModel.findById(req.user.id);

    // Générer un nouveau token avec les informations de l'utilisateur (ID et statut d'administrateur)
    const token = generateAccessToken({
      id: userExist?._id.toString(),
      isAdmin: userExist?.isAdmin,
    });

    // Supprimer le mot de passe et le code de réinitialisation des données de l'utilisateur
    delete userExist?._doc.password;
    delete userExist?._doc.codePasseGenere;

    // Répondre avec les données de l'utilisateur et le nouveau token généré
    return res.status(200).json({ user: userExist, token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
