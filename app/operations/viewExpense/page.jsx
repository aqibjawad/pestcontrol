"use client";
import { useState, useEffect } from "react";
import { Skeleton, Grid, Typography, Box } from "@mui/material"; // Import MUI Skeleton
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import APICall from "@/networkUtil/APICall";
import { expense_category } from "@/networkUtil/Constants";

import DateFilters from "../../../components/generic/DateFilters";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [tableDetails, setTableDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, [id]);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      fetchOrderDetails(id);
    }
  }, [id, startDate, endDate]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      // Build query params with date filters
      const queryParams = [];
      if (startDate) {
        queryParams.push(`start_date=${startDate}`);
      }
      if (endDate) {
        queryParams.push(`end_date=${endDate}`);
      }

      // Build the complete API URL with id and query parameters
      const queryString =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const apiUrl = `${expense_category}/${id}${queryString}`;

      // Fetch data from the API
      const response = await api.getDataWithToken(apiUrl);
      setOrderDetails(response.data);
      setTableDetails(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return tableDetails
      .reduce((total, row) => total + parseFloat(row.amount || 0), 0)
      .toFixed(2);
  };

  const listTable = () => {
    if (loading) {
      return (
        <div className={tableStyles.tableContainer}>
          <Skeleton variant="rectangular" height={200} />
        </div>
      );
    }

    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Expense Picture
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Expense Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Payment Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {tableDetails.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  {new Date(row?.expense_date).toLocaleDateString()}
                </td>
                <td className="py-5 px-4">
                  <img
                    style={{ width: "100px", height: "50px" }}
                    alt={row?.expense_name}
                    src={row?.expense_file}
                  />
                </td>
                <td className="py-2 px-4">{row?.expense_name}</td>
                <td className="py-2 px-4">{row?.payment_type}</td>
                <td className="py-2 px-4">{row.amount}</td>
              </tr>
            ))}
            {/* Display total amount */}
            <tr>
              <td colSpan="5" className="py-2 px-4 font-semibold">
                Total
              </td>
              <td className="py-2 px-4 font-semibold">
                {calculateTotalAmount()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <Grid container spacing={2}>
          {/* Expense Category */}
          <Grid item lg={10} xs={12}>
            <Typography variant="h6" fontWeight="600">
              {orderDetails?.expense_category}
            </Typography>
          </Grid>

          {/* Date Filter Section */}
          <Grid lg={2} item xs={12} md={4}>
            <Box
              sx={{
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                style={{ marginLeft: "8px", marginRight: "8px" }}
                alt="Filter Icon"
              />
              <DateFilters onDateChange={handleDateChange} />
            </Box>
          </Grid>
        </Grid>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-12">{listTable()}</div>
      </div>
    </div>
  );
};

export default Page;
