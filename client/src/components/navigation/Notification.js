import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";

export const Notification = ({ openNotification, handleCloseNotification }) => {
  const { user, users } = USE_USER_CONTEXTE();

  return (
    <Dialog
      onClose={handleCloseNotification}
      aria-labelledby="customized-dialog-title"
      open={openNotification}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, textAlign: "center", fontSize: 30 }}
        id="customized-dialog-title"
      >
        Mes notifications
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseNotification}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* Liste des suggestions d'utilisateurs */}
      <Stack overflow="initial">
        {user?.suggestion.map((suggId) => {
          const membre = users?.find((membre) => membre._id === suggId);
          if (membre && user?._id !== membre._id) {
            return (
              <DialogContent key={suggId} dividers>
                <List sx={{ width: "100%", p: 0 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{ p: 0.5 }}
                      component={Link}
                      to={`/utilisateur/${membre._id}`}
                      onClick={handleCloseNotification}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: 40, height: 40 }}
                          alt={membre.nom_prenoms}
                          src={`${membre.photo}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={membre.nom_prenoms}
                        secondary={`${membre.nom_prenoms} a récemment visité votre profil`}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </DialogContent>
            );
          }
          return null;
        })}
      </Stack>
    </Dialog>
  );
};
