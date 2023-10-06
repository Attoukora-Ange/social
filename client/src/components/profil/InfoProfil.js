import { Box, Button, Stack, Typography } from "@mui/material";
import { USE_USER_CONTEXTE } from "../../reduce/Contexte";
import { calculateAge } from "../../utils/utils";

export const InfoProfil = () => {
  const { user } = USE_USER_CONTEXTE();
  return (
    <Stack flex={1} gap={1} maxWidth={445}>
      <Box
        sx={{
          border: "1px solid black",
          borderRadius: 1,
          p: 2,
          height: "100%",
        }}
      >
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Genre :{" "}
          </Typography>
          {user?.genre}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Nom et Prénoms :{" "}
          </Typography>
          {user?.nom_prenoms}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Age :{" "}
          </Typography>
          {calculateAge(user?.date_naissance)} ans
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Situation matrimoniale :{" "}
          </Typography>
          {user?.matrimoniale}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Pays :{" "}
          </Typography>
          {user?.pays}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Ville actuelle:{" "}
          </Typography>
          {user?.ville}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Profession :{" "}
          </Typography>
          {user?.profession}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Biographie :{" "}
          </Typography>
          {user?.biographie}
        </Typography>
        <Stack gap={1}>
          <Button variant="outlined" disableElevation disableRipple>
            {user?.followers?.length} followers
          </Button>
          <Button
            variant="outlined"
            color="error"
            disableElevation
            disableRipple
          >
            {user?.following?.length} suivies
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
