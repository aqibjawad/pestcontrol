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
} from "@mui/material";
import SearchInput from "@/components/generic/SearchInput";
import APICall from "@/networkUtil/APICall";
import { serviceInvoice } from "@/networkUtil/Constants";

import Link from "next/link";

const Page = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${serviceInvoice}`);
      setInvoiceList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Invoice Issue Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Add Payment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              invoiceList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row.issued_date}</TableCell>
                  <TableCell>{row.total_amt}</TableCell>
                  <TableCell>
                    {" "}
                    <Link href={`/quotePdf?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Link href={`/servicePayment?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        Add Payments
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
          Invoices
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
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
            Download all
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Page;
