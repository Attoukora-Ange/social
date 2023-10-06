import { Box, Button, Stack, Typography } from "@mui/material";
import { calculateAge } from "../../utils/utils";

export const InfoUser = ({ postUser }) => {
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
          {postUser?.genre}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Nom et Prénoms :{" "}
          </Typography>
          {postUser?.nom_prenoms}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Age :{" "}
          </Typography>
          {calculateAge(postUser?.date_naissance)} ans
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Situation matrimoniale :{" "}
          </Typography>
          {postUser?.matrimoniale}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Pays :{" "}
          </Typography>
          {postUser?.pays}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Ville actuelle:{" "}
          </Typography>
          {postUser?.ville}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Profession :{" "}
          </Typography>
          {postUser?.profession}
        </Typography>
        <Typography variant="h6" component="div" fontWeight={500}>
          <Typography variant="body2" component="span" fontWeight={300}>
            Biographie :{" "}
          </Typography>
          {postUser?.biographie}
        </Typography>
        <Stack gap={1}>
          <Button variant="outlined" disableElevation disableRipple>
            {postUser?.followers?.length} followers
          </Button>
          <Button
            variant="outlined"
            color="error"
            disableElevation
            disableRipple
          >
            {postUser?.following?.length} suivies
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
