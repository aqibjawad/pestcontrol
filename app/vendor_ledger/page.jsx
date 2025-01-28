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
import APICall from "../../networkUtil/APICall";
import withAuth from "@/utils/withAuth";

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
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First try to get all vendors if no ID
        if (!id) {
          const response = await api.getDataWithToken(vendors);
          setTableData(response.data);
        } else {
          // If ID exists, get specific vendor data
          const response = await api.getDataWithToken(`${vendors}/${id}`);
          setRowData(response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render all vendors if no ID
  if (!id) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.supplier_name}</TableCell>
                <TableCell>{vendor.number}</TableCell>
                <TableCell>{vendor.balance}</TableCell>
                <TableCell>
                  <Button onClick={() => setId(vendor.id)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Render specific vendor details if ID exists
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
              <TableCell>Firm Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Manager Name</TableCell>
              <TableCell>Manager Contact</TableCell>
              <TableCell>Accountant Name</TableCell>
              <TableCell>Accountant Contact</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{rowData?.created_at}</TableCell>
              <TableCell>{rowData?.firm_name}</TableCell>
              <TableCell>{rowData?.contact}</TableCell>
              <TableCell>{rowData?.mng_name}</TableCell>
              <TableCell>{rowData?.mng_contact}</TableCell>
              <TableCell>{rowData?.acc_contact}</TableCell>
              <TableCell>{rowData?.acc_contact}</TableCell>
              <TableCell>{rowData?.opening_balance}</TableCell>
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
