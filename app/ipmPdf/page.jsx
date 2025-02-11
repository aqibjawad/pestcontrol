"use client";

import React, { useState } from "react";
import {
  Grid,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const Header = () => (
  <Grid
    container
    spacing={2}
    alignItems="center"
    sx={{ width: "100%", padding: "20px" }}
  >
    <Grid item xs={9}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Accurate Pest Control
      </Typography>
    </Grid>
    <Grid item xs={3} sx={{ textAlign: "right" }}>
      <img
        style={{ height: "60px" }}
        src="/logo.jpeg"
        alt="Accurate Pest Control Logo"
      />
    </Grid>
  </Grid>
);

const Footer = () => (
  <div
    style={{
      position: "fixed",
      bottom: "20px",
      left: 0,
      right: 0,
      textAlign: "center",
      color: "#37A730",
      fontSize: "10px",
      padding: "10px",
    }}
  >
    <div>
      Head Office: Warehouse No.1, Plot No. 247-289, Al Qusais Industrial Area 4
      – Dubai, United Arab Emirates
    </div>
    <div>
      Tel: 043756435 - 0521528725 Email: info@accuratepestcontrol.ae,
      operations@accuratepestcontrol.ae
    </div>
  </div>
);

const IpmPdf = () => {
  const reportRef = React.useRef();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const element = reportRef.current;
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [0.5, 0.5],
        filename: "inspection-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
    setLoading(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={generatePDF}
        disabled={loading}
        sx={{
          mb: 2,
          backgroundColor: "#37A730",
          "&:hover": {
            backgroundColor: "#2c8526",
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Download PDF"}
      </Button>

      <div ref={reportRef}>
        {/* Table Page (Now First) */}
        <div>
          <Header />

          <TableContainer
            component={Paper}
            sx={{ margin: "20px", marginBottom: "100px" }}
          >
            {mounted && (
              <MuiTable>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{ pageBreakInside: "avoid" }}>
                    <TableCell>
                      <img
                        src="/example1.jpeg"
                        alt="Example 1"
                        style={{ width: "100px", height: "70px" }}
                      />
                    </TableCell>
                    <TableCell>Pest Control Inspection at Site</TableCell>
                  </TableRow>

                  <TableRow style={{ pageBreakInside: "avoid" }}>
                    <TableCell>
                      <img
                        src="/example2.jpeg"
                        alt="Example 2"
                        style={{ width: "100px", height: "70px" }}
                      />
                    </TableCell>
                    <TableCell>Equipment Used for Treatment</TableCell>
                  </TableRow>

                  <TableRow style={{ pageBreakInside: "avoid" }}>
                    <TableCell>
                      <img
                        src="/example3.jpeg"
                        alt="Example 3"
                        style={{ width: "100px", height: "70px" }}
                      />
                    </TableCell>
                    <TableCell>Safety Measures Implemented</TableCell>
                  </TableRow>
                </TableBody>
              </MuiTable>
            )}
          </TableContainer>

          <Footer />
        </div>

        {/* Thank You Page */}
        <div
          style={{
            pageBreakBefore: "always",
            height: "100vh",
            position: "relative",
          }}
        >
          <Header />

          <Paper
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 200px)",
              boxShadow: "none",
            }}
          >
            <Typography variant="h4" sx={{ color: "#37A730", marginBottom: 2 }}>
              Thank You
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", maxWidth: "600px" }}
            >
              Thank you for choosing Accurate Pest Control. We appreciate your
              trust in our services. For any queries or assistance, please don't
              hesitate to contact us.
            </Typography>
            <img
              style={{ width: "150px", height: "100px", marginTop: "2rem" }}
              src="/logo.jpeg"
              alt="Logo"
            />
          </Paper>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default IpmPdf;