import multer from "multer";

// Fonction de configuration du stockage des fichiers
export const storage = multer.diskStorage({});

// Fonction de filtrage des types de fichiers acceptés (images et vidéos)
export const fileFilterImage = (_, file, cb) => {
  // Liste des types MIME autorisés pour les images et vidéos
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  // Vérifie si le type MIME du fichier est dans la liste autorisée
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Le fichier est accepté
  } else {
    cb(
      new Error(
        "Votre fichier doit être de type (.jpeg, .jpg, .png, .mp4, .webm .ogg)"
      ),
      false
    ); // Le fichier n'est pas accepté, renvoie une erreur
  }
};

// Fonction de filtrage des types de fichiers acceptés (images uniquement)
export const fileFilterImageSeul = (_, file, cb) => {
  // Liste des types MIME autorisés pour les images
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  // Vérifie si le type MIME du fichier est dans la liste autorisée
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Le fichier est accepté
  } else {
    cb(new Error("Votre fichier doit être de type (.jpeg, .jpg, .png)"), false); // Le fichier n'est pas accepté, renvoie une erreur
  }
};

// Configuration du stockage des fichiers téléchargés
export const upload = (chemin, fieldName, filter) =>
  multer({
    storage: storage(chemin), // Utilise la fonction de stockage avec le chemin spécifié
    limits: { fileSize: 100 * 1024 * 1024 }, // Limite la taille des fichiers à 100 Mo en octets
    fileFilter: filter, // Utilise la fonction de filtrage spécifiée
  }).single(fieldName); // Accepte un seul fichier avec le champ spécifié

// Middleware de gestion d'erreur de Multer
export const multerErrorMiddleware = (err, _, res, next) => {
  if (err) return res.status(415).json({ error: err.message }); // En cas d'erreur, renvoie un statut 415 (Unsupported Media Type) avec le message d'erreur de Multer
  next(); // Passe au middleware suivant
};
