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
import { job } from "@/networkUtil/Constants";

import Link from "next/link";

const Page = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/all`);
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
            <TableCell>id</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Job Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Job Status</TableCell>
              <TableCell>Service Report Status</TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>Actions</TableCell>
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
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row.job_date}</TableCell>
                  <TableCell>{row.description.slice(0, 20)}</TableCell>
                  <TableCell>{row.job_title}</TableCell>
                  <TableCell>
                    {row.is_completed === "0" && "Not Started"}
                    {row.is_completed === "1" && "Completed"}
                    {row.is_completed === "2" && "In Progress"}
                  </TableCell>

                  <TableCell>
                    {row.is_completed === "0" && "Not Service Report"}
                    {row.is_completed === "1" && "Service Report Completed"}
                  </TableCell>

                  <TableCell>{row.sub_total}</TableCell>
                  <TableCell>
                    {" "}
                    <Link href={`/viewJob?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        View Details
                      </span>
                    </Link>
                    <div className="mr-2"></div>
                    <Link href={`/operations/assignJob?id=${row.id}`}>
                      <span className="text-blue-600 hover:text-blue-800">
                        Assign Jobs
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
          All Jobs
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
            Date
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
