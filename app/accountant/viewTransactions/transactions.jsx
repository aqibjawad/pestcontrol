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
import APICall from "../../../networkUtil/APICall";
import { clients } from "../../../networkUtil/Constants";

import Link from "next/link";

import DateFilters2 from "@/components/generic/DateFilters2";
import { format } from "date-fns";

const Transactions = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  const getAllQuotes = async () => {
    setFetchingData(true);

    const queryParams = [];
    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      const startDate = format(firstDayOfMonth, "yyyy-MM-dd");
      const endDate = format(lastDayOfMonth, "yyyy-MM-dd");

      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${`${clients}/received_amount/get`}?${queryParams.join("&")}`
      );
      setQuoteList(response.data);
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
              <TableCell>Sr No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>View Details</TableCell>
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
              quoteList?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>{row?.ledger_cr_amt_sum}</TableCell>
                  <TableCell>
                    <Link
                      href={`/client/clientLedger/?id=${
                        row.id
                      }&name=${encodeURIComponent(
                        row.name
                      )}&phone_number=${encodeURIComponent(
                        row?.client?.phone_number
                      )}`}
                    >
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
          Approved Payments
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
            <DateFilters2 onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Transactions;
