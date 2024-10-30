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
import { useRouter } from "next/navigation";
import DateFilters from "@/components/generic/DateFilters";
import { format } from "date-fns";
import InputWithTitle from "@/components/generic/InputWithTitle";

const Quotation = () => {
  const router = useRouter();
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [allQuoteList, setAllQuoteList] = useState([]);
  const [isApproving, setIsApproving] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleApprove = async (id) => {
    setIsApproving((prev) => ({ ...prev, [id]: true }));
    try {
      await api.getDataWithToken(`${quotation}/move/contract/${id}`);
      const updateQuotes = (prevList) =>
        prevList.map((quote) =>
          quote.id === id ? { ...quote, is_contracted: 1 } : quote
        );
      setQuoteList(updateQuotes);
      setAllQuoteList(updateQuotes);
      router.push("/contracts");
    } catch (error) {
      console.error("Error approving quote:", error);
    } finally {
      setIsApproving((prev) => ({ ...prev, [id]: false }));
    }
  };

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
      const mergedData = quotesResponse?.data || [];
      setQuoteList(mergedData);
      setAllQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
      setQuoteList([]);
      setAllQuoteList([]);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  const getNestedValue = (obj, path) => {
    try {
      return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
    } catch (error) {
      return "";
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);

    const sortedQuotes = [...quoteList].sort((a, b) => {
      const aValue = getNestedValue(a, property);
      const bValue = getNestedValue(b, property);

      if (aValue < bValue) return newOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setQuoteList(sortedQuotes);
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                >
                  Sr No
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "user.name"}
                  direction={orderBy === "user.name" ? order : "asc"}
                  onClick={() => handleRequestSort("user.name")}
                >
                  Customer
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "tag"}
                  direction={orderBy === "tag" ? order : "asc"}
                  onClick={() => handleRequestSort("tag")}
                >
                  Tag
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "billing_method"}
                  direction={orderBy === "billing_method" ? order : "asc"}
                  onClick={() => handleRequestSort("billing_method")}
                >
                  Billing Method
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "quote_title"}
                  direction={orderBy === "quote_title" ? order : "asc"}
                  onClick={() => handleRequestSort("quote_title")}
                >
                  Quote Title
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                Treatment Method Name
              </TableCell>
              <TableCell className="contractHeader">Services</TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "is_contracted"}
                  direction={orderBy === "is_contracted" ? order : "asc"}
                  onClick={() => handleRequestSort("is_contracted")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "sub_total"}
                  direction={orderBy === "sub_total" ? order : "asc"}
                  onClick={() => handleRequestSort("sub_total")}
                >
                  Sub Total
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={10} style={{ textAlign: "center" }}>
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
                <TableRow key={row?.id || index}>
                  <TableCell className="contractTable">{index + 1}</TableCell>
                  <TableCell className="contractTable">
                    {row?.user?.name || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    <div className="approvedContrant">{row?.tag || "N/A"}</div>
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.billing_method || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.quote_title || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.treatment_methods
                      ?.map((method) => method?.name)
                      ?.filter(Boolean)
                      ?.join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.quote_services
                      ?.map((service) => service?.service?.service_title)
                      ?.filter(Boolean)
                      ?.join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.is_contracted === 0 ? (
                      <div className="pendingContrant">Pending</div>
                    ) : (
                      <div className="approvedContrant">Approved</div>
                    )}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.sub_total || 0}
                  </TableCell>
                  <TableCell className="contractTable">
                    <div className="flex space-x-2">
                      <Link href={`/quotePdf?id=${row?.id}`}>
                        <span className="text-blue-600 hover:text-blue-800">
                          View Details
                        </span>
                      </Link>
                      {row?.is_contracted === 0 && (
                        <button
                          onClick={() => handleApprove(row.id)}
                          disabled={isApproving[row.id]}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          {isApproving[row.id] ? "Approving..." : "Approve"}
                        </button>
                      )}
                    </div>
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
          (item?.tag || "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (item?.user?.name || "")
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
      setQuoteList(filteredData);
    } else {
      setQuoteList(allQuoteList);
    }
  }, [filterValue, allQuoteList]);

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
              placeholder="Filter By Name, Tag"
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
