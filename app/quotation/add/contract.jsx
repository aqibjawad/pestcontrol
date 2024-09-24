import React from "react";
import { Grid, Box, Typography } from "@mui/material";

import "../index.css";
import styles from "../../../styles/quotes.module.css";

const ContractSummary = () => {
  return (
    <Box
      sx={{
        border: "1px solid black",
        marginTop: "1rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: "34px",
          fontWeight: "600",
          fontSize: "20px",
        }}
      >
        Contract Summary
      </Typography>

      <Grid container spacing={2} sx={{ paddingLeft: "34px", paddingBottom: "34px"  }}>
        <Grid item lg={6} xs={6}>
          <Box className={styles.subTotal}>Subtotal</Box>
          <Box className="discount">Discount:</Box>
          <Box className="discount">VAT</Box>
          <Box className="discount">Grand Total</Box>
        </Grid>

        <Grid item lg={6} xs={6}>
          <Box className="sub-total">Subtotal</Box>
          <Box>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Box className="discount-button flex flex-col">0</Box>
              </Grid>
              <Grid item>
                <Box className="discount-perc flex flex-col">%</Box>
              </Grid>
            </Grid>
          </Box>
          <Box className="vat">VAT</Box>
          <Box className="total">Grand Total</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractSummary;
