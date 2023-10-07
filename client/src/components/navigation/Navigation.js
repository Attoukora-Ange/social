import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import FilterListIcon from "@mui/icons-material/FilterList";
import ContactsIcon from "@mui/icons-material/Contacts";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Notification } from "./Notification";
import { styled } from "@mui/material/styles";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import { DECONNEXION } from "../../reduce/Action";

const StyledLink = styled(Link)({
  fontSize: 20,
  textDecoration: "none",
  color: "#f0f0f0",
});

const pagesAdmin = [
  {
    text: "Admin",
    icon: <SupervisorAccountIcon />,
    lien: "/administrateur",
  },
  {
    text: "Fils",
    icon: <FilterListIcon />,
    lien: "/",
  },
  {
    text: "Suggestions",
    icon: <ContactsIcon />,
    lien: "/suggestions",
  },
  {
    text: "Suivi(e)s",
    icon: <ContactsIcon />,
    lien: "/suivis",
  },
  {
    text: "Followers",
    icon: <ImportContactsIcon />,
    lien: "/followers",
  },
  {
    text: "Utilisateurs",
    icon: <ImportContactsIcon />,
    lien: "/utilisateurs",
  },
  {
    text: "Souvenirs",
    icon: <ContactsIcon />,
    lien: "/souvenirs",
  },
  {
    text: "Evenements",
    icon: <FilterListIcon />,
    lien: "/evenements",
  },
  {
    text: "Signaler un problème",
    icon: <FilterListIcon />,
    lien: "/problemes",
  },
];
const pagesUser = [
  {
    text: "Fils",
    icon: <FilterListIcon />,
    lien: "/",
  },
  {
    text: "Suggestions",
    icon: <ContactsIcon />,
    lien: "/suggestions",
  },
  {
    text: "Suivi(e)s",
    icon: <ContactsIcon />,
    lien: "/suivis",
  },
  {
    text: "Followers",
    icon: <ImportContactsIcon />,
    lien: "/followers",
  },
  {
    text: "Utilisateurs",
    icon: <ImportContactsIcon />,
    lien: "/utilisateurs",
  },
  {
    text: "Souvenirs",
    icon: <ContactsIcon />,
    lien: "/souvenirs",
  },
  {
    text: "Evenements",
    icon: <FilterListIcon />,
    lien: "/evenements",
  },
  {
    text: "Signaler un problème",
    icon: <FilterListIcon />,
    lien: "/problemes",
  },
];

export const Navigation = () => {
  const { user, connect, dispatch } = USE_USER_CONTEXTE();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDeconnexion = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token) {
        // Le token n'existe pas dans le localStorage, il n'est pas connecté.
        return;
      }

      const OPTIONS = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${process.env.REACT_APP_API}/user/deconnexion`,
        {},
        OPTIONS
      );

      // Réinitialise l'état de l'utilisateur (déconnexion)
      dispatch({ type: DECONNEXION });

      // Supprime le token du localStorage
      localStorage.removeItem("token");

      // Ferme le menu (si nécessaire)
      handleMenuClose();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Gérer les erreurs de déconnexion (par exemple, rediriger vers une page d'erreur)
      navigate("/erreur");
    }
  };

  // Pour les notification
  const [openNotification, setOpenNotification] = useState(false);

  const handleClickOpenNotification = () => {
    setOpenNotification(true);
  };
  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  // Debut  Importer d'un autre projet AttoNexa
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const list = () => (
    <Box
      sx={{
        width: "auto",
        backgroundColor: "#099e4c",
        height: "100%",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Si l'utilisateur est connecté et est un administrateur */}
      {connect &&
        (user?.isAdmin ? (
          <List>
            {/* Liste des pages pour les administrateurs */}
            {pagesAdmin.map((page, index) => (
              <ListItem
                key={index}
                component={Link}
                to={page.lien}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.text}
                    sx={{ color: "#fff", textTransform: "uppercase" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <List>
            {/* Liste des pages pour les utilisateurs non administrateurs */}
            {pagesUser.map((page, index) => (
              <ListItem
                key={index}
                component={Link}
                to={page.lien}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    {page.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={page.text}
                    sx={{ color: "#fff", textTransform: "uppercase" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ))}
    </Box>
  );

  // Fin  Importer d'un autre projet AttoNexa

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    // Menu déroulant pour les utilisateurs connectés
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* Option pour accéder à la page "Mon compte" */}
      <MenuItem component={Link} to="/mon-compte" onClick={handleMenuClose}>
        Mon compte
      </MenuItem>

      {/* Option pour se déconnecter */}
      <MenuItem onClick={handleDeconnexion}>Se déconnecter</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = connect ? (
    // Menu mobile pour les utilisateurs connectés
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* Option pour afficher les notifications */}
      <MenuItem onClick={handleClickOpenNotification}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
        >
          <Badge badgeContent={user?.suggestion.length - 1} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      {/* Option pour accéder au profil de l'utilisateur */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  ) : (
    // Menu mobile pour les utilisateurs non connectés
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* Option pour se connecter */}
      <MenuItem component={Link} to="/connexion" onClick={handleMenuClose}>
        Connexion
      </MenuItem>

      {/* Option pour s'inscrire */}
      <MenuItem component={Link} to="/inscription" onClick={handleMenuClose}>
        Inscription
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ top: 0, bgcolor: "#099e4c" }}>
        <Toolbar>
          {/* Bouton de menu (affiché sur mobile) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}
          >
            {connect && <MenuIcon onClick={toggleDrawer(true)} />}
          </IconButton>

          {/* Menu latéral (affiché sur mobile) */}
          <>
            <SwipeableDrawer
              anchor="left"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {list()}
            </SwipeableDrawer>
          </>

          {/* Logo de l'application */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white" }}
          >
            AttoNexa
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Contenu à droite de la barre de navigation (notifications et menu utilisateur) */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {connect ? (
              <>
                {/* Bouton de notifications */}
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  color="inherit"
                  onClick={handleClickOpenNotification}
                >
                  <Badge
                    badgeContent={user?.suggestion.length - 1}
                    color="error"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Menu utilisateur */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    alt={user?.nom_prenoms}
                    src={user?.photo}
                    sx={{ width: 26, height: 26 }}
                  />
                </IconButton>
              </>
            ) : (
              /* Liens de connexion et d'inscription (affichés si l'utilisateur n'est pas connecté) */
              <Stack gap={1} direction="row">
                <StyledLink to="/connexion">Connexion</StyledLink>
                <StyledLink to="/inscription">Inscription</StyledLink>
              </Stack>
            )}
          </Box>

          {/* Bouton de menu mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications (affichées si l'utilisateur a des notifications non lues) */}
      {user?.suggestion.length - 1 !== 0 && (
        <Notification
          openNotification={openNotification}
          handleCloseNotification={handleCloseNotification}
        />
      )}

      {/* Menu mobile */}
      {renderMobileMenu}

      {/* Menu utilisateur (affiché au clic sur l'icône utilisateur) */}
      {renderMenu}
    </Box>
  );
};
