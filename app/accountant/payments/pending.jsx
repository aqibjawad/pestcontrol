"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { payments } from "../../../networkUtil/Constants";
import Link from "next/link";

const Pending = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setPaymentsList] = useState([]);
  const [approving, setApproving] = useState(null); // Track approval loading state per row

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${payments}`);
      setPaymentsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleApprove = async (id) => {
    setApproving(id); 
    try {
      const response = await api.postFormDataWithToken(`${payments}/approve`, {
        received_cash_record_id: id,
      });
      console.log("Approval response:", response.data);
      getAllQuotes();
    } catch (error) {
      console.error("Error approving payment:", error);
    } finally {
      setApproving(null);
    }
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Approve</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              quoteList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{row?.client_user?.name}</TableCell>
                  <TableCell>{row?.employee_user?.name}</TableCell>
                  <TableCell>{row?.paid_amt}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={approving === row.id}
                      onClick={() => handleApprove(row.id)}
                    >
                      {approving === row.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{row?.status}</TableCell>
                  <TableCell> 
                    <Link href={`/invoiceDetails?id=${row.service_invoice_id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Pending Payments
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          {/* <div
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "44px",
              width: "202px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1rem",
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            Date
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Pending;
