import {
  Box,
  InputBase,
  Paper,
  Stack,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { useState } from "react";
import { CadrePost } from "./CadrePost";
import { RecordVideo } from "./RecordVideo";
import { USE_USER_CONTEXTE } from "../../../reduce/Contexte";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
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
  "& .MuiInputBase-input": {
    borderRadius: 10,
    padding: theme.spacing(1, 1, 1, 0),
    backgroundColor: "#F2F3F5",
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
  },
}));

export const Haut = () => {
  const { user } = USE_USER_CONTEXTE();
  const [open, setOpen] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [copyContent, setCopyContent] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCamera = () => {
    setOpenCamera(false);
  };

  const startCamera = async () => {
    setOpenCamera(true);
  };

  return (
    <Paper sx={{ p: 1 }}>
      <Stack direction="column" gap={1}>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{ width: 40, height: 40, marginRight: 1 }}
            alt={user?.nom_prenoms}
            src={process.env.REACT_APP_CHEMIN_IMAGE + "/" + user?.photo}
          />
          <Search>
            <StyledInputBase
              placeholder={`Quoi de neuf ?`}
              inputProps={{ "aria-label": "search" }}
              onClick={handleClickOpen}
              onInput={handleClickOpen}
              value={copyContent}
            />
          </Search>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-around">
          <Button
            variant="text"
            color="success"
            startIcon={<OndemandVideoIcon />}
            onClick={startCamera}
          >
            Vidéo en direct
          </Button>
          <Button
            onClick={handleClickOpen}
            variant="text"
            startIcon={<PhotoLibraryIcon />}
          >
            Photo / vidéo
          </Button>
          <Button
            variant="text"
            color="warning"
            startIcon={<EmojiEmotionsIcon />}
          >
            Humeur / activité
          </Button>
        </Box>
      </Stack>
      <CadrePost
        setCopyContent={setCopyContent}
        open={open}
        handleClose={handleClose}
      />
      <RecordVideo
        openCamera={openCamera}
        handleCloseCamera={handleCloseCamera}
      />
    </Paper>
  );
};
