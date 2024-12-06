import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";

const ContractSummary = ({ grandTotal, setFormData, formData }) => {
  const [dis_per, setDiscount] = useState(0);
  const [vat_per, setVAT] = useState(0);
  const [finalTotal, setFinalTotal] = useState(grandTotal);

  useEffect(() => {
    const discountPercentage = (dis_per / grandTotal) * 100;

    const discountAmount = dis_per; // This is already the amount

    const vatAmount = ((grandTotal - discountAmount) * vat_per) / 100;

    const totalWithVAT = grandTotal - discountAmount + vatAmount;
    setFinalTotal(totalWithVAT);

    setFormData((prev) => ({
      ...prev,
      dis_per: discountPercentage, 
      vat_per,
      discountAmount,
      vatAmount,
      finalTotal: totalWithVAT,
    }));
  }, [dis_per, vat_per, grandTotal]);

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
              value={dis_per}
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
              value={vat_per}
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
