import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Divider } from "@mui/material";

export const PostImage = ({ image, selectedFile, setFileType }) => {
  return (
    <>
      {image ? (
        <Card sx={{ maxWidth: "100%", mt: 2 }}>
          <CardMedia
            component="img"
            width="100%"
            height="100%"
            image={image}
            alt="modification de l'image poste"
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
            component="img"
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
