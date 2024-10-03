import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";

const ContractSummary = ({ grandTotal, setFormData }) => {
  const [discount, setDiscount] = useState(0); // Discount in percentage
  const [vat, setVAT] = useState(0); // VAT in percentage
  const [finalTotal, setFinalTotal] = useState(grandTotal); // Final grand total after discount and VAT

  // Calculate the final total whenever the discount, VAT, or grandTotal changes
  useEffect(() => {
    const discountAmount = (grandTotal * discount) / 100;
    const vatAmount = ((grandTotal - discountAmount) * vat) / 100;
    const totalWithVAT = grandTotal - discountAmount + vatAmount;
    setFinalTotal(totalWithVAT);
  }, [discount, vat, grandTotal]);

  return (
    <Box
      sx={{
        marginTop: "1rem",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "600",
          fontSize: "20px",
          marginBottom: "1rem",
        }}
      >
        Contract Summary
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side (Labels) */}
        <Grid item lg={6} xs={12}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <Typography sx={{ fontWeight: "500", width: "100px" }}>
              Subtotal:
            </Typography>
            <Typography>{grandTotal}</Typography>
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <Typography sx={{ fontWeight: "500", width: "100px" }}>
              Discount:
            </Typography>
            <InputWithTitle
              title=""
              type="number"
              name="discount"
              placeholder="Enter Discount"
              value={discount}
              onChange={(value) => setDiscount(parseFloat(value) || 0)}
              inputStyle={{ width: "100px" }} // Add a custom width for input
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <Typography sx={{ fontWeight: "500", width: "100px" }}>
              VAT:
            </Typography>
            <InputWithTitle
              title=""
              type="number"
              name="vat"
              placeholder="Enter VAT"
              value={vat}
              onChange={(value) => setVAT(parseFloat(value) || 0)}
              inputStyle={{ width: "100px" }} // Add a custom width for input
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "2rem" }}
          >
            <Typography sx={{ fontWeight: "500", width: "100px" }}>
              Grand Total:
            </Typography>
            <Typography>{finalTotal}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractSummary;
