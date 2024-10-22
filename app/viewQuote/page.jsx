"use client";

import React, { useState, useEffect, use } from "react";
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
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";

import DateFilters from "@/components/generic/DateFilters";

import { format } from "date-fns";
import InputWithTitle from "@/components/generic/InputWithTitle";

const Quotation = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [allQuoteList, setAllQuoteList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterValue, setFilterValue] = useState("");

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
      const [quotesResponse] = await Promise.all([
        api.getDataWithToken(`${quotation}/all?${queryParams.join("&")}`),
      ]);
      const mergedData = [...quotesResponse.data];
      setQuoteList(mergedData);
      setAllQuoteList(mergedData);
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
              <TableCell className="contractHeader">Sr No</TableCell>
              <TableCell className="contractHeader">Customer</TableCell>
              <TableCell className="contractHeader">Tag</TableCell>
              <TableCell className="contractHeader">Billing Method</TableCell>
              <TableCell className="contractHeader">Quote Title</TableCell>
              <TableCell className="contractHeader">
                Treatment Method Name
              </TableCell>
              <TableCell className="contractHeader"> Services </TableCell>
              <TableCell className="contractHeader"> Status </TableCell>
              <TableCell className="contractHeader">Sub Total</TableCell>
              <TableCell className="contractHeader">Actions</TableCell>
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
                  <TableCell className="contractTable">{index + 1}</TableCell>
                  <TableCell className="contractTable">
                    {row?.user?.name}
                  </TableCell>
                  <TableCell className="contractTable">
                    <div className="approvedContrant">{row?.tag}</div>
                  </TableCell>
                  <TableCell className="contractTable">
                    {row.billing_method}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row.quote_title}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.treatment_methods
                      ?.map((method) => method.name)
                      .join(", ") || "N/A"}
                  </TableCell>

                  <TableCell className="contractTable">
                    {row?.quote_services
                      ?.map((service) => service?.service?.service_title)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row.is_contracted === 0 ? (
                      <div className="pendingContrant">Pending</div>
                    ) : (
                      <div className="approvedContrant">Approved</div>
                    )}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row.sub_total}
                  </TableCell>
                  <TableCell className="contractTable">
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

  useEffect(() => {
    if (filterValue !== "") {
      const filteredData = allQuoteList.filter(
        (item) =>
          item.tag.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.user.name.toLowerCase().includes(filterValue.toLowerCase())
      );

      setQuoteList(filteredData);
    } else {
      setQuoteList(allQuoteList);
    }
  }, [filterValue]);

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
          <div>
            <InputWithTitle
              placeholder="Fitler By Name, Tag"
              title={"Filter by Tag, Name"}
              onChange={setFilterValue}
            />
          </div>
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
              marginTop: "35px",
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

export default Quotation;
