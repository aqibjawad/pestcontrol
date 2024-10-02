import React from "react";
import { Grid, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const Treatment = ({ quote }) => {
  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    "&.Mui-checked": {
      color: "#38A73B",
    },
  }));

  const rows = quote?.treatment_methods || [];

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        padding: "16px",
      }}
    >
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        Treatment Methods
      </Typography>
      <Grid container spacing={2}>
        {rows.map((row, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FormControlLabel
              disabled
              checked
              control={<CustomCheckbox />}
              label={<Typography variant="body1">{row?.name}</Typography>}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Treatment;
