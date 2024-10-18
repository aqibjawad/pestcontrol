import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import InputWithTitle2 from "@/components/generic/InputWithTitle2";
import "./index.css";
import Dropdown from "../../../components/generic/Dropdown";

const Insurance = ({ data, onChange }) => {
  const [unemployed, setUnEmployed] = useState(true);
  const [healthInsured, setHealthIsured] = useState(true);

  const handleUnEmpoyedState = (value, index) => {
    if (index === 0) {
      setUnEmployed(true);
    } else {
      setUnEmployed(false);
    }
    onChange("ui_status", value);
  };

  const handleHealthIsuredState = (value, index) => {
    if (index === 0) {
      setHealthIsured(true);
    } else {
      setHealthIsured(false);
    }
    onChange("hi_status", value);
  };
  return (
    <div>
      {/* Health Insurance Section */}
      <Typography variant="h6" gutterBottom className="health-head">
        Health Insurance
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1000px" }}>
        <Grid item xs={12}>
          <Dropdown
            options={["Active", "Inactive"]}
            title={"Health Insurance Status"}
            onChange={handleHealthIsuredState}
          />
        </Grid>
        {healthInsured ? (
          <>
            <Grid item xs={12} md={6}>
              <InputWithTitle2
                title="Insurance Start"
                type="date"
                placeholder="Insurance Start"
                value={data.hi_start}
                onChange={(name, value) => onChange("hi_start", value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputWithTitle2
                title="Insurance Expiry"
                type="date"
                placeholder="Insurance Expiry"
                value={data.hi_expiry}
                onChange={(name, value) => onChange("hi_expiry", value)}
              />
            </Grid>
          </>
        ) : (
          <></>
        )}
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
          <Dropdown
            options={["Active", "Inactive"]}
            title={"Unemployment Insurance Status"}
            onChange={handleUnEmpoyedState}
          />
        </Grid>
        {unemployed ? (
          <>
            <Grid item xs={12} md={6}>
              <InputWithTitle2
                title="Insurance Start"
                type="date"
                placeholder="Insurance Start"
                value={data.ui_start}
                onChange={(name, value) => onChange("ui_start", value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputWithTitle2
                title="Insurance Expiry"
                type="date"
                placeholder="Insurance Expiry"
                value={data.ui_expiry}
                onChange={(name, value) => onChange("ui_expiry", value)}
              />
            </Grid>
          </>
        ) : (
          <></>
        )}

        <Grid item xs={12}>
          <InputWithTitle2
            title="DM Card"
            type="text"
            placeholder="DM Card"
            value={data.dm_card}
            onChange={(name, value) => onChange("dm_card", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={4}>
          <InputWithTitle2
            title="Card Start"
            type="date"
            placeholder="Card Start"
            value={data.dm_start}
            onChange={(name, value) => onChange("dm_start", value)}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={4}>
          <InputWithTitle2
            title="Card Expiry"
            type="date"
            placeholder="Card Expiry"
            value={data.dm_expiry}
            onChange={(name, value) => onChange("dm_expiry", value)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Insurance;
