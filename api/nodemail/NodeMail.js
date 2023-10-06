import nodemailer from "nodemailer";

// Fonction pour configurer le transporteur Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILLER_EMAIL,
      pass: process.env.NODE_MAILLER_PASS,
    },
  });
};

// Fonction pour envoyer un e-mail
export const sendEmail = async (email, userFound, codePasseGenere) => {
  try {
    // Configuration du transporteur
    const transporter = createTransporter();

    // Options de l'e-mail
    const emailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `<h3>Bonjour ${userFound.nom_prenoms}, pour réinitialiser votre mot de passe,
             veuillez entrer ce code : ${codePasseGenere}`,
    };

    // Envoi de l'e-mail
    await transporter.sendMail(emailOptions);

    // Fermeture du transporteur
    transporter.close();

    // Succès de l'envoi de l'e-mail
    return true;
  } catch (error) {
    // Gestion des erreurs d'envoi d'e-mail
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    return false;
  }
};
