import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useRef, useState } from "react";
import { ALL_POST, ERROR } from "../../../reduce/Action";
import { USE_POST_CONTEXTE } from "../../../reduce/Contexte";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const RecordVideo = ({ openCamera, handleCloseCamera }) => {
  const { dispatch } = USE_POST_CONTEXTE();
  const [openErreur, setOpenErreur] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [erreur, setErreur] = useState("");
  const [affiche, setAffiche] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Créez un MediaRecorder pour capturer la vidéo en continu
        mediaRecorderRef.current = new MediaRecorder(stream);

        // Événement appelé lorsqu'un morceau de vidéo est disponible
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        // Événement appelé lorsque l'enregistrement est terminé
        mediaRecorderRef.current.onstop = () => {
          // Créez un objet Blob à partir des morceaux de vidéo
          const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });

          // Créez une URL pour la vidéo enregistrée
          const videoUrl = URL.createObjectURL(videoBlob);

          if (videoRef.current) {
            videoRef.current.src = videoUrl;
          }
        };

        // Commencez l'enregistrement
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra :", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAffiche(true);
    }
  };

  const handlePubler = async () => {
    try {
      // Crée un blob à partir des chunks de vidéo
      const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
  
      // Crée un objet FormData et y ajoute la vidéo
      const formData = new FormData();
      formData.set("fichier_post", videoBlob);
  
      // Récupère le token d'authentification depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
  
      // Configure les options de la requête Axios
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      };
  
      // Effectue la requête POST pour publier la vidéo
      await axios.post(
        `${process.env.REACT_APP_API}/post/poster`,
        { fichier_post: formData.get("fichier_post") },
        options
      );
  
      // Ferme la caméra et réinitialise l'état
      eteintCamera();
      handleCloseCamera("");
      setAffiche(false);
  
      // Récupère tous les posts après la publication
      const OPTIONS = {};
      const POST_DATA = await axios.get(
        `${process.env.REACT_APP_API}/post/poster`,
        OPTIONS
      );
  
      // Mise à jour de l'état des posts
      dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
  
      // Ferme le dialogue de publication
      handleClose();
    } catch (error) {
      // Gère les erreurs
      setOpenErreur(true);
      setErreur(error.message);
      dispatch({ type: ERROR });
    }
  };
  
  const eteintCamera = () => {
    // Éteindre la caméra en affectant null à srcObject
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  return (
    <BootstrapDialog
      onClose={handleCloseCamera}
      aria-labelledby="customized-dialog-title"
      open={openCamera}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center", fontSize: 30 }}
        id="customized-dialog-title"
      >
        Vidéo en direct
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseCamera}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <div>
          <video ref={videoRef} autoPlay width="100%" height="100%"></video>
        </div>
      </DialogContent>
      <DialogActions>
        {isRecording ? (
          <Button color="error" onClick={stopRecording}>
            Arrêter l'enregistrement
          </Button>
        ) : (
          <Button color="success" onClick={startRecording}>
            Démarrer l'enregistrement
          </Button>
        )}

        {affiche && (
          <Button
            color="success"
            autoFocus
            startIcon={<SendIcon />}
            onClick={handlePubler}
          >
            Envoyer
          </Button>
        )}
      </DialogActions>
      <Snackbar open={openErreur} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {erreur}
        </Alert>
      </Snackbar>
    </BootstrapDialog>
  );
};
