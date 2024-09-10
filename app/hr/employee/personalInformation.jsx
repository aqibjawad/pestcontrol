import React from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";

import "./index.css";

import { Grid, Typography } from '@mui/material'

const PersonalInformation = ({ data, onChange }) => {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Name"
            type="text"
            placeholder="Name"
            value={data.name}
            onChange={(e) => onChange("name")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Phone Number"
            type="text"
            placeholder="Phone Number"
            value={data.phone_number}
            onChange={(e) => onChange("phone_number")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Email"
            type="text"
            placeholder="Email"
            value={data.email}
            onChange={(e) => onChange("email")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="EID Number"
            type="text"
            placeholder="EID Number"
            value={data.eid_no}
            onChange={(e) => onChange("eid_no")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Target"
            type="text"
            placeholder="Target"
            value={data.target}
            onChange={(e) => onChange("target")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="EID Start"
            type="date"
            placeholder="EID Start"
            value={data.eid_start}
            onChange={(e) => onChange("eid_start")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="EID Expiry"
            type="date"
            placeholder="EID Expiry"
            value={data.eid_expiry}
            onChange={(e) => onChange("eid_expiry")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Profession"
            type="text"
            placeholder="Profession"
            value={data.profession}
            onChange={(e) => onChange("profession")}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom className="passport-head">
        Passport Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Passport Number"
            type="text"
            placeholder="Passport Number"
            value={data.passport_no}
            onChange={(e) => onChange("passport_no")}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6}>
          <InputWithTitle
            title="Passport Start"
            type="text"
            placeholder="Passport Start"
            value={data.passport_start}
            onChange={(e) => onChange("passport_start")}
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithTitle
            title="Passport End"
            type="text"
            placeholder="Passport End"
            value={data.passport_expiry}
            onChange={(e) => onChange("passport_expiry")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalInformation;