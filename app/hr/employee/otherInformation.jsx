import React from "react";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import InputWithTitle2 from "@/components/generic/InputWithTitle2";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import "./index.css";
import GreenButton from "@/components/generic/GreenButton";

const OtherInfo = ({ data, onChange, handleSubmit, sendingData }) => {
  return (
    <div>
      {/* Emergency Contact Section */}
      <Typography variant="h6" gutterBottom className="health-head">
        Emergency Contact
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
        <Grid item xs={12} md={4}>
          <InputWithTitle2
            title="Relative Name"
            type="text"
            placeholder="Name of Relative"
            value={data.relative_name}
            onChange={(name, value) => onChange("relative_name", value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithTitle2
            title="Relation"
            type="text"
            placeholder="Relation"
            value={data.relation}
            onChange={(name, value) => onChange("relation", value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithTitle2
            title="Emergency Contact (Home Country)"
            type="text"
            placeholder="Emergency Contact (Home Country)"
            value={data.emergency_contact}
            onChange={(name, value) => onChange("emergency_contact", value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithTitle2
            title="Home Country"
            type="text"
            placeholder="Home Country"
            value={data.emergency_contact}
            onChange={(name, value) => onChange("emergency_contact", value)}
          />
        </Grid>
      </Grid>

      {/* Financial Condition Section */}
      <Typography
        variant="h6"
        gutterBottom
        className="health-head"
        style={{ marginTop: "2rem" }}
      >
        Financial Condition
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
        <Grid item xs={12} md={6}>
          <InputWithTitle2
            title="Basic Salary"
            type="text"
            placeholder="Basic Salary"
            value={data.basic_salary}
            onChange={(name, value) => onChange("basic_salary", value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle2
            title="Allowance"
            type="text"
            placeholder="Allowance"
            value={data.allowance}
            onChange={(name, value) => onChange("allowance", value)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        style={{ maxWidth: "1200px", marginTop: "1rem" }}
      >
        <Grid item xs={12} md={6}>
          <InputWithTitle2
            title="Other"
            type="text"
            placeholder="Other"
            value={data.other}
            onChange={(name, value) => onChange("other", value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle2
            title="Total Salary"
            type="text"
            placeholder="Total Salary"
            value={data.total_salary}
            onChange={(name, value) => onChange("total_salary", value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputWithTitle2
            title="Comission %"
            type="text"
            placeholder="Comission"
            value={data.commission_per}
            onChange={(name, value) => onChange("commission_per", value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputWithTitle3
            title="Labour Card Expiry"
            type="date"
            placeholder="Comission"
            value={data.labour_card_expiry}
            onChange={(name, value) => onChange("labour_card_expiry", value)}
          />
        </Grid>
      </Grid>

      <div className="mb-10"></div>
      <GreenButton
        onClick={() => handleSubmit()}
        title={
          sendingData ? <CircularProgress color="inherit" size={20} /> : "Save"
        }
      />
    </div>
  );
};

export default OtherInfo;
