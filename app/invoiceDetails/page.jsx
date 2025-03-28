"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
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
  Button,
} from "@mui/material";
import styles from "../../styles/invoiceDetails.module.css";

import { serviceInvoice, clients, sendEmail } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";

import { format } from "date-fns";
import html2pdf from "html2pdf.js";

const invoiceData = {
  companyDetails: {
    name: "Accurate Pest Control Services LLC",
    address: "Office 12, Building # Greece K-12, International City Dubai",
    email: "accuratepestcontrolcl.ae",
    phone: "+971 52 449 6173",
  },
  items: [
    {
      description: "General Pest Control",
      rate: 1080.0,
      tax: 54.0,
      total: 1134.0,
    },
  ],
};

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setQuoteList] = useState(null);
  const [rowData, setRowData] = useState([]);

  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);

  const itemableIds =
    invoiceList?.details?.map((detail) => detail.itemable_id) || [];

  const itemableDates =
    invoiceList?.details?.map((detail) => detail.created_at) || [];

  // Cloudinary Upload Function
  const uploadToCloudinary = async () => {
    try {
      setUploadingToCloudinary(true);

      const element = document.getElementById("pdf-container");
      if (!element) {
        throw new Error("PDF container element not found");
      }

      // Generate and save PDF locally first
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

      // Save PDF locally
      // await html2pdf().set(opt).from(element).save();

      // Generate PDF as blob and convert to File object
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });

      // Create FormData for proper file upload
      const data = {
        user_id: invoiceList?.user?.id,
        subject: "Invoice PDF",
        file: pdfFile, // Ensure this is a valid Blob
        html: `
      <h1>${invoiceList?.user?.name}</h1>
      <h2>Service Invoice IDs: ${itemableIds.join(", ")}</h2>
      <h2>Services Dates: ${itemableDates.join(", ")}</h2>

      <footer style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">        
        <div style="margin-top: 15px; font-size: 0.9em; color: #333;">
          <h4>Accurate Pest Control Services LLC</h4>
          <p style="margin: 5px 0;">Accurate Pest Control Services LLC</p>
          <p style="margin: 5px 0;">
            Email: accuratepestcontrolcl.ae | Phone: +971 52 449 6173
          </p>
        </div>
      </footer></a>
  `,
      };

      // Make the API call
      const response = await api.postFormDataWithToken(`${sendEmail}`, data);

      if (response.status !== "success") {
        throw new Error(`Upload failed: ${response.message}`);
      }

      alert("Invoice has been downloaded and sent via email successfully!");
      return response;
    } catch (error) {
      console.error("Error in uploadToCloudinary:", error);
      alert("Failed to send invoice. Please try again.");
      throw error;
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllQuotes(id);
    }
  }, [id]);

  const getAllQuotes = async () => {
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

  useEffect(() => {
    if (invoiceList?.user?.id) {
      fetchData(invoiceList.user.id);
    }
  }, [invoiceList]);

  const fetchData = async (userId) => {
    setLoadingDetails(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/ledger/get/${userId}`
      );
      const data = response.data?.slice(-5) || []; // Ensure data is an array
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

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

  const formatAmountDisplay = (amount) => {
    if (amount === undefined || amount === null) return "";
    const numAmount = parseFloat(amount);
    const amountInWords = numberToWords(numAmount);
    return `Total Amount AED ${numAmount.toFixed(2)} (${amountInWords} Only)`;
  };

  const getNextMonthDate = (issuedDate) => {
    // Check if date is valid
    if (!issuedDate) return null;

    // Convert string to Date object
    const date = new Date(issuedDate);

    // Get the next month
    date.setMonth(date.getMonth() + 1);

    // Format date to YYYY-MM-DD
    const nextDate = date.toISOString().split("T")[0];

    return nextDate;
  };

  const commonStyles = {
    width: "100%",
    maxWidth: "600px", // Set a max-width to keep consistency
    margin: "0 auto", // Center the components
  };

  const headerStyles = {
    backgroundColor: "lightgreen",
    padding: "8px",
    lineHeight: "1rem",
    marginBottom: "1rem",
    borderRadius: "4px",
  };

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

  return (
    <>
      <div id="pdf-container">
        <Layout>
          <Grid className="p-2" container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {invoiceData.companyDetails.name}
              </Typography>
              <Typography variant="body2">
                Warehouse No 1 Plot No 247-289, Al Qusais Industrial Area 4 ,
                Dubai - UAE
              </Typography>
              <Typography variant="body2">
                info@accuratepestcontrol.ae
              </Typography>

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
              <div>
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
                  TRN: 1041368802200003
                </Typography>
              </div>

              <div style={{ ...commonStyles, ...headerStyles }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div
                      style={{
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                      }}
                    >
                      Tax Invoice
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div
                      style={{
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                      }}
                    >
                      {invoiceList?.service_invoice_id}
                    </div>
                  </Grid>
                </Grid>
              </div>

              <table striped bordered hover className="mb-0">
                <thead
                  style={{ backgroundColor: "lightgreen", marginTop: "-1rem" }}
                  className="table-success"
                >
                  <tr>
                    <th
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-center fw-bold"
                    >
                      Date
                    </th>
                    <th
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-center fw-bold"
                    >
                      Due Date
                    </th>
                    <th
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-center fw-bold"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-end"
                    >
                      {invoiceList?.issued_date}
                    </td>
                    <td
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-end"
                    >
                      {getNextMonthDate(invoiceList?.issued_date)}
                    </td>
                    <td
                      style={{
                        color: "black",
                        marginTop: "-10px",
                        paddingTop: "0px",
                        paddingBottom: "15px",
                        fontWeight: "bold",
                      }}
                      className="text-end"
                    >
                      {invoiceList?.total_amt}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{ textAlign: "right" }}
                className={styles.totalAmount}
              >
                APCS{invoiceList?.user?.client?.referencable_id}PT
                {invoiceList?.invoiceable?.billing_method === "monthly"
                  ? 1
                  : invoiceList?.invoiceable?.billing_method === "monthly"
                  ? 2
                  : invoiceList?.invoiceable?.billing_method === "service"
                  ? 3
                  : "unknown"}
              </div>

              <div
                style={{ textAlign: "right" }}
                className={styles.totalAmount}
              >
                Invoice Id:
                {invoiceList?.job?.id || "No Invoice"}
              </div>
            </Grid>
          </Grid>

          <Grid className="p-2" container spacing={2}>
            <Grid className="mt-1" item xs={5}>
              <TableContainer component={Paper} sx={{ marginTop: 0 }}>
                <Table>
                  <TableHead
                    style={{
                      backgroundColor: "#32A92E",
                      color: "white",
                    }}
                  >
                    <TableRow
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "white",
                          // padding: "10px 16px",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                      >
                        Description
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="right"
                      >
                        VAT
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="right"
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                      >
                        {" "}
                        General Pest Control{" "}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="right"
                      >
                        {invoiceList?.invoiceable?.vat_per}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="right"
                      >
                        {invoiceList?.total_amt}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid className="mt-1" item xs={7}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead
                    style={{ backgroundColor: "#32A92E", color: "white" }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="center"
                      >
                        Sr No
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="center"
                      >
                        Job Id
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="center"
                      >
                        Expected Date
                      </TableCell>

                      <TableCell
                        sx={{
                          color: "white",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="center"
                      >
                        Job Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceList?.jobs?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            color: "black",
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                          }}
                          align="left"
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "black",
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                          }}
                          align="left"
                        >
                          {row?.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "black",
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                          }}
                          align="left"
                        >
                          {row?.job_date}
                        </TableCell>

                        <TableCell
                          sx={{
                            color: "black",
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                          }}
                          align="left"
                        >
                          {row?.job_end_time || "no Date"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid className="p-2" container spacing={2}>
            <Grid item xs={10}>
              <div>
                <div className={styles.totalAmount}>
                  (
                  {invoiceList?.total_amt &&
                    formatAmountDisplay(invoiceList.total_amt)}
                  )
                </div>

                <div className={styles.descrp}>
                  Payment will be paid after receiving of invoice within 30 days
                  period.
                </div>

                <div className={styles.totalAmount}>Bank Details:</div>

                <div className={styles.Bankdescrp}>
                  Account Holder : ACCURATE PEST CONTROL SERVICES L.L.C IBAN:
                  AE980400000883216722001
                </div>

                <div className={styles.Bankdescrp}>
                  Account: 0883216722001 Bank Name : RAK BANK
                </div>

                <div className={styles.Bankdescrp}>
                  Branch: DRAGON MART, DUBAI
                </div>
              </div>
            </Grid>
          </Grid>

          <div className="mt-2">
            {/* <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Ledger
            </Typography> */}
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
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
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
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                          fontSize:"10px"
                        }}
                        align="left"
                      >
                        {format(new Date(row.updated_at), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="left"
                      >
                        {row.description}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="left"
                      >
                        {row.cr_amt}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="left"
                      >
                        {row.dr_amt}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          marginTop: "-10px",
                          paddingTop: "0px",
                          paddingBottom: "15px",
                        }}
                        align="right"
                      >
                        {row.cash_balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Grid className="p-2" container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {invoiceList?.user?.client?.firm_name}
              </Typography>
            </Grid>

            <Grid className="p-2" item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Accurate Pest Control Services LLC
              </Typography>
            </Grid>
          </Grid>

          <Grid className="p-2" container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                _________________________
              </Typography>

              {/* <Typography variant="body2">Signature</Typography>
              <Typography variant="body2">Date :</Typography> */}

              {/* <Typography className="" variant="body2">
                {invoiceList?.user?.name}
              </Typography> */}
              {/* <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Manager
              </Typography> */}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                _________________________
              </Typography>

              {/* <Typography variant="body2">Signature</Typography>
              <Typography variant="body2">Date :</Typography> */}
            </Grid>
          </Grid>
        </Layout>
      </div>

      <div className="text-center mt-3">
        <Button
          variant="contained"
          color="primary"
          onClick={uploadToCloudinary}
          disabled={uploadingToCloudinary}
        >
          {uploadingToCloudinary ? "Generating PDF..." : "Generate PDF"}
        </Button>
      </div>
    </>
  );
};

export default Page;
