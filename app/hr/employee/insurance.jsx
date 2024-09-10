import React from "react";
import { Grid, Typography } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import "./index.css";

const Insurance = ({ data, onChange }) => {
  return (
    <div>
      {/* Health Insurance Section */}
      <Typography variant="h6" gutterBottom className="health-head">
        Health Insurance
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={12}>
          <InputWithTitle
            title="Health Insurance Status"
            type="text"
            placeholder="Health Insurance Status"
            value={data.hi_status}
            onChange={(e) => onChange("hi_status")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Insurance Start"
            type="date"
            placeholder="Insurance Start"
            value={data.hi_start}
            onChange={(e) => onChange("hi_start")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Insurance Expiry"
            type="date"
            placeholder="Insurance Expiry"
            value={data.hi_expiry}
            onChange={(e) => onChange("hi_expiry")}
          />
        </Grid>
      </Grid>

      {/* Unemployment Insurance Section */}
      <Typography
        variant="h6"
        gutterBottom
        className="health-head"
        style={{ marginTop: "2rem" }}
      >
        Unemployment Insurance
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={12}>
          <InputWithTitle
            title="Unemployment Insurance Status"
            type="text"
            placeholder="Unemployment Insurance Status"
            value={data.ui_status}
            onChange={(e) => onChange("ui_status")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Insurance Start"
            type="date"
            placeholder="Insurance Start"
            value={data.ui_start}
            onChange={(e) => onChange("ui_start")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Insurance Expiry"
            type="date"
            placeholder="Insurance Expiry"
            value={data.ui_expiry}
            onChange={(e) => onChange("ui_expiry")}
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithTitle
            title="DM Card"
            type="text"
            placeholder="DM Card"
            value={data.dm_card}
            onChange={(e) => onChange("dm_card")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={4}>
          <InputWithTitle
            title="Card Start"
            type="date"
            placeholder="Card Start"
            value={data.dm_start}
            onChange={(e) => onChange("dm_start")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={4}>
          <InputWithTitle
            title="Card Expiry"
            type="date"
            placeholder="Card Expiry"
            value={data.dm_expiry}
            onChange={(e) => onChange("dm_expiry")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Insurance;
