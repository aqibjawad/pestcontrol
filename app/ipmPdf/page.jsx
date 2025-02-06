import React from "react";
import { Grid, Paper } from "@mui/material";

const IpmPdf = () => {
  return (
    <Paper sx={{ padding: 2 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Left side text */}
        <Grid item xs={10}>
          Accurate Pest Control
        </Grid>

        {/* Right side content (PDF Link or View) */}
        <Grid item xs={2} sx={{ textAlign: "right" }}>
          <img style={{ height: "50px", height: "50px" }} src="/logo.jpeg" />
        </Grid>
      </Grid>

      <div className="mt-5" style={{ width:"300px", fontWeight: "bold", fontSize: "20px", color: "#37A730", border:"5px solid black", textAlign:"center" }}>
        Inspection Report
      </div>
    </Paper>
  );
};

export default IpmPdf;
