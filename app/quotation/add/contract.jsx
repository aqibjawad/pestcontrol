import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";

const ContractSummary = ({ grandTotal, setFormData, formData }) => {
  const [discount, setDiscount] = useState(0);
  const [vat, setVAT] = useState(0);
  const [finalTotal, setFinalTotal] = useState(grandTotal);

  useEffect(() => {
    const discountAmount = discount; // Treat discount as a fixed amount
    const vatAmount = ((grandTotal - discountAmount) * vat) / 100;
    const totalWithVAT = grandTotal - discountAmount + vatAmount;
    setFinalTotal(totalWithVAT);

    // Update formData with calculated values
    setFormData((prev) => ({
      ...prev,
      discount,
      vat,
      discountAmount,
      vatAmount,
      finalTotal: totalWithVAT,
    }));
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
              type="text"
              name="discount"
              placeholder="Enter Discount"
              value={discount}
              onChange={(value) => setDiscount(parseFloat(value) || 0)}
              inputStyle={{ width: "100px" }}
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <Typography sx={{ fontWeight: "500", width: "100px" }}>
              VAT %:
            </Typography>
            <InputWithTitle
              title=""
              type="text"
              name="vat"
              placeholder="Enter VAT"
              value={vat}
              onChange={(value) => setVAT(parseFloat(value) || 0)}
              inputStyle={{ width: "100px" }}
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
