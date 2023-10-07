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
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Commentaire } from "../../middle/Commentaire";
import { calculerJoursDepuisCreationArticle } from "../../../../utils/utils";
import {
  USE_POST_CONTEXTE,
  USE_USER_CONTEXTE,
} from "../../../../reduce/Contexte";
import axios from "axios";
import { ALL_SOUVENIR, ERROR } from "../../../../reduce/Action";
import { PostCommenter } from "../../middle/PostCommenter";
import { ModPost } from "../../middle/ModPost";

export const SouvenirDetail = ({ post }) => {
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

  const handleLick = (id) => {
    try {
      const AXIOS_TO_PATCH_LIKE = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios.patch(
          `${process.env.REACT_APP_API}/post/poster/like/${id}`,
          {},
          OPTIONS
        );
        //On fetch sur tous les poster
        const AXIOS_TO_GET_POST = async () => {
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };
          const POST_DATA = await axios.get(
            `${process.env.REACT_APP_API}/post/poster/souvenir`,
            OPTIONS
          );
          dispatch({ type: ALL_SOUVENIR, payload: POST_DATA.data.post });
        };
        AXIOS_TO_GET_POST().catch(() => {
          dispatch({ type: ERROR });
        });
      };
      AXIOS_TO_PATCH_LIKE().catch((e) => {
        console.log(e);
        navigate("/connexion");
      });
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  const handleUnLick = (id) => {
    try {
      const AXIOS_TO_PATCH_LIKE = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };
        await axios.patch(
          `${process.env.REACT_APP_API}/post/poster/unlike/${id}`,
          {},
          OPTIONS
        );
        //On fetch sur tous les poster
        const AXIOS_TO_GET_POST = async () => {
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };
          const POST_DATA = await axios.get(
            `${process.env.REACT_APP_API}/post/poster/souvenir`,
            OPTIONS
          );
          dispatch({ type: ALL_SOUVENIR, payload: POST_DATA.data.post });
        };
        AXIOS_TO_GET_POST().catch(() => {
          dispatch({ type: ERROR });
        });
      };

      AXIOS_TO_PATCH_LIKE().catch((e) => {
        console.log(e);
        navigate("/connexion");
      });
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  const handleDelete = (id) => {
    try {
      const AXIOS_TO_DELETE_POST = async () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const OPTIONS = {
          headers: {
            authorization: `Bearer ${token}`,
          },
        };

        await axios.delete(
          `${process.env.REACT_APP_API}/post/poster/${id}`,
          OPTIONS
        );
        //On fetch sur tous les poster
        const AXIOS_TO_GET_POST = async () => {
          const token = JSON.parse(localStorage.getItem("token"));
          const OPTIONS = {
            headers: {
              authorization: `Bearer ${token}`,
            },
          };
          const POST_DATA = await axios.get(
            `${process.env.REACT_APP_API}/post/poster/souvenir`,
            OPTIONS
          );
          dispatch({ type: ALL_SOUVENIR, payload: POST_DATA.data.post });
        };
        AXIOS_TO_GET_POST().catch(() => {
          dispatch({ type: ERROR });
        });
      };
      AXIOS_TO_DELETE_POST().catch((e) => {
        console.log(e.message);
        navigate("/connexion");
      });
    } catch (error) {
      dispatch({ type: ERROR });
    }
  };

  return (
    <Card
      sx={{
        width: "30%",
        // minWidth: 430,
        height: "40vh",
        overflowY: "scroll",
        justifySelf: "self-start",
        alignSelf: "self-start",
      }}
    >
      <CardHeader
        avatar={
          <Avatar alt={post?.postUser.nom_prenoms} src={post?.postUser.photo} />
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
              <IconButton onClick={handleClickOpenModPost} aria-label="editer">
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
        <video height="100%" width="100%" muted controls>
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

            <Button onClick={handleClickOpen} variant="text" color="secondary">
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
