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
  Skeleton,
  TableSortLabel,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";

import DateFilters from "./generic/DateFilters";
import { format } from "date-fns"; 

const Contracts = () => {
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

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
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const [contactsResponse] = await Promise.all([
        api.getDataWithToken(
          `${quotation}/contracted?${queryParams.join("&")}`
        ),
      ]);

      const mergedData = [...contactsResponse.data];
      setQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      let aValue, bValue;

      if (orderBy === "status") {
        // Sort by contract cancel status
        aValue = a?.contract_cancel_reason ? "Canceled" : "Active";
        bValue = b?.contract_cancel_reason ? "Canceled" : "Active";
      } else {
        aValue =
          orderBy === "id"
            ? a.id
            : orderBy === "customer"
            ? a?.user?.name
            : a[orderBy];
        bValue =
          orderBy === "id"
            ? b.id
            : orderBy === "customer"
            ? b?.user?.name
            : b[orderBy];
      }

      if (order === "desc") {
        [aValue, bValue] = [bValue, aValue];
      }

      return (aValue || "").toString().localeCompare((bValue || "").toString());
    });
  };

  const sortedData = sortData(quoteList);

  const sortLabelStyles = {
    "& .MuiTableSortLabel-icon": {
      opacity: 1, // Make arrows always visible
      width: "20px", // Slightly larger arrows
      height: "20px",
    },
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "customer"}
                  direction={orderBy === "customer" ? order : "asc"}
                  onClick={() => handleRequestSort("customer")}
                  sx={sortLabelStyles}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell>Total Jobs</TableCell>
              <TableCell>Completed Jobs</TableCell>
              <TableCell>Billing Method</TableCell>
              <TableCell>Quote Title</TableCell>
              <TableCell>Treatment Method Name</TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>Grand Total</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                  sx={sortLabelStyles}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width="80%"
                      height={40}
                      sx={{ margin: "8px auto" }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row?.jobs[0]?.total_jobs}</TableCell>
                  <TableCell>{row?.jobs?.length}</TableCell>
                  <TableCell>{row.billing_method}</TableCell>
                  <TableCell>{row.quote_title}</TableCell>
                  <TableCell>
                    {row?.treatment_methods
                      ?.map((method) => method.name)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>{row.sub_total}</TableCell>
                  <TableCell>{row.grand_total}</TableCell>
                  <TableCell>
                    {!row?.contract_cancel_reason ? (
                      <div style={{ color: "green", fontWeight: "bold" }}>
                        Active
                      </div>
                    ) : (
                      <div style={{ color: "#dc2626" }}>
                        Contract is Canceled
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/quotePdf?id=${row.id}`}>
                      <span style={{ color: "#2563eb", cursor: "pointer" }}>
                        View Details
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {!row?.contract_cancel_reason ? (
                      <Link href={`/contractCancel?id=${row.id}`}>
                        <span style={{ color: "#dc2626", cursor: "pointer" }}>
                          Contract Cancel
                        </span>
                      </Link>
                    ) : (
                      <Link href={`/contractCancel?id=${row.id}`}>
                        <span style={{ fontSize:"16px", color: "#dc2626", cursor: "pointer" }}>
                          Cancel Contract
                        </span>
                      </Link>
                    )}
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
          Contracts
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
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>
    </div>
  );
};

export default Contracts;
