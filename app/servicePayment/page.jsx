"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { serviceInvoice } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";

const Page = () => {
  const api = new APICall();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true); // Loader state for table
  const [buttonLoading, setButtonLoading] = useState(false); // Loader state for button
  const [invoiceDetails, setInvoiceDetails] = useState([]); // State to store invoice details data

  const [invoiceAllDetails, setInvoiceAllDetails] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getPayments();
    }, 2000);
  }, [id]);

  const getPayments = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}/${id}`);
      setInvoiceDetails(response.data.details); 
      setInvoiceAllDetails(response.data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (value) => {
    console.log("Value sent:", value);
  };

  const [paid_amt, setPaidAmount] = useState("");
  const [descrp, setDescrp] = useState("");

  const [formData, setFormData] = useState({
    service_invoice_id: id,
    paid_amt: "",
    description: "",
    is_all_amt_pay: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true); // Start loader for button

    try {
      const response = await api.postFormDataWithToken(
        `${serviceInvoice}/add_payment`,
        formData
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
    } finally {
      setButtonLoading(false); // Stop loader after submission
    }
  };

  return (
    <>
      <div style={{fontSize:"20px", fontWeight:"600", marginBottom:"2rem"}}> {invoiceAllDetails.service_invoice_id} </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <TableContainer component={Paper}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress />
              </div>
            ) : (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Job Type</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceDetails?.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.job_type}</TableCell>
                      <TableCell align="right">${row.rate}</TableCell>
                      <TableCell align="right">${row.sub_total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>

        <Grid
          style={{ backgroundColor: "white" }}
          item
          lg={6}
          xs={12}
          sm={6}
          md={6}
        >
          <Grid container spacing={2}>
            <Grid item lg={8} xs={12} md={6}>
              <div>
                <InputWithTitle
                  onChange={setPaidAmount}
                  type={"text"}
                  value={paid_amt}
                  title="Paid Amount"
                />
              </div>
            </Grid>
            <Grid className="mt-3" item lg={4} xs={12} md={6}>
              <div>
                {/* Button to send value '1' on click */}
                <button
                  onClick={() => handleButtonClick(1)} // Calling a function to handle button click
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                    Pay All
                </button>
              </div>
            </Grid>
            <Grid item lg={12} xs={12} md={12}>
              <div className="mt-5">
                <InputWithTitle
                  onChange={setDescrp}
                  type={"text"}
                  value={descrp}
                  title="Description"
                />
              </div>
            </Grid>
          </Grid>

          <div className="mt-5">
            <GreenButton onClick={handleSubmit} title={"Submit"}>
              {buttonLoading ? (
                <CircularProgress size={20} style={{ marginRight: "10px" }} />
              ) : (
                "Submit"
              )}
            </GreenButton>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Page;
