"use client";

import React, { useState } from "react";
import { useAssignStockHook } from "./useAssignStockHook";
import Loading from "../../../components/generic/Loading";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import Dropdown from "@/components/generic/Dropdown";
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

const Page = () => {
  const {
    fetchingData,
    employees,
    brandsList,
    employeesList,
    quantity,
    setQuantity,
    sendingData,
    assignStock,
    setSelectedEmployeeId,
    handleEmployeeChange,
  } = useAssignStockHook();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const viewList = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Picture</TableCell>
            <TableCell>Product Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              <img
                src={brandsList?.product_picture}
                width="50"
                height="200"
                alt="Product"
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <div>{brandsList?.product_name}</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleSave = async () => {
    setLoadingSubmit(true);
    try {
      await assignStock();
    } catch (error) {
      console.error("Error assigning stock:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="pageTitle">Assign Stock</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Assign Stock</div>

            <div className="mt-5">
              <Dropdown
                onChange={handleEmployeeChange}
                options={employees}
                title="Select Employee"
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title="Enter Quantity"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(value) => setQuantity(value)}
              />
            </div>
            <div className="mt-20">
              <GreenButton
                onClick={handleSave}
                title={loadingSubmit ? "Saving..." : "Save"}
                disabled={loadingSubmit}
                startIcon={
                  loadingSubmit ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
