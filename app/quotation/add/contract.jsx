import React, { useState, useEffect } from "react";
import { Grid, Box, Typography } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";

const ContractSummary = ({ grandTotal, setFormData, formData }) => {
  const [dis_per, setDiscount] = useState(formData.dis_per || 0);
  const [vat_per, setVAT] = useState(formData.vat_per || 0);
  const [finalTotal, setFinalTotal] = useState(grandTotal);

  const calculateTotals = (discount, vat, total) => {
    const discountAmount = discount;
    const vatAmount = ((total - discountAmount) * vat) / 100;
    const totalWithVAT = total - discountAmount + vatAmount;

    return {
      discountAmount,
      vatAmount,
      totalWithVAT,
    };
  };

  useEffect(() => {
    if (formData.dis_per !== undefined) {
      setDiscount(formData.dis_per);
    }
    if (formData.vat_per !== undefined) {
      setVAT(formData.vat_per);
    }
  }, [formData]);

  useEffect(() => {
    const { discountAmount, vatAmount, totalWithVAT } = calculateTotals(
      dis_per,
      vat_per,
      grandTotal
    );

    setFinalTotal(totalWithVAT);

    // Update formData with only the required values
    setFormData((prev) => ({
      ...prev,
      dis_per: dis_per,
      vat_per: vat_per,
      discountAmount: discountAmount,
      vatAmount: vatAmount,
      finalTotal: totalWithVAT,
    }));
  }, [dis_per, vat_per, grandTotal]);

  const handleDiscountChange = (value) => {
    const newDiscount = parseFloat(value) || 0;
    setDiscount(newDiscount);
    setFormData((prev) => ({
      ...prev,
      dis_per: newDiscount,
    }));
  };

  const handleVATChange = (value) => {
    const newVAT = parseFloat(value) || 0;
    setVAT(newVAT);
    setFormData((prev) => ({
      ...prev,
      vat_per: newVAT,
    }));
  };

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
              onChange={handleDiscountChange}
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
              onChange={handleVATChange}
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
