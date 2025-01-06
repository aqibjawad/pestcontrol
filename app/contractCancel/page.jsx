"use client";

import React, { useState, useEffect } from "react";

import Layout from "../../components/layout";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Button,
  Modal,
  Box,
  Typography,
  Skeleton,
  Paper,
} from "@mui/material";

import { Loader2 } from "lucide-react";

import { quotation } from "@/networkUtil/Constants";
import withAuth from "@/utils/withAuth";
import APICall from "@/networkUtil/APICall";

import InputWithTitle3 from "@/components/generic/InputWithTitle3";

import Swal from "sweetalert2";

import styles from "../../styles/viewQuote.module.css";

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
  const [invoiceList, setInvoiceList] = useState([]);
  const [invoiceJobList, setInvoiceJobList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State for modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contract_cancel_reason, setConCancelReason] = useState("");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
    if (urlId) {
      getInvoices(urlId);
    }
  }, []);

  const getInvoices = async (urlId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${quotation}/service_invoices/${urlId}`
      );
      setInvoiceList(response.data);

      const allJobs = response?.data?.invoices
        ?.flatMap((invoice) => invoice.jobs || [])
        .filter((job) => job.is_completed === 1);

      setInvoiceJobList(allJobs);

      const allInvoicesList = response?.data?.invoices;

      setInvoicesList(allInvoicesList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleCancel = () => {
    setOpenModal(true); // Open the modal
  };

  const handleModalClose = () => {
    setOpenModal(false); // Close the modal
  };

  const handleInputChange = (name, value) => {
    setConCancelReason(value);
  };

  const handleModalConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const obj = {
      contract_cancel_reason,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${quotation}/move/cancel/${id}`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during submission.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle no date case
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Formats to "Month Day, Year"
  };

  return (
    <Layout>
      <div className="text-red-500 text-center">Contract Cancel</div>

      <Grid container spacing={3}>
        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 6 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Customer:</strong>
                  </TableCell>
                  <TableCell> {invoiceList?.user?.name} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Reference:</strong>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {invoiceList?.user?.client?.referencable?.name}{" "}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job title: </strong>
                  </TableCell>
                  <TableCell> {invoiceList?.quote_title} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Country: </strong>
                  </TableCell>
                  <TableCell> UAE </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={4}>
          <TableContainer sx={{ mt: 6 }}>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableBody>
                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Job type : </strong>
                  </TableCell>
                  <TableCell> Reoccuring </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Duration: </strong>
                  </TableCell>
                  <TableCell> {invoiceList?.duration_in_months} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> TRN: </strong>
                  </TableCell>
                  <TableCell> {invoiceList?.trn} </TableCell>
                </TableRow>

                <TableRow sx={{ border: "none" }}>
                  <TableCell>
                    <strong> Date: </strong>
                  </TableCell>
                  <TableCell> {formatDate(invoiceList?.updated_at)} </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <div className={styles.clientRecord}>
        <div className={styles.clientHead}> Job List </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Sr #{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  Job Id
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Client Name{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Firm Name{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Status{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Completion Date{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchingData ? (
                // Show Skeletons while fetching data
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              ) : invoiceJobList?.length === 0 ? (
                // Show a "No data" message if the job list is empty
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No job is started
                  </TableCell>
                </TableRow>
              ) : (
                // Map through the data when it is loaded
                invoiceJobList?.map((job, index) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={job.id || index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{job?.id}</TableCell>
                    <TableCell>{job.user?.name}</TableCell>
                    <TableCell>{job.user?.client?.firm_name}</TableCell>
                    <TableCell>
                      {job.is_completed === 0
                        ? "Not Started"
                        : job.is_completed === 1
                        ? "Complete"
                        : job.is_completed === 2
                        ? "In Process"
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {job.job_end_time
                        ? new Date(job.job_end_time).toISOString().split("T")[0]
                        : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div style={{ marginTop: "1rem" }} className={styles.clientRecord}>
        <div className={styles.clientHead}> Invoices </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Sr #{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Invoice Id{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Amount{" "}
                </TableCell>
                <TableCell sx={{ color: "white" }} align="center">
                  {" "}
                  Status{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchingData ? (
                // Show Skeletons while fetching data
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))
              ) : invoicesList?.length === 0 ? (
                // Show a "No data" message if the job list is empty
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No job is started
                  </TableCell>
                </TableRow>
              ) : (
                // Map through the data when it is loaded
                invoicesList?.map((job, index) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={job.id || index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{job.invoiceable_id}</TableCell>
                    <TableCell>{job.paid_amt}</TableCell>
                    <TableCell>{job.status}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Grid for Buttons */}
      <Grid container spacing={2}>
        {!invoiceList?.contract_cancel_reason ? (
          <>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <div className="space-y-4">
              <div>
                <strong>Cancellation Reason:</strong>{" "}
                {invoiceList?.contract_cancel_reason}
              </div>
              <div>
                <strong>Cancelled At:</strong>{" "}
                {new Date(invoiceList?.contract_cancelled_at).toLocaleString()}
              </div>
            </div>
          </Grid>
        )}
      </Grid>

      {/* Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Cancellation
          </Typography>
          <InputWithTitle3
            title="Reason"
            type={"text"}
            value={contract_cancel_reason}
            onChange={handleInputChange}
            name="contract_cancel_reason"
          />
          <Grid
            className="mt-5"
            container
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button
                variant="destructive"
                onClick={handleModalConfirm}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleModalClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Page;
