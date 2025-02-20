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
  TableSortLabel,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAllSuppliers } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import Link from "next/link";

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [number, setNumber] = useState("");
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const router = useRouter();
  const tableRef = useRef(null);

  // Add sorting states
  const [orderBy, setOrderBy] = useState("updated_at");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");
    const urlSupplierName = getParamFromUrl(currentUrl, "supplier_name");
    const urlCompanyName = getParamFromUrl(currentUrl, "company_name");
    const urlNumber = getParamFromUrl(currentUrl, "number");

    setId(urlId);
    setSupplierName(urlSupplierName);
    setCompanyName(urlCompanyName);
    setNumber(urlNumber);

    if (urlId) {
      fetchData(urlId);
    }
  }, []);

  const fetchData = async (supplierId) => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllSuppliers}/ledger/get/${supplierId}`
      );
      const data = response.data;
      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sort function for different data types
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let comparison = 0;

      switch (orderBy) {
        case "updated_at":
          comparison = new Date(a.updated_at) - new Date(b.updated_at);
          break;
        case "description":
          comparison = a.description.localeCompare(b.description);
          break;
        case "cr_amt":
        case "dr_amt":
        case "cash_balance":
          comparison =
            parseFloat(a[orderBy] || 0) - parseFloat(b[orderBy] || 0);
          break;
        default:
          comparison = 0;
      }

      return order === "asc" ? comparison : -comparison;
    });
  };

  const handleViewDetails = (row) => {
    setModalData(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const addViewBank = () => {
    router.push(`/account/supplier_ledger/addSupplierBanks?id=${id}`);
  };

  // PDF Generation Function
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title and header information (moved down slightly to accommodate logo)
    doc.setFontSize(18);
    doc.text(`Supplier: ${supplierName}`, 14, 30);
    doc.text(`Company: ${companyName}`, 14, 37);
    doc.text(`Contact: ${number}`, 14, 44);
    doc.text(`Generated on: ${format(new Date(), "yyyy-MM-dd")}`, 14, 51);

    // Add logo to the right side
    const logoURL = "/logo.jpeg"; // Replace with your actual logo path
    doc.addImage(logoURL, "PNG", 140, 15, 50, 25); // Positioned on right side (x=140)

    // Define the columns for the table
    const tableColumn = ["Date", "Description", "Credit", "Debit", "Balance"];

    // Define the rows for the table
    const tableRows = [];

    sortedData.forEach((item) => {
      const formattedDate = format(new Date(item.updated_at), "yyyy-MM-dd");
      const tableData = [
        formattedDate,
        item.description,
        item.cr_amt,
        item.dr_amt,
        item.cash_balance,
      ];
      tableRows.push(tableData);
    });

    // Generate the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [222, 226, 230],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    // Add footer with total calculation
    const totalCredit = sortedData
      .reduce((sum, item) => sum + parseFloat(item.cr_amt || 0), 0)
      .toFixed(2);
    const totalDebit = sortedData
      .reduce((sum, item) => sum + parseFloat(item.dr_amt || 0), 0)
      .toFixed(2);
    const finalBalance =
      sortedData.length > 0
        ? sortedData[sortedData.length - 1].cash_balance
        : "0.00";

    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`Total Credit: ${totalCredit}`, 14, finalY + 10);
    doc.text(`Total Debit: ${totalDebit}`, 14, finalY + 17);
    doc.text(`Final Balance: ${finalBalance}`, 14, finalY + 24);

    // Save the PDF
    doc.save(
      `supplier_ledger_${supplierName}_${format(new Date(), "yyyyMMdd")}.pdf`
    );
  };

  const sortedData = loading ? [] : sortData(rowData);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{supplierName}</div>
        <div className={styles.buttonGroup}>
          <div className="mt-2">
            <Button
              className={styles.hideOnPrint}
              variant="contained"
              color="primary"
              onClick={addViewBank}
              style={{ marginRight: "10px" }}
            >
              Add / View Banks
            </Button>
            <Button
              className={styles.hideOnPrint}
              variant="contained"
              color="secondary"
              onClick={generatePDF}
              style={{ backgroundColor: "#4caf50" }}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.leftSection1}>{companyName}</div>
      <div className={styles.leftSection1}>{number}</div>

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "updated_at"}
                  direction={orderBy === "updated_at" ? order : "asc"}
                  onClick={() => handleSort("updated_at")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleSort("description")}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "cr_amt"}
                  direction={orderBy === "cr_amt" ? order : "asc"}
                  onClick={() => handleSort("cr_amt")}
                >
                  Credit
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "dr_amt"}
                  direction={orderBy === "dr_amt" ? order : "asc"}
                  onClick={() => handleSort("dr_amt")}
                >
                  Debit
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "cash_balance"}
                  direction={orderBy === "cash_balance" ? order : "asc"}
                  onClick={() => handleSort("cash_balance")}
                >
                  Balance
                </TableSortLabel>
              </TableCell>
              <TableCell>View Purchase Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={200} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  </TableRow>
                ))
              : sortedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {format(new Date(row.updated_at), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.cr_amt}</TableCell>
                    <TableCell>{row.dr_amt}</TableCell>
                    <TableCell>{row.cash_balance}</TableCell>
                    <TableCell>
                      <Link
                        href={`/account/purchaseOrderDetails?id=${row?.purchase_order?.id}`}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
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
