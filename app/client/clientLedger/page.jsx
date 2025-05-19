"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/ledger.module.css";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";

import Link from "next/link";

import { clients, sendEmail } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

const getParamsFromUrl = (url) => {
  const parts = url.split("?");
  const params = {};
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    }
  }
  return params;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [number, setNumber] = useState("");
  const [referenceName, setReferenceName] = useState("");

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [contractsData, setContractsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const router = useRouter();
  const tableRef = useRef(null);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    const urlParams = getParamsFromUrl(currentUrl);

    setId(urlParams.id);
    setSupplierName(urlParams.name || "");
    setPhoneNumber(urlParams.phone_number || "");
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    setLoading(true);
    setContractsLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${clients}/ledger/get/${id}`
      );

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setRowData(response.data);

        // Set reference name if available in the first item
        if (
          response.data.length > 0 &&
          response.data[0].personable?.client?.referencable?.name
        ) {
          setReferenceName(
            response.data[0].personable.client.referencable.name
          );
        }

        // Set company name if available
        if (
          response.data.length > 0 &&
          response.data[0].personable?.client?.firm_name
        ) {
          setCompanyName(response.data[0].personable.client.firm_name);
        }
      } else {
        setRowData([]);
      }

      // Set the contracts data separately if it exists
      if (response.contracts && Array.isArray(response.contracts)) {
        setContractsData(response.contracts);
      } else {
        setContractsData([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setContractsLoading(false);
    }
  };

  const handleViewDetails = (row) => {
    setModalData(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // PDF Generation function
  const generatePDFFile = () => {
    // Check if row data exists
    if (!rowData || rowData.length === 0) {
      console.warn("No data available to export");
      return null;
    }

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set up document properties
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Ledger Report", 105, 15, { align: "center" });

    // Add supplier/client information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Client Name: ${supplierName || "N/A"}`, 14, 25);
    doc.text(`Phone: ${phoneNumber || "N/A"}`, 14, 35);
    doc.text(`Date: ${format(new Date(), "dd/MM/yyyy")}`, 14, 45);

    // Calculate totals
    const totalCredit = rowData
      .reduce((acc, row) => acc + parseFloat(row.cr_amt || 0), 0)
      .toFixed(2);

    const totalDebit = rowData
      .reduce((acc, row) => acc + parseFloat(row.dr_amt || 0), 0)
      .toFixed(2);

    // Get the final balance (last entry's cash balance)
    const finalBalance =
      rowData.length > 0
        ? parseFloat(rowData[rowData.length - 1].cash_balance || 0).toFixed(2)
        : "0.00";

    // Prepare the data for the table
    const tableRows = rowData.map((row) => [
      format(new Date(row.updated_at), "yyyy-MM-dd"),
      row.description || "N/A",
      row.cr_amt ? parseFloat(row.cr_amt).toFixed(2) : "0.00",
      row.dr_amt ? parseFloat(row.dr_amt).toFixed(2) : "0.00",
      row.cash_balance ? parseFloat(row.cash_balance).toFixed(2) : "0.00",
    ]);

    // Add the table
    doc.autoTable({
      head: [["Date", "Description", "Credit", "Debit", "Balance"]],
      body: tableRows,
      startY: 55,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [50, 169, 46],
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
      },
      didDrawPage: function (data) {
        // Add total row after the table
        const finalY = data.cursor.y + 10;
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(
          `Total Credit: ₹${totalCredit}    Total Debit: ₹${totalDebit}`,
          14,
          finalY
        );
        doc.text(`Final Balance: ₹${finalBalance}`, 14, finalY + 10);
      },
    });

    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    // Filename with client name
    const filename = `${
      supplierName ? supplierName.replace(/\s+/g, "_") : "client"
    }_.pdf`;

    // Create a File object with PDF extension
    const pdfBlob = doc.output("blob");
    return new File([pdfBlob], filename, { type: "application/pdf" });
  };

  const uploadToCloudinary = async () => {
    try {
      setPdfLoading(true);
      const file = generatePDFFile();
      if (!file) {
        setPdfLoading(false);
        return;
      }

      const data = {
        user_id: "83",
        subject: "Client Ledger",
        file: file,
        html: "<h1>Client PDF</h1>",
      };

      const response = await api.postFormDataWithToken(`${sendEmail}`, data);

      const testData = await response.json();
      console.log("Upload success:", testData);
      setPdfUrl(testData.secure_url);
      return testData.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle PDF generation and upload
  const handleGeneratePDF = () => {
    uploadToCloudinary();
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return "N/A";
    }
  };

  // Function to determine which link to show based on row description
  const getInvoiceLink = (row) => {
    // Check if the description contains "Job Completed"
    if (row.description && row.description.includes("Job Completed")) {
      // Regular invoice link - same as original
      return `/invoiceDetailsPdf/?id=${row?.personable?.id}`;
    } else {
      // Receipt PDF link - for service_invoice_amt_history
      return row.service_invoice_amt_history?.receipt_pdf || `/paymentInvoice/?id=${row.id}&userId=${id}`;
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{supplierName}</div>
        <div>
          <div className="flex items-center gap-4">
            <Button
              className={styles.hideOnPrint}
              variant="contained"
              color="primary"
              onClick={handleGeneratePDF}
              disabled={pdfLoading}
              startIcon={
                pdfLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {pdfLoading ? "Sending..." : "Send Email PDF"}
            </Button>

            <Button
              className={styles.hideOnPrint}
              variant="contained"
              color="primary"
              onClick={handlePrint}
            >
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.leftSection1}>
        {referenceName && (
          <div>
            <strong>Reference:</strong> {referenceName}
          </div>
        )}
      </div>
      <div className={styles.leftSection1}>{phoneNumber}</div>

      {/* Contracts Table */}
      <h2 className="text-xl font-bold my-4">Contract Summary</h2>
      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Canceled Amount</TableCell>
              <TableCell>Current Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractsLoading ? (
              Array.from(new Array(3)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="wave" width={50} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={80} />
                  </TableCell>
                </TableRow>
              ))
            ) : contractsData && contractsData.length > 0 ? (
              contractsData.map((contract, index) => {
                // Calculate the total paid amount from invoices
                const totalPaidAmount =
                  contract.invoices && contract.invoices.length > 0
                    ? contract.invoices.reduce(
                        (sum, invoice) =>
                          sum + parseFloat(invoice.total_paid_amt || 0),
                        0
                      )
                    : 0;

                // Calculate the canceled amount
                const canceledAmount =
                  contract.quote_services &&
                  Array.isArray(contract.quote_services)
                    ? contract.quote_services
                        .filter((service) => service.service_cancelled_at)
                        .reduce(
                          (sum, service) =>
                            sum + parseFloat(service.sub_total || 0),
                          0
                        )
                    : 0;

                // Calculate the current amount (total - canceled amount)
                const currentAmount =
                  parseFloat(contract.grand_total) - canceledAmount;

                // Calculate if contract is active, expired, or cancelled
                const today = new Date();
                const endDate = new Date(contract.contract_end_date);
                let status = "Active";

                if (contract.contract_cancelled_at) {
                  status = "Cancelled";
                } else if (endDate < today) {
                  status = "Expired";
                }

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {formatDate(contract.contract_start_date)}
                    </TableCell>
                    <TableCell>
                      {formatDate(contract.contract_end_date)}
                    </TableCell>
                    <TableCell>
                      {parseFloat(contract.grand_total).toFixed(2)}
                    </TableCell>
                    <TableCell>{totalPaidAmount.toFixed(2)}</TableCell>
                    <TableCell>{canceledAmount.toFixed(2)}</TableCell>
                    <TableCell>{currentAmount.toFixed(2)}</TableCell>
                    <TableCell>{status}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No contracts found for this client
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ledger Table */}
      <h2 className="text-xl font-bold my-4">Ledger</h2>
      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Reference By</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="wave" width={100} />
                  </TableCell>
                </TableRow>
              ))
            ) : rowData.length > 0 && Array.isArray(rowData) ? (
              rowData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {format(new Date(row.updated_at), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.personable?.client?.referencable?.name}</TableCell>
                  <TableCell>{row.cr_amt}</TableCell>
                  <TableCell>{row.dr_amt}</TableCell>
                  <TableCell>{row.cash_balance}</TableCell>
                  <TableCell>
                    {/* Conditional link based on description */}
                    <Link href={getInvoiceLink(row)}>
                      {row.description && row.description.includes("Job Completed") 
                        ? "View Invoice" 
                        : "View Receipt"}
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No ledger data available
                </TableCell>
              </TableRow>
            )}
            {!loading && Array.isArray(rowData) && rowData.length > 0 && (
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {rowData
                      .reduce(
                        (acc, row) => acc + parseFloat(row.cr_amt || 0),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {rowData
                      .reduce(
                        (acc, row) => acc + parseFloat(row.dr_amt || 0),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Details
          </Typography>
          {modalData && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Field</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Value</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Cash Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.cash_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Credit Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.cr_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Debit Amount:</strong>
                    </TableCell>
                    <TableCell>{modalData.dr_amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Payment Type:</strong>
                    </TableCell>
                    <TableCell>{modalData.payment_type}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default withAuth(Page);