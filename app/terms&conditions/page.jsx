"use client";

import React, { useState } from "react";
import { useTermHook } from "./useTermHook";
import Loading from "../../components/generic/Loading";
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
import withAuth from "@/utils/withAuth";

const Page = () => {
  const {
    fetchingData,
    brandsList,
    name,
    setName,
    text,
    setText,
    assignStock,
  } = useTermHook();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const viewList = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Text</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              <div>{brandsList?.name}</div>
            </TableCell>
            <TableCell component="th" scope="row">
              <div>{brandsList?.text}</div>
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
      <div className="pageTitle">Terms And Conditions</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="mt-5">
              <InputWithTitle
                title="Enter Name"
                placeholder="Enter Name"
                value={name}
                onChange={(value) => setName(value)}
              />
            </div>
 
            <div className="mt-5">
              <InputWithTitle
                title="Enter Text"
                placeholder="Enter Text"
                value={text}
                onChange={(value) => setText(value)}
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

export default withAuth(Page);
