import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export const AnniverssaireDetail = ({ membre }) => {
  return (
    <List sx={{ width: "100%", p: 0 }}>
      <ListItem sx={{ width: 250 }} disablePadding>
        <ListItemButton sx={{ p: 0.5 }}>
          <ListItemAvatar>
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt={membre.nom_prenoms}
              src={`${membre.photo}`}
            />
          </ListItemAvatar>
          <ListItemText
            secondary={`C'est l'anniverssaire de ${membre.nom_prenoms} aujourd'hui`}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
