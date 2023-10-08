import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const Left = ({ mode, setMode }) => {
  const { user } = USE_USER_CONTEXTE();

  const handleChangeMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <StyledBox flexGrow={1} p={1}>
      <List sx={{ width: "100%" }}>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            sx={{ borderRadius: 2 }}
            component={Link}
            to="/mon-compte"
          >
            <ListItemAvatar>
              <Avatar
                sx={{ width: 30, height: 30 }}
                alt={user?.nom_prenoms}
                src={`${user?.photo}`}
              />
            </ListItemAvatar>
            <ListItemText primary={user?.nom_prenoms} />
          </ListItemButton>
        </ListItem>
        {user?.isAdmin && (
          <ListItem sx={{ width: 300 }} disablePadding>
            <ListItemButton
              component={Link}
              to="/administrateur"
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>
                <InboxIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton component={Link} to="/" sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <InboxIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Fils" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/suggestions"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Suggestions" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/suivis"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Suivi(e)s" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/followers"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Followers" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/utilisateurs"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Utilisateurs" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/souvenirs"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Souvenirs" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/evenements"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="info" />
            </ListItemIcon>
            <ListItemText primary="Evènements" />
          </ListItemButton>
        </ListItem>
        <ListItem sx={{ width: 300 }} disablePadding>
          <ListItemButton
            component={Link}
            to="/problemes"
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <InboxIcon color="info" />
            </ListItemIcon>
            <ListItemText primary="Signaler un problème" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton disableRipple>
            <ListItemIcon>
              {mode === "light" ? (
                <WbSunnyIcon color="success" />
              ) : (
                <NightlightIcon />
              )}
            </ListItemIcon>
            <Switch onChange={handleChangeMode} />
          </ListItemButton>
        </ListItem>
      </List>
    </StyledBox>
  );
};
