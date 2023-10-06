import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import "./config/dataBase.js";
import { userRoutes } from "./routes/User.routes.js";
import { postRoutes } from "./routes/Post.routes.js";
import { auth, authData } from "./middleware/Auth.js";

configDotenv({ path: "./config/.env" }); // Configuration de dotenv

// Création de l'application Express
const app = express();

// Configuration de CORS
const corsOptions = {
  origin: process.env.CLIENT, // Vous pouvez personnaliser l'origine ici
  methods: "GET,PUT,POST,PATCH,DELETE",
};

// Utilisation du middleware CORS
app.use(cors(corsOptions));

// Middleware pour servir des fichiers statiques (images)
app.use(express.static("images"));

// Middleware pour traiter les données JSON
app.use(express.json());

// Middleware pour traiter les données URL encodées
app.use(express.urlencoded({ extended: true }));

// Routes pour l'authentification et les données de l'utilisateur
app.use("/api/auth", auth, authData);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Port d'écoute du serveur
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
app.listen(PORT, () => console.log(`Serveur démarré au port ${PORT}`));
