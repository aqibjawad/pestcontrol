"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "../../components/layout";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const html2pdf = dynamic(() => import("html2pdf.js"), {
  ssr: false,
});

import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";

import styles from "../../styles/invoiceDetails.module.css";
import { serviceInvoice, clients, sendEmail } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceDetails />
    </Suspense>
  );
};

const InvoiceDetails = () => {
  const searchParams = useSearchParams();
  const api = new APICall();

  // Extract ID from search params
  const id = searchParams.get("id");

  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const itemableIds =
    invoiceList?.details?.map((detail) => detail.itemable_id) || [];
  const itemableDates =
    invoiceList?.details?.map((detail) => detail.created_at) || [];

  // Number to Words Conversion
  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );

      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    if (num === 0) return "Zero";

    const decimalParts = num.toString().split(".");
    const wholePart = parseInt(decimalParts[0]);
    const decimal = decimalParts[1] ? parseInt(decimalParts[1]) : 0;

    let result = convertLessThanThousand(wholePart);

    if (wholePart > 999) {
      const thousands = Math.floor(wholePart / 1000);
      result =
        convertLessThanThousand(thousands) +
        " Thousand " +
        convertLessThanThousand(wholePart % 1000);
    }

    if (decimal > 0) {
      result += " Point " + convertLessThanThousand(decimal);
    }

    return result;
  };

  // Format Amount Display
  const formatAmountDisplay = (amount) => {
    if (amount === undefined || amount === null) return "";
    const numAmount = parseFloat(amount);
    const amountInWords = numberToWords(numAmount);
    return `Total Amount AED ${numAmount.toFixed(2)} (${amountInWords} Only)`;
  };

  // Get Next Month Date
  const getNextMonthDate = (issuedDate) => {
    if (!issuedDate) return null;
    const date = new Date(issuedDate);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  // Cloudinary Upload Function
  const uploadToCloudinary = async () => {
    if (pdfGenerated || uploadingToCloudinary || !invoiceList?.user?.id) return;

    try {
      setUploadingToCloudinary(true);

      const element = document.getElementById("pdf-container");
      if (!element) {
        throw new Error("PDF container element not found");
      }

      const filename = `invoice_${Date.now()}.pdf`;
      const opt = {
        margin: 1,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      };

      // Generate the PDF using the correct method chain for html2pdf.js
      const html2pdfInstance = await import("html2pdf.js");
      const html2pdf = html2pdfInstance.default || html2pdfInstance;

      // Generate PDF directly as blob for the email without saving locally
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });

      if (!invoiceList?.user?.id) {
        throw new Error("User ID is missing");
      }

      // Continue with your original API call logic
      const data = {
        user_id: invoiceList.user.id,
        subject: "Invoice PDF",
        file: pdfFile,
        html: `
         <h1>${invoiceList?.user?.client?.firm_name || "Client"}</h1>
          <h2>Service Invoice IDs: ${itemableIds.join(", ") || "N/A"}</h2>
          <h2>Services Dates: ${itemableDates.join(", ") || "N/A"}</h2>
          <a href="" > View Service Report </a>
          <footer style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                  <div style="margin-top: 15px; font-size: 0.9em; color: #333;">
                    <h4>Accurate Pest Control Services LLC</h4>
                    <p style="margin: 5px 0;">Accurate Pest Control Services LLC</p>
                    <p style="margin: 5px 0;">
                      Email: accuratepestcontrolcl.ae | Phone: +971 52 449 6173
                    </p>
                  </div>
          </footer>
          `,
      };

      const response = await api.postFormDataWithToken(sendEmail, data);

      if (response.status !== "success") {
        throw new Error(
          `Upload failed: ${response.message || "Unknown error"}`
        );
      }

      alert("Invoice has been downloaded and sent via email successfully!");
      setPdfGenerated(true);
      return response;
    } catch (error) {
      console.error("Error in uploadToCloudinary:", error);
      alert(`Failed to send invoice: ${error.message}`);
      throw error;
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  // Fetch Invoice Details
  const getAllQuotes = async () => {
    if (!id) return;

    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}/${id}`);
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  // Fetch User Data
  const fetchData = async (userId) => {
    setLoadingDetails(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/ledger/get/${userId}`
      );
      const data = response.data?.slice(-5) || [];
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch data when ID changes
  useEffect(() => {
    if (id) {
      getAllQuotes();
    }
  }, [id]);

  // Fetch user data when invoice list is available
  useEffect(() => {
    if (invoiceList?.user?.id) {
      fetchData(invoiceList.user.id);
    }
  }, [invoiceList]);

  // Auto-trigger PDF generation when page is fully loaded
  useEffect(() => {
    if (!loadingDetails && invoiceList && rowData.length > 0 && !pdfGenerated) {
      // Small delay to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        uploadToCloudinary();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loadingDetails, invoiceList, rowData, pdfGenerated]);

  // Render loading state
  if (loadingDetails) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  // Common styles
  const commonStyles = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const headerStyles = {
    backgroundColor: "lightgreen",
    padding: "8px",
    lineHeight: "1rem",
    marginBottom: "1rem",
    borderRadius: "4px",
  };

  return (
    <>
      <div id="pdf-container">
        <Layout>
          <Grid className="p-2" container spacing={2}>
            {/* Left Side Company Details */}
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Accurate Pest Control Services LLC
              </Typography>
              <Typography variant="body2">
                Warehouse No 1 Plot No 247-289, Al Qusais Industrial Area 4,
                Dubai - UAE
              </Typography>
              <Typography variant="body2">
                info@accuratepestcontrol.ae
              </Typography>
              <Typography variant="body2">TRN: 1041368802200003</Typography>

              {/* Bill To Section */}
              <div className="mt-5">
                <Typography className="" variant="body2">
                  Bill To
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {invoiceList?.user?.client?.firm_name}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  TRN: {invoiceList?.invoiceable?.trn}
                </Typography>
              </div>

              {/* Contact Person Section */}
              <div className="mt-5">
                <Typography className="" variant="body2">
                  Contact Person
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Manager
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {invoiceList?.user?.client?.mobile_number}
                </Typography>
              </div>
            </Grid>

            {/* Right Side Invoice Details */}
            <Grid item xs={6}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  textAlign: "right",
                  marginTop: "-10px",
                  paddingTop: "0px",
                  paddingBottom: "15px",
                }}
              >
                Tax Invoice
              </Typography>

              <div style={{ ...commonStyles, ...headerStyles }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    Tax Invoice
                  </Grid>
                  <Grid item xs={6}>
                    {invoiceList?.service_invoice_id}
                  </Grid>
                </Grid>
              </div>

              {/* Invoice Date and Details Table */}
              <table striped bordered hover className="mb-0">
                <thead style={{ backgroundColor: "lightgreen" }}>
                  <tr>
                    {["Date", "Due Date", "Total"].map((header) => (
                      <th
                        key={header}
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{invoiceList?.issued_date}</td>
                    <td>{getNextMonthDate(invoiceList?.issued_date)}</td>
                    <td>{invoiceList?.total_amt}</td>
                  </tr>
                </tbody>
              </table>

              {/* Additional Invoice Reference */}
              <div
                style={{ textAlign: "right" }}
                className={styles.totalAmount}
              >
                APCS{invoiceList?.user?.client?.referencable_id}PT
                {invoiceList?.invoiceable?.billing_method === "monthly"
                  ? 1
                  : invoiceList?.invoiceable?.billing_method === "service"
                  ? 3
                  : "unknown"}
              </div>
            </Grid>
          </Grid>

          {/* Invoice Items Table */}
          <Grid className="p-2" container spacing={2}>
            <Grid className="mt-1" item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead
                    style={{ backgroundColor: "#32A92E", color: "white" }}
                  >
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Description</TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        VAT
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>General Pest Control</TableCell>
                      <TableCell align="right">
                        {invoiceList?.invoiceable?.vat_per}
                      </TableCell>
                      <TableCell align="right">
                        {invoiceList?.total_amt}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Additional Invoice Details */}
          <Grid className="p-2" container spacing={2}>
            <Grid item xs={10}>
              <div>
                <div className={styles.totalAmount}>
                  {invoiceList?.total_amt &&
                    formatAmountDisplay(invoiceList.total_amt)}
                </div>

                <div className={styles.descrp}>
                  Payment will be paid after receiving of invoice within 30 days
                  period.
                </div>

                <div className={styles.totalAmount}>Bank Details:</div>

                <div className={styles.Bankdescrp}>
                  Account Holder: ACCURATE PEST CONTROL SERVICES L.L.C IBAN:
                  AE980400000883216722001
                </div>

                <div className={styles.Bankdescrp}>
                  Account: 0883216722001 Bank Name: RAK BANK
                </div>

                <div className={styles.Bankdescrp}>
                  Branch: DRAGON MART, DUBAI
                </div>
              </div>
            </Grid>
          </Grid>

          {/* Ledger Table */}
          <div className="mt-2">
            <TableContainer component={Paper}>
              <Table>
                <TableHead
                  style={{ backgroundColor: "#32A92E", color: "white" }}
                >
                  <TableRow>
                    {["Date", "Description", "Credit", "Debit", "Balance"].map(
                      (header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: "white",
                            textAlign:
                              header === "Balance" ? "right" : "center",
                          }}
                        >
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(new Date(row.updated_at), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.cr_amt}</TableCell>
                      <TableCell>{row.dr_amt}</TableCell>
                      <TableCell align="right">{row.cash_balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Signature Section */}
          <Grid className="p-2 mt-2" container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {invoiceList?.user?.client?.firm_name}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                _________________________
              </Typography>
            </Grid>
          </Grid>
        </Layout>
      </div>
    </>
  );
};

export default Page;
