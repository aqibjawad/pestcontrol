"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// Dynamically import MUI components with ssr disabled
const DynamicTableContainer = dynamic(
  () => import("@mui/material/TableContainer"),
  { ssr: false }
);

const DynamicTable = dynamic(() => import("@mui/material/Table"), {
  ssr: false,
});

const Pending = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setPaymentsList] = useState([]);
  const [approving, setApproving] = useState(null);

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
      await getAllQuotes();
    } catch (error) {
      console.error("Error approving payment:", error);
    } finally {
      setApproving(null);
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "2rem" }}
        >
          Pending Payments
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <DynamicTableContainer
            component={Paper}
            style={{height:"300px"}}
          >
            <DynamicTable>
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
                    <TableCell colSpan={8} className="text-center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : quoteList?.length > 0 ? (
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
                        <Link
                          href={`/invoiceDetails?id=${row.service_invoice_id}`}
                          className="text-blue-500 no-underline"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No Pending Amounts
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </DynamicTable>
          </DynamicTableContainer>
        </div>
      </div>
    </div>
  );
};

export default Pending;
