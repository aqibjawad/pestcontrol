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
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import APICall from "../../../networkUtil/APICall";
import { bank } from "../../../networkUtil/Constants";

const BankTransactions = () => {
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = new APICall();

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
          const response = await api.getDataWithToken(`${bank}/${id}`);
          setBankData(response.data);
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

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

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!bankData) {
    return (
      <Typography variant="body1" align="center">
        No data available
      </Typography>
    );
  }

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h6">
            {bankData.bank_name} Bank Transactions
          </Typography>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Transaction Id</TableCell>
                <TableCell>Reference Name</TableCell>
                <TableCell align="right">Debit </TableCell>
                <TableCell align="right">Credit </TableCell>
                <TableCell align="right">Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankData.ledgers?.map((entry, index) => (
                <TableRow key={entry.id || index}>
                  <TableCell>{formatDate(entry.created_at)}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry?.referenceable?.transection_id}</TableCell>
                  <TableCell>{getReferenceName(entry)}</TableCell>
                  <TableCell align="right">
                    {parseFloat(entry.dr_amt).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(entry.cr_amt).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <span
                      style={{
                        color:
                          parseFloat(entry.cr_amt) > 0 ? "#2e7d32" : "#d32f2f",
                      }}
                    >
                      {parseFloat(entry.cr_amt) > 0 ? "Credit" : "Debit"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}

              {/* Totals Row */}
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell colSpan={3} align="right">
                  <strong>Totals:</strong>
                </TableCell>
                <TableCell align="right" style={{ color: "#d32f2f" }}>
                  <strong>{totalDebit.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" style={{ color: "#2e7d32" }}>
                  <strong>{totalCredit.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" style={{ color: "blue" }}>
                  <strong>{bankData.balance}</strong>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default BankTransactions;
