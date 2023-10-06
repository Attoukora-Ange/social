import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import {
  InputBase,
  Avatar,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { forwardRef, useRef, useState } from "react";
import { PostVideo } from "./PostVideo";
import { PostImage } from "./PostImage";
import axios from "axios";
import { ALL_POST, ALL_SOUVENIR, ERROR } from "../../../reduce/Action";
import { USE_POST_CONTEXTE, USE_USER_CONTEXTE } from "../../../reduce/Contexte";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  minWidth: 400,
  backgroundColor: "inherit",
  "&:hover": {
    backgroundColor: "#F2F3F5",
  },
  marginRight: theme.spacing(1),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  fontSize: 20,
  "& .MuiInputBase-input": {
    borderRadius: 10,
    padding: theme.spacing(1, 1, 1, 0),
    backgroundColor: "#F2F3F5",
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ModPost = ({ post, open, handleClose }) => {
  const { dispatch } = USE_POST_CONTEXTE();
  const { user } = USE_USER_CONTEXTE();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [content, setContent] = useState(post.content);
  const [openErreur, setOpenErreur] = useState(false);
  const [openErreurSecondaire, setOpenErreurSecondaire] = useState(false);
  const [erreur, setErreurSecondaire] = useState("");
  const [image, setImage] = useState(post?.image);
  const [video, setVideo] = useState(post?.video);
  const inputFile = useRef();

  const handleCloseSnackBar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreur(false);
  };
  const handleCloseSnackBarError = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErreurSecondaire(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

      if (allowedImageTypes.includes(file.type)) {
        setFileType("image");
      } else if (allowedVideoTypes.includes(file.type)) {
        setFileType("video");
      } else {
        setOpenErreur(true);
        setFileType("invalide");
      }
      setImage(null);
      setVideo(null);
      setSelectedFile(file);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleModPublier = (id) => {
    const FD = new FormData();
    FD.set("content", content);
    FD.set("fichier_post", selectedFile);
    try {
      const AXIOS_TO_PUT_POSTER = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        };
        await axios.put(
          `${process.env.REACT_APP_API}/post/poster/${id}`,
          { content: FD.get("content"), fichier_post: FD.get("fichier_post") },
          OPTIONS
        );

        //On fetch sur tous les poster
        const AXIOS_TO_GET_POST = async () => {
          const OPTIONS = {};
          const POST_DATA = await axios.get(
            `${process.env.REACT_APP_API}/post/poster`,
            OPTIONS
          );
          AXIOS_TO_GET_POST_SOUVENIR();
          dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
          handleClose();
        };

        const AXIOS_TO_GET_POST_SOUVENIR = async () => {
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };

          const POST_DATA_SOUVENIR = await axios.get(
            `${process.env.REACT_APP_API}/post/poster/souvenir`,
            OPTIONS
          );
          dispatch({
            type: ALL_SOUVENIR,
            payload: POST_DATA_SOUVENIR.data.post,
          });
        };

        AXIOS_TO_GET_POST().catch(() => {
          dispatch({ type: ERROR });
        });
      };

      AXIOS_TO_PUT_POSTER().catch((e) => {
        setOpenErreurSecondaire(true);
        setErreurSecondaire(e.response.data.error);
      });
    } catch (error) {
      setOpenErreurSecondaire(true);
      setErreurSecondaire(error.message);
      dispatch({ type: ERROR });
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle
        sx={{ m: 0, textAlign: "center", fontSize: 30 }}
        id="customized-dialog-title"
      >
        Modifier la publication
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ overflowY: "initial" }} dividers>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton sx={{ p: 0.5 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  alt={user?.nom_prenoms}
                  src={user?.photo}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user?.nom_prenoms}
                secondary="A modifier maintenant"
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Search>
          <StyledInputBase
            placeholder="Quoi de neuf ?"
            inputProps={{ "aria-label": "search" }}
            multiline
            rows={2}
            value={content}
            name="content"
            onChange={handleChange}
          />
        </Search>
        {(fileType === "image" || post.image) && (
          <PostImage
            image={image}
            selectedFile={selectedFile}
            setFileType={setFileType}
          />
        )}
        {(fileType === "video" || post.video) && (
          <PostVideo
            video={video}
            selectedFile={selectedFile}
            setFileType={setFileType}
          />
        )}
        {fileType === "invalide" && (
          <Snackbar
            open={openErreur}
            autoHideDuration={3000}
            onClose={handleCloseSnackBar}
          >
            <Alert
              onClose={handleCloseSnackBar}
              severity="error"
              sx={{ width: "100%" }}
            >
              Type de fichier non pris en charge. Veuillez sélectionner une
              image (jpg, jpeg, png, gif) ou une vidéo (mp4, webm, ogg).
            </Alert>
          </Snackbar>
        )}

        <Snackbar
          open={openErreurSecondaire}
          autoHideDuration={3000}
          onClose={handleCloseSnackBarError}
        >
          <Alert
            onClose={handleCloseSnackBarError}
            severity="error"
            sx={{ width: "100%" }}
          >
            {erreur}
          </Alert>
        </Snackbar>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => inputFile.current.click()}
          variant="text"
          startIcon={<PhotoLibraryIcon />}
        >
          <input
            ref={inputFile}
            type="file"
            accept="image/jpeg, image/jpg, image/png, image/gif, video/mp4, video/webm, video/ogg" // N'accepte que les fichiers vidéo et image
            onChange={handleFileUpload}
            hidden
          />
          Photo / vidéo
        </Button>
        <Button
          color="success"
          autoFocus
          startIcon={<SendIcon />}
          onClick={() => handleModPublier(post._id)}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
};
