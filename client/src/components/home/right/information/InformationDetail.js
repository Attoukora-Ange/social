import React from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

export const InformationDetail = ({ inf }) => {
  return (
    <Card sx={{ display: "flex", my: 1, width: "100%" }}>
      <CardMedia
        component="img"
        sx={{ width: 100 }}
        image={`${inf.fichier}`}
        alt={inf.title}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {inf.title}
          </Typography>
          <Typography component="div" variant="body2">
            {inf.content}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};
