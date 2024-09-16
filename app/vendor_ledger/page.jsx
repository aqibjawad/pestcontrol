"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/ledger.module.css";
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
} from "@mui/material";

import "jspdf-autotable";

import { vendors } from "../../networkUtil/Constants";
import { useSearchParams } from "next/navigation";

import APICall from "../../networkUtil/APICall";

const Page = () => {
  const api = new APICall();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(`${vendors}/${id}`);

      const data = response.data;

      setRowData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  const handlePrint = () => {
    // window.print();
    // router.push("/supplier_invoice");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date as MM/DD/YYYY by default, adjust as needed
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>{rowData?.supplier_name}</div>
        <Button
          className={styles.hideOnPrint}
          variant="contained"
          color="primary"
          onClick={handlePrint}
        >
          PDF Generate
        </Button>
      </div>
      <div className={styles.leftContact}>{rowData?.number}</div>

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell> HSN </TableCell>
              <TableCell> VAT </TableCell>
              <TableCell> Naam / Jama </TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{formatDate(rowData.created_at)}</TableCell>
              <TableCell>{rowData.hsn}</TableCell>
              <TableCell>{rowData.vat}</TableCell>
              <TableCell>{rowData.balance < 0 ? "Naam" : "Jama"}</TableCell>
              <TableCell>{rowData.opening_balance}</TableCell>
            </TableRow>
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

export default Page;
