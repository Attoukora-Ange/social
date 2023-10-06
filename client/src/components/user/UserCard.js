import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export const UserCard = ({ postUser }) => {
  return (
    <Card sx={{ maxWidth: 445 }}>
      <CardMedia
        component="img"
        // height="294"
        image={postUser?.photo}
        alt={postUser?.nom_prenoms}
      />
    </Card>
  );
};
