"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton, // Import Skeleton
} from "@mui/material";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();
  const [personId, setPersonId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [stock, setStock] = useState();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split("?")[1]);

    const personIdFromUrl = urlParams.get("id");
    const productIdFromUrl = urlParams.get("product_id");

    setPersonId(personIdFromUrl);
    setProductId(productIdFromUrl);
  }, []);

  useEffect(() => {
    if (personId && productId) {
      console.log("Person ID and Product ID set:", personId, productId);
      handleSubmit();
    }
  }, [personId, productId]);

  const handleSubmit = async () => {
    try {
      const submissionData = {
        user_id: personId,
        product_id: productId,
      };

      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/stock/used`,
        submissionData
      );

      setStock(response.data);
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <Grid container spacing={2} style={{ padding: "20px" }}>
        {loading ? ( // Show Skeleton while loading
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width={100} height={100} />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" width={100} height={100} />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                style={{ marginTop: "1rem" }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
                src={stock?.product?.product_picture}
                alt={stock?.product?.product_name}
              />
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.product?.product_name}
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4}></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
                src={stock?.user?.employee?.profile_image}
                alt={stock?.user?.name}
              />
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.user?.name}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  fontWeight: "800",
                  fontSize: "16px",
                }}
              >
                {stock?.user?.email}
              </div>
            </Grid>
          </>
        )}
      </Grid>

      <TableContainer>
        {loading ? ( // Show Skeleton for table while loading
          <Skeleton variant="rectangular" height={400} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Dose</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock?.used_stock?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.job?.user?.name}</TableCell>
                  <TableCell>{row?.job?.user?.client?.firm_name}</TableCell>
                  <TableCell>{formatDate(row?.updated_at)}</TableCell>
                  <TableCell>{row.dose}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
};

export default withAuth(Page);
