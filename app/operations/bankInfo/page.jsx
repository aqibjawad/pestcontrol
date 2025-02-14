"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
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
  const today = format(new Date(), "yyyy-MM-dd");

  const [bankData, setBankData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const fetchBankData = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");

      if (id) {
        const queryParams = [`start_date=${startDate}`, `end_date=${endDate}`];

        const response = await api.getDataWithToken(
          `${bank}/${id}?${queryParams.join("&")}`
        );
        setBankData(response.data);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    fetchBankData();
  }, [startDate, endDate]);

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
      (acc, entry) => ({
        totalDebit: acc.totalDebit + parseFloat(entry.dr_amt),
        totalCredit: acc.totalCredit + parseFloat(entry.cr_amt),
      }),
      { totalDebit: 0, totalCredit: 0 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <div className="flex-grow"></div>
        <div
          className="mb-4"
          style={{
            padding: "5px",
            backgroundColor: "#32a92e",
            borderRadius: "50px",
            fontSize: "13px",
            color: "white",
          }}
        >
          <DateFilters onDateChange={handleDateChange} />
        </div>
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
                      <TableCell align="left">Description</TableCell>
                      <TableCell align="left">Transaction Id</TableCell>
                      <TableCell align="center">Reference Name</TableCell>
                      <TableCell align="center">Debit</TableCell>
                      <TableCell align="center">Credit</TableCell>
                      <TableCell align="center">Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bankData.ledgers?.map((entry, index) => (
                      <TableRow key={entry.id || index}>
                        <TableCell align="left">
                          {formatDate(entry.created_at)}
                        </TableCell>
                        <TableCell align="left">{entry.description}</TableCell>
                        <TableCell align="left">
                          {entry?.transection_id}
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
