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

  const sortedData = loading ? [] : sortData(rowData);

  console.log(sortedData);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{supplierName}</div>
        <div>
          <div className="mt-2">
            <Button
              className={styles.hideOnPrint}
              variant="contained"
              color="primary"
              onClick={addViewBank}
            >
              Add / View Banks
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
