import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider } from "@mui/material";
import { Commentaire } from "./Commentaire";
import { PostCommenter } from "./PostCommenter";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ALL_POST, ERROR } from "../../../reduce/Action";
import { USE_POST_CONTEXTE, USE_USER_CONTEXTE } from "../../../reduce/Contexte";
import { ModPost } from "./ModPost";
import { calculerJoursDepuisCreationArticle } from "../../../utils/utils";
import axios from "axios";

export const Contenu = ({ post }) => {
  const { user, connect } = USE_USER_CONTEXTE();
  const { dispatch } = USE_POST_CONTEXTE();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModPost, setOpenModPost] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenModPost = () => {
    setOpenModPost(true);
  };
  const handleCloseModPost = () => {
    setOpenModPost(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLick = async (id) => {
    try {
      // Récupérer le token depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Effectuer la mise à jour du "like" pour le post spécifié
      await axios.patch(
        `${process.env.REACT_APP_API}/post/poster/like/${id}`,
        {},
        OPTIONS
      );

      // Rafraîchir la liste des posts après le "like"
      const AXIOS_TO_GET_POST = async () => {
        const OPTIONS = {};
        const POST_DATA = await axios.get(
          `${process.env.REACT_APP_API}/post/poster`,
          OPTIONS
        );

        // Mettre à jour le state avec les nouveaux posts
        dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
      };

      // Appeler la fonction pour rafraîchir la liste des posts
      await AXIOS_TO_GET_POST().catch(() => {
        dispatch({ type: ERROR });
      });
    } catch (error) {
      console.log(error);
      navigate("/connexion");
    }
  };

  const handleUnLick = async (id) => {
    try {
      // Récupérer le token depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Effectuer la mise à jour du "unlike" pour le post spécifié
      await axios.patch(
        `${process.env.REACT_APP_API}/post/poster/unlike/${id}`,
        {},
        OPTIONS
      );

      // Rafraîchir la liste des posts après le "unlike"
      const AXIOS_TO_GET_POST = async () => {
        const OPTIONS = {};
        const POST_DATA = await axios.get(
          `${process.env.REACT_APP_API}/post/poster`,
          OPTIONS
        );

        // Mettre à jour le state avec les nouveaux posts
        dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
      };

      // Appeler la fonction pour rafraîchir la liste des posts
      await AXIOS_TO_GET_POST().catch(() => {
        dispatch({ type: ERROR });
      });
    } catch (error) {
      console.log(error);
      navigate("/connexion");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Récupérer le token depuis le localStorage
      const token = JSON.parse(localStorage.getItem("token"));
      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      // Effectuer la suppression du post spécifié
      await axios.delete(
        `${process.env.REACT_APP_API}/post/poster/${id}`,
        OPTIONS
      );

      // Rafraîchir la liste des posts après la suppression
      const AXIOS_TO_GET_POST = async () => {
        const OPTIONS = {};
        const POST_DATA = await axios.get(
          `${process.env.REACT_APP_API}/post/poster`,
          OPTIONS
        );

        // Mettre à jour le state avec les nouveaux posts
        dispatch({ type: ALL_POST, payload: POST_DATA.data.post });
      };

      // Appeler la fonction pour rafraîchir la liste des posts
      await AXIOS_TO_GET_POST().catch(() => {
        dispatch({ type: ERROR });
      });
    } catch (error) {
      console.log(error.message);
      navigate("/connexion");
    }
  };

  const CardContentPost = ({ post }) => {
    return (
      <Card sx={{ maxWidth: "100%" }}>
        <CardHeader
          avatar={
            <Avatar
              alt={post?.postUser.nom_prenoms}
              src={post?.postUser.photo}
            />
          }
          action={
            connect &&
            (user?._id === post?.postUser._id ? (
              <>
                <IconButton
                  component={Link}
                  to={"/mon-compte"}
                  aria-label="visible"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={handleClickOpenModPost}
                  aria-label="editer"
                >
                  <ModeEditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(post?._id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  component={Link}
                  to={"/utilisateur/" + post?.postUser._id}
                  aria-label="visible"
                >
                  <VisibilityIcon />
                </IconButton>
              </>
            ))
          }
          title={post?.postUser.nom_prenoms}
          subheader={`${calculerJoursDepuisCreationArticle(
            new Date(post?.createdAt)
          )} `}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {post?.content}
          </Typography>
        </CardContent>

        {post?.image && (
          <CardMedia component="img" image={post?.image} alt="les postes" />
        )}

        {post?.video && (
          <video height="100%" width="100%" preload="auto" muted controls>
            <source src={post?.video} type="video/mp4" />
            <source src={post?.video} type="video/webm" />
            <source src={post?.video} type="video/ogg" />
          </video>
        )}

        <CardActions disableSpacing>
          <Divider />
          {connect ? (
            <Box display="flex" flexGrow={1} justifyContent="space-between">
              {post?.like.includes(user?._id) ? (
                <Button
                  onClick={() => handleUnLick(post?._id)}
                  variant="text"
                  color="primary"
                  startIcon={<ThumbUpAltIcon />}
                >
                  {post?.like.length !== 0 && post?.like.length}
                </Button>
              ) : (
                <Button
                  onClick={() => handleLick(post?._id)}
                  variant="text"
                  color="primary"
                  startIcon={<ThumbUpOutlinedIcon />}
                >
                  {post?.like.length !== 0 && post?.like.length}
                </Button>
              )}

              <Button
                onClick={handleClickOpen}
                variant="text"
                color="secondary"
              >
                <CommentIcon fontSize="small" />
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexGrow={1} justifyContent="space-between">
              {post?.like.includes(user?._id) ? (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<ThumbUpAltIcon />}
                >
                  {post?.like.length !== 0 && post?.like.length}
                </Button>
              ) : (
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<ThumbUpOutlinedIcon />}
                >
                  {post?.like.length !== 0 && post?.like.length}
                </Button>
              )}
            </Box>
          )}

          {post?.commentaire.length !== 0 && (
            <Button onClick={handleExpandClick} variant="text" color="warning">
              {post?.commentaire.length} Commentaires
            </Button>
          )}
        </CardActions>
        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ height: 350, overflowY: "scroll" }}>
            {post?.commentaire.map((comment) => (
              <Box key={comment._id}>
                <Commentaire
                  handleExpandClick={handleExpandClick}
                  postId={post._id}
                  comment={comment}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
        <ModPost
          post={post}
          open={openModPost}
          handleClose={handleCloseModPost}
        />
        <PostCommenter id={post?._id} open={open} handleClose={handleClose} />
      </Card>
    );
  };

  if (
    user?.following.includes(post?.postUser._id) ||
    user?._id === post?.postUser._id
  ) {
    return <CardContentPost post={post} />;
  }
};
