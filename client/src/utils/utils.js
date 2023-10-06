export const calculerJoursDepuisCreationArticle = (dateCreationPost) => {
  // Date actuelle
  const dateActuelle = new Date();

  // Calcul de la différence en millisecondes
  const differenceEnMilliseconds = dateActuelle - dateCreationPost;

  // Fonction pour formater la durée en texte
  const formatDuree = (valeur, unite) => {
    return `${valeur} ${unite}${valeur > 1 ? "s" : ""}`;
  };

  // Calcul de la différence en minutes, heures, jours ou mois
  if (differenceEnMilliseconds < 3600000) {
    // Moins d'une heure (1 heure = 3600000 ms)
    const minutes = Math.floor(differenceEnMilliseconds / 60000); // 1 minute = 60000 ms
    return formatDuree(minutes, "minute");
  } else if (differenceEnMilliseconds < 86400000) {
    // Moins d'un jour (1 jour = 86400000 ms)
    const heures = Math.floor(differenceEnMilliseconds / 3600000); // 1 heure = 3600000 ms
    return formatDuree(heures, "heure");
  } else if (differenceEnMilliseconds < 2592000000) {
    // Moins d'un mois (30 jours = 2592000000 ms)
    const jours = Math.floor(differenceEnMilliseconds / 86400000); // 1 jour = 86400000 ms
    return formatDuree(jours, "jour");
  } else {
    // Plus d'un mois
    const mois = Math.floor(differenceEnMilliseconds / 2592000000); // 1 mois = 2592000000 ms
    return formatDuree(mois, "mois");
  }
};

export const alerterAnniversaire = (dateAnniversaire) => {
  const dateActuelle = new Date();
  const anniversaire = new Date(dateAnniversaire);

  return (
    dateActuelle.getDate() === anniversaire.getDate() &&
    dateActuelle.getMonth() === anniversaire.getMonth()
  );
};

export const calculateAge = (dateNaissance) => {
  const aujourdHui = new Date();
  const dateNaissanceFormatee = new Date(dateNaissance);
  const calculAnnee = 1000 * 60 * 60 * 24 * 365.25;
  const age = Math.floor((aujourdHui - dateNaissanceFormatee) / calculAnnee);
  return age;
};