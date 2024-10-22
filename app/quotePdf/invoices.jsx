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
      <div className={`${styles.clientHead}`} style={{ textAlign: "left" }}>
        {" "}
        Invoice{" "}
      </div>

      <Grid container spacing={3}>
        {/* Conditionally render Billing frequency if it is not 0 */}
        {quote.no_of_installments !== 0 && (
          // <Grid item lg={6} xs={12} sm={6} md={4}>
          //   <div className={styles.billingHead}>Billing frequency</div>
          //   <div className={styles.biilingData}>
          //     {" "}
          //     {quote.no_of_installments}{" "}
          //   </div>
          // </Grid>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            {/* Use flexbox to align Billing Method and Checkbox in a row */}
            <div style={{ display: "flex", alignItems: "left" }}>
              <div
                className={styles.billingHead}
                style={{ marginRight: "10px" }}
              >
                Billing Frequency
              </div>
              <FormControlLabel
                disabled
                checked
                control={<CustomCheckbox />}
                label={
                  <Typography variant="body1">
                    {quote?.no_of_installments}
                  </Typography>
                }
              />
            </div>
          </Grid>
        )}

        <Grid item lg={6} xs={12} sm={6} md={4}>
          {/* Use flexbox to align Billing Method and Checkbox in a row */}
          <div style={{ display: "flex", alignItems: "left" }}>
            <div className={styles.billingHead} style={{ marginRight: "10px" }}>
              Billing Method
            </div>
            <FormControlLabel
              disabled
              checked
              control={<CustomCheckbox />}
              label={
                <Typography variant="body1">{quote?.billing_method}</Typography>
              }
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Invoice;
