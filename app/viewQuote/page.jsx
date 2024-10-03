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
} from "@mui/material";
import SearchInput from "@/components/generic/SearchInput";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";

const Quotation = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);

  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const [quotesResponse, contactsResponse] = await Promise.all([
        api.getDataWithToken(`${quotation}/all`),
        api.getDataWithToken(`${quotation}/contracted`), // Replace 'contacts' with your actual endpoint
      ]);

      // Assuming both responses have a `data` property that is an array
      const mergedData = [...quotesResponse.data, ...contactsResponse.data];
      setQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
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
              <TableCell>Customer</TableCell>
              <TableCell>Billing Method</TableCell>
              <TableCell>Quote Title</TableCell>
              <TableCell>Treatment Method Name</TableCell>
              <TableCell> Services </TableCell>
              <TableCell>Sub Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width="80%"
                      height={40}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : (
              quoteList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.user?.name}</TableCell>
                  <TableCell>{row.billing_method}</TableCell>
                  <TableCell>{row.quote_title}</TableCell>
                  <TableCell>
                    {row?.treatment_methods
                      ?.map((method) => method.name)
                      .join(", ") || "N/A"}
                  </TableCell>

                  <TableCell>
                    {row?.quote_services
                      ?.map((service) => service?.service?.service_title)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell>{row.sub_total}</TableCell>
                  <TableCell>
                    <Link href={`/quotePdf?id=${row.id}`}>
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
          Quotations
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

export default Quotation;
