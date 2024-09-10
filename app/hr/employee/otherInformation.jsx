import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import "./index.css";

const OtherInfo = ({ data, onChange }) => {
  return (
    <div>
      {/* Emergency Contact Section */}
      <Typography variant="h6" gutterBottom className="health-head">
        Emergency Contact
      </Typography>

      <Grid container spacing={3} style={{ maxWidth: "1200px" }}>
        <Grid item xs={12} md={4}>
          <InputWithTitle
            title="Name and Contact"
            type="text"
            placeholder="Name and Contact"
            value={data.relative_name}
            onChange={(e) => onChange("relative_name")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithTitle
            title="Relation"
            type="text"
            placeholder="Relation"
            value={data.relation}
            onChange={(e) => onChange("relation")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InputWithTitle
            title="Emergency Contact (Home Country)"
            type="text"
            placeholder="Emergency Contact (Home Country)"
            value={data.emergency_contact}
            onChange={(e) => onChange("emergency_contact")}
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
          <InputWithTitle
            title="Basic Salary"
            type="text"
            placeholder="Basic Salary"
            value={data.basic_salary}
            onChange={(e) => onChange("basic_salary")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Allowance"
            type="text"
            placeholder="Allowance"
            value={data.allowance}
            onChange={(e) => onChange("allowance")}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        style={{ maxWidth: "1200px", marginTop: "1rem" }}
      >
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Other"
            type="text"
            placeholder="Other"
            value={data.other}
            onChange={(e) => onChange("other")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithTitle
            title="Total Salary"
            type="text"
            placeholder="Total Salary"
            value={data.total_salary}
            onChange={(e) => onChange("total_salary")}
          />
        </Grid>
      </Grid>

      {/* Save Button */}
      <div className="info-button" style={{ marginTop: "2rem" }}>
        Save Information
      </div>
    </div>
  );
};

export default OtherInfo;
