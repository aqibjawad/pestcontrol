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
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { saleOrder } from "../../../networkUtil/Constants";

const getParamFromUrl = (url, param) => {
  const searchParams = new URLSearchParams(url.split("?")[1]);
  return searchParams.get(param);
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(`${saleOrder}/${id}`);
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
    window.print();
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          {rowData?.customer?.person_name}
        </div>
        <div>
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
      <div className={styles.leftSection1}> {rowData?.so_id} </div>
      {/* <div className={styles.leftSection1}>Sub Total: {rowData?.sub_total}</div>
      <div className={styles.leftSection1}>VAT Amount: {rowData?.vat_amt}</div>
      <div className={styles.leftSection1}>
        Grand Total: {rowData?.grand_total}
      </div> */}

      <TableContainer component={Paper} ref={tableRef}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>VAT (%)</TableCell>
              <TableCell>VAT Amount</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7}>
                    <Skeleton animation="wave" height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : rowData?.order_details?.length > 0 ? (
              rowData.order_details.map((detail, index) => (
                <TableRow key={index} onClick={() => handleViewDetails(detail)}>
                  <TableCell>{detail.product?.product_name}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>{detail.price}</TableCell>
                  <TableCell>{detail.sub_total}</TableCell>
                  <TableCell>{detail.vat_per}</TableCell>
                  <TableCell>{detail.vat_amount}</TableCell>
                  <TableCell>{detail.total}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Data Available
                </TableCell>
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
            Product Details
          </Typography>
          {modalData && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>{modalData.product?.product_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Batch Number</TableCell>
                    <TableCell>{modalData.product?.batch_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Manufacturing Date</TableCell>
                    <TableCell>{modalData.product?.mfg_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>{modalData.product?.exp_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>{modalData.product?.description}</TableCell>
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
