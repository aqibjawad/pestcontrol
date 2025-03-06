"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import APICall from "@/networkUtil/APICall";
import { agreement } from "@/networkUtil/Constants";
import Link from "next/link";

const Agreement = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [allDevices, setAllDevices] = useState([]);

  const getDevices = async () => {
    setFetchingData(true);
    var response = await api.getDataWithToken(agreement);
    setAllDevices(response?.data?.data?.data);
    setFetchingData(false);
  };

  useEffect(() => {
    getDevices();
  }, []);

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const sortedDevices = useMemo(() => {
    return [...allDevices]
      .map((item) => {
        const remainingDays = Math.ceil(
          (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return { ...item, remainingDays };
      })
      .sort((a, b) => {
        // First sort by priority: < 30 days agreements go to the top
        const aPriority = a.remainingDays < 30;
        const bPriority = b.remainingDays < 30;

        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;

        // Then sort by remaining days within each priority group
        return a.remainingDays - b.remainingDays;
      });
  }, [allDevices]);

  // Get background color based on remaining days
  const getBackgroundColor = (days) => {
    if (days < 30) {
      return "#FFEBEE"; // Light red
    } else if (days < 60) {
      return "#FFF3E0"; // Light orange
    } else {
      return "#FFF8E1"; // Light yellow/cream like in the image
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Card
        key={index}
        sx={{
          boxShadow: 1,
          transition: "box-shadow 0.3s",
          marginTop: "1rem",
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Skeleton variant="rectangular" height={80} />
        </CardContent>
      </Card>
    ));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          backgroundColor: "white",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: "medium" }}>
          Agreements
        </Typography>
        <Link
          href="/agreement"
          style={{
            backgroundColor: "#2E7D32",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          View All
        </Link>
      </div>

      {fetchingData
        ? renderSkeletons()
        : sortedDevices?.map((item, index) => {
            const bgColor = getBackgroundColor(item.remainingDays);

            return (
              <Card
                key={index}
                sx={{
                  boxShadow: 1,
                  "&:hover": { boxShadow: 3 },
                  transition: "box-shadow 0.3s",
                  marginTop: "1rem",
                }}
              >
                <CardContent sx={{ p: 1 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: bgColor,
                      color: "black",
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* First Row - Labels */}
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Name
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Start Date
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          End Date
                        </Typography>
                      </Grid>

                      {/* Second Row - Values */}
                      <Grid item xs={4}>
                        <Typography variant="body2">{item.name}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {formatDate(item.start_date || new Date())}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2">
                          {formatDate(item.expiry_date)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid className="mt-5" container spacing={2}>
                      {/* First Row - Labels */}
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Remaining Days
                        </Typography>
                      </Grid>

                      {/* Second Row - Values */}
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              item.remainingDays < 30
                                ? "#D32F2F"
                                : item.remainingDays < 60
                                ? "#EF6C00"
                                : "#FF8F00", // Orange like in the image
                          }}
                        >
                          {item.remainingDays} days
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
    </div>
  );
};

export default Agreement;
