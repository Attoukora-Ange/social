import React from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

export const FollowerDetail = ({ membre }) => {
  return (
    <List sx={{ width: "100%", p: 0 }}>
      <ListItem sx={{ width: 250 }} disablePadding>
        <ListItemButton
          sx={{ p: 0.5 }}
          component={Link}
          to={`/utilisateur/${membre._id}`}
        >
          {/* Utilisation de la route dynamique pour rediriger vers le profil du follower */}
          <ListItemAvatar>
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt={membre.nom_prenoms}
              src={`${membre.photo}`}
            />
          </ListItemAvatar>
          <ListItemText primary={membre.nom_prenoms} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
