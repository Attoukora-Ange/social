import mongoose from "mongoose";
import { configDotenv } from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
configDotenv({ path: "./config/.env" });

// Options de configuration pour la connexion à MongoDB
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Fonction pour établir la connexion à la base de données MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, dbOptions);
    console.log("Connexion à la base de données établie avec succès");
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error.message);
  }
}

// Appel de la fonction pour établir la connexion à la base de données
connectToDatabase();

// Exportez l'objet mongoose pour être utilisé dans d'autres parties de votre application
export default mongoose;

