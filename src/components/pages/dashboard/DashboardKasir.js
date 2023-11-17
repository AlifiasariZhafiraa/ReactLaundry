import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

export default function homeKasir({ count }) {
  return (
    <Grid container sx={{ m: 5 }}>
      <Typography sx={{ fontSize: 26, fontWeight: 500 }}>
        Hi Kasir
      </Typography>
      <Grid
        justifyContent={"space-around"}
        container
        sx={{
          mt: 3,
          backgroundColor: "#BDBDBD",
          borderRadius: 3,
          p: 5,
        }}
      >
        <div>
          <Typography sx={{ color: "#000000", fontWeight: 300 }}>Member</Typography>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: 600,
              fontSize: 25,
              margin: "4px 0px",
            }}
          >
            {count.member}
          </Typography>
          <Typography sx={{ color: "#000000", fontSize: 14, fontWeight: 300 }}>
            total semua data member
          </Typography>
        </div>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: "#000000" }}
        />

        <div>
          <Typography sx={{ color: "#000", fontWeight: 300 }}>Transaksi</Typography>
          <Typography
            sx={{
              color: "#000",
              fontWeight: 600,
              fontSize: 25,
              margin: "4px 0px",
            }}
          >
            {count.transaksi}
          </Typography>
          <Typography sx={{ color: "#000", fontSize: 14, fontWeight: 300 }}>
            total semua data transaksi
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}