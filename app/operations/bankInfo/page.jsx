"use client";

import React, { useState, useEffect } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { bank } from "../../../networkUtil/Constants";
import MonthPicker from "../../hr/monthPicker";

// Skeleton Loading Component
const TableSkeleton = ({ rows = 5, columns = 7 }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {[...Array(columns)].map((_, index) => (
              <TableCell key={`header-${index}`}>
                <Skeleton variant="text" width="100%" height={24} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton
                    variant="text"
                    width={colIndex === 0 ? "80px" : "100%"}
                    height={24}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Main Bank Transactions Component
const BankTransactions = () => {
  const [bankData, setBankData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = new APICall();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    const monthStr = dates.startDate.slice(0, 7);
    setIsLoading(true); // Set loading to true when month changes
    setSelectedMonth(monthStr);
  };

  useEffect(() => {
    const fetchBankData = async () => {
      setIsLoading(true); // Set loading to true before API call
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        // Create Date object from selected month
        const selectedDate = new Date(selectedMonth);

        // Get start and end dates for the selected month
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);

        // Format dates as ISO strings
        const startDate = format(start, "yyyy-MM-dd");
        const endDate = format(end, "yyyy-MM-dd");

        if (id) {
          const response = await api.getDataWithToken(
            `${bank}/${id}?start_date=${startDate}&end_date=${endDate}`
          );
          setBankData(response.data);
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after API call completes
      }
    };

    fetchBankData();
  }, [selectedMonth]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReferenceName = (entry) => {
    if (!entry.referenceable) return "-";
    if (entry.referenceable_type === "App\\Models\\Supplier") {
      return entry.referenceable.supplier_name || "-";
    }
    return entry.referenceable.name || "-";
  };

  const calculateTotals = () => {
    if (!bankData?.ledgers) return { totalDebit: 0, totalCredit: 0 };

    return bankData.ledgers.reduce(
      (acc, entry) => {
        return {
          totalDebit: acc.totalDebit + parseFloat(entry.dr_amt),
          totalCredit: acc.totalCredit + parseFloat(entry.cr_amt),
        };
      },
      { totalDebit: 0, totalCredit: 0 }
    );
  };

  // Always render the Card wrapper and MonthPicker
  return (
    <Card>
      <MonthPicker onDateChange={handleDateChange} />
      <CardContent>
        {isLoading ? (
          // Show skeleton when loading
          <>
            <Skeleton
              variant="text"
              width={300}
              height={32}
              style={{ marginBottom: "20px" }}
            />
            <TableSkeleton rows={5} columns={7} />
          </>
        ) : !bankData ? (
          // Show no data message when bankData is null
          <Typography variant="body1" align="center">
            No data available
          </Typography>
        ) : (
          // Show actual data when not loading and data exists
          <>
            <div className="flex justify-between mb-4">
              <Typography variant="h6">
                {bankData.bank_name} Bank Transactions
              </Typography>
            </div>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Transaction Id</TableCell>
                    <TableCell align="center">Reference Name</TableCell>
                    <TableCell align="center">Debit</TableCell>
                    <TableCell align="center">Credit</TableCell>
                    <TableCell align="center">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bankData.ledgers?.map((entry, index) => (
                    <TableRow key={entry.id || index}>
                      <TableCell align="center">
                        {formatDate(entry.created_at)}
                      </TableCell>
                      <TableCell align="center">{entry.description}</TableCell>
                      <TableCell align="center">
                        {entry?.referenceable?.transection_id}
                      </TableCell>
                      <TableCell align="center">
                        {getReferenceName(entry)}
                      </TableCell>
                      <TableCell align="center">
                        {parseFloat(entry.dr_amt).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {parseFloat(entry.cr_amt).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <span
                          className={
                            parseFloat(entry.cr_amt) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {parseFloat(entry.cr_amt) > 0 ? "Credit" : "Debit"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={3} align="right">
                      <strong>Totals:</strong>
                    </TableCell>
                    <TableCell align="right" className="text-red-600">
                      <strong>{calculateTotals().totalDebit.toFixed(2)}</strong>
                    </TableCell>
                    <TableCell align="right" className="text-green-600">
                      <strong>
                        {calculateTotals().totalCredit.toFixed(2)}
                      </strong>
                    </TableCell>
                    <TableCell align="right" className="text-blue-600">
                      <strong>{bankData.balance}</strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BankTransactions;
