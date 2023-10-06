import {
  ALL_INFO,
  ALL_POST,
  ALL_PROBLEME,
  ALL_SOUVENIR,
  CONNEXION,
  DECONNEXION,
  ERROR,
  LOADING,
  RELOADING,
  USER,
  USERS,
} from "./Action";

// Création du useReducer pour gérer les publications (posts)
const POST_REDUCER = (state, action) => {
  switch (action.type) {
    case LOADING:
      // Cas : Chargement en cours
      return {
        ...state,
        posts: [],
        error: false,
        loading: true,
      };
    case ALL_POST:
      // Cas : Toutes les publications ont été chargées
      return {
        ...state,
        posts: action.payload,
        error: false,
        loading: false,
      };
    case ALL_SOUVENIR:
      // Cas : Toutes les données de souvenir ont été chargées
      return {
        ...state,
        souvenir: action.payload,
      };
    case ALL_INFO:
      // Cas : Toutes les informations ont été chargées
      return {
        ...state,
        info: action.payload,
      };
    case ALL_PROBLEME:
      // Cas : Tous les problèmes ont été chargés
      return {
        ...state,
        probleme: action.payload,
      };
    case ERROR:
      // Cas : Une erreur s'est produite
      return {
        ...state,
        posts: [],
        info: [],
        probleme: [],
        error: true,
        loading: false,
      };
    default:
      // Cas par défaut : retourner l'état inchangé
      return state;
  }
};

// Création du useReducer pour gérer les utilisateurs
const USER_REDUCER = (state, action) => {
  switch (action.type) {
    case CONNEXION:
      // Cas : Connexion de l'utilisateur
      return {
        ...state,
        connect: true,
        user: action.payload,
      };
    case RELOADING:
      // Cas : Connexion de l'utilisateur
      return {
        ...state,
        connect: true,
      };

    case DECONNEXION:
      // Cas : Déconnexion de l'utilisateur
      return {
        ...state,
        connect: false,
        user: null,
        users: [],
      };
    case USER:
      // Cas : Mise à jour des données de l'utilisateur
      return {
        ...state,
        connect: true,
        user: action.payload,
      };
    case USERS:
      // Cas : Mise à jour de la liste des utilisateurs
      return {
        ...state,
        connect: true,
        users: action.payload,
      };
    default:
      // Cas par défaut : retourner l'état inchangé
      return state;
  }
};

export { POST_REDUCER, USER_REDUCER };
