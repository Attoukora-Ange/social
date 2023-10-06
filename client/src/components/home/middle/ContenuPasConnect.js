import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { Box, Button, Divider } from "@mui/material";
import { Commentaire } from "./Commentaire";
import { useState } from "react";
import { calculerJoursDepuisCreationArticle } from "../../../utils/utils";

export const ContenuPasConnect = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

          <Box display="flex" flexGrow={1} justifyContent="space-between">
            <Button
              variant="text"
              color="primary"
              startIcon={<ThumbUpOutlinedIcon />}
            >
              {post?.like.length !== 0 && post?.like.length}
            </Button>
          </Box>

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
      </Card>
    );
  };

  return <CardContentPost post={post} />;
};
