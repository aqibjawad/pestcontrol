import React from "react";
import styles from "../../styles/viewQuote.module.css";

import { Grid, Checkbox, FormControlLabel, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";

const Invoice = ({ quote }) => {
  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    "&.Mui-checked": {
      color: "#38A73B", // Custom color when checked
    },
  }));

  return (
    <div className={styles.billingRecord}>
      <div className={styles.clientHead}> Invoice </div>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <div className={styles.billingHead}>Billing frequency</div>

          <div className={styles.biilingData}>Billing Frequency</div>
        </Grid>

        <Grid className="" item lg={6} xs={12} sm={6} md={4}>
          <div className={styles.billingHead}>Biling Method</div>
          <FormControlLabel
            className="mt-10"
            disabled
            checked
            control={<CustomCheckbox />}
            label={<Typography variant="body1"> {quote?.billing_method} </Typography>}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Invoice;
