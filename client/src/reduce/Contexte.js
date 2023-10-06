import React, { createContext, useContext, useEffect, useReducer } from "react";
import { POST_REDUCER, USER_REDUCER } from "./Reduce";

// Initialisation de l'état initial pour l'utilisateur
const INITIAL_USER = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  connect: false,
  users: [],
};

// Initialisation de l'état initial pour les publications (posts)
const INITIAL_POST = {
  posts: [],
  info: [],
  probleme: [],
  souvenir: [],
  error: false,
  loading: false,
};

// Création du contexte pour l'utilisateur
const USER_CONTEXT = createContext(INITIAL_USER);

// Création du contexte pour les publications (posts)
const POST_CONTEXT = createContext(INITIAL_POST);

// Contexte utilisateur : gère l'état et les actions liés à l'utilisateur
const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(USER_REDUCER, INITIAL_USER);

  // Effet pour mettre à jour les données dans le stockage local
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("connect", JSON.stringify(state.connect));
  }, [state.user, state.connect]);

  return (
    <USER_CONTEXT.Provider value={{ ...state, dispatch }}>
      {children}
    </USER_CONTEXT.Provider>
  );
};

// Contexte publications (posts) : gère l'état et les actions liés aux publications
const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(POST_REDUCER, INITIAL_POST);

  return (
    <POST_CONTEXT.Provider value={{ ...state, dispatch }}>
      {children}
    </POST_CONTEXT.Provider>
  );
};

// Fonction pour utiliser le contexte utilisateur
const USE_USER_CONTEXTE = () => useContext(USER_CONTEXT);

// Fonction pour utiliser le contexte publications (posts)
const USE_POST_CONTEXTE = () => useContext(POST_CONTEXT);

export { UserProvider, USE_USER_CONTEXTE, PostProvider, USE_POST_CONTEXTE };
