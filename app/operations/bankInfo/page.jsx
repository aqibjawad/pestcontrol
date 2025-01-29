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
import DateFilters from "@/components/generic/DateFilters";

// TableSkeleton component remains the same...
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

const BankTransactions = () => {
  const api = new APICall();

  const [bankData, setBankData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  const fetchBankData = async (start, end) => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (id) {
        // Format dates properly for API call
        const formattedStartDate = start
          ? format(new Date(start), "yyyy-MM-dd")
          : "";
        const formattedEndDate = end ? format(new Date(end), "yyyy-MM-dd") : "";

        const response = await api.getDataWithToken(
          `${bank}/${id}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        );
        setBankData(response.data);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates?.start && dates?.end) {
      const formattedStart = format(new Date(dates.start), "yyyy-MM-dd");
      const formattedEnd = format(new Date(dates.end), "yyyy-MM-dd");
      setStartDate(formattedStart);
      setEndDate(formattedEnd);
      // Immediately call fetchBankData with new dates
      fetchBankData(formattedStart, formattedEnd);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBankData(startDate, endDate);
  }, []); // Remove startDate and endDate from dependencies

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Rest of the component remains the same...
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
      (acc, entry) => ({
        totalDebit: acc.totalDebit + parseFloat(entry.dr_amt),
        totalCredit: acc.totalCredit + parseFloat(entry.cr_amt),
      }),
      { totalDebit: 0, totalCredit: 0 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <DateFilters onDateChange={handleDateChange} />
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
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
            <Typography variant="body1" align="center">
              No data available
            </Typography>
          ) : (
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
                        <TableCell align="center">
                          {entry.description}
                        </TableCell>
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
                      <TableCell colSpan={4} align="right">
                        <strong>Totals:</strong>
                      </TableCell>
                      <TableCell align="center" className="text-red-600">
                        <strong>
                          {calculateTotals().totalDebit.toFixed(2)}
                        </strong>
                      </TableCell>
                      <TableCell align="center" className="text-green-600">
                        <strong>
                          {calculateTotals().totalCredit.toFixed(2)}
                        </strong>
                      </TableCell>
                      <TableCell align="center" className="text-blue-600">
                        <strong>{bankData.balance}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankTransactions;
