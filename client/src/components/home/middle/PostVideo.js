import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider } from "@mui/material";

export const PostVideo = ({ video, selectedFile, setFileType }) => {
  return (
    <>
      {video ? (
        <Card sx={{ maxWidth: "10%", mt: 2 }}>
          <CardMedia
            component="video"
            controls
            preload="auto"
            width="100%"
            height="100%"
            src={video}
            alt="modification de la vidéo"
          />
          <Divider />
        </Card>
      ) : (
        <Card sx={{ maxWidth: "100%", mt: 2 }}>
          <CardActions disableSpacing>
            <Divider />
            <Box display="flex" justifyContent="space-around">
              <Button
                onClick={() => setFileType("")}
                variant="text"
                color="error"
                startIcon={<DeleteIcon />}
              >
                Rétirer
              </Button>
            </Box>
          </CardActions>
          <CardMedia
            component="video"
            controls
            width="100%"
            height="100%"
            image={URL.createObjectURL(selectedFile)}
            alt={selectedFile.name}
          />

          <Divider />
        </Card>
      )}
    </>
  );
};
