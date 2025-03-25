"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/viewQuote.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Skeleton,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { treatmentMethod, services } from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";

const ClientRecords = ({ serviceReportList, loading }) => {
  const api = new APICall();

  const CustomCheckbox = styled(Checkbox)({
    padding: 0,
    "& .MuiSvgIcon-root": {
      width: 14,
      height: 14,
    },
    "&.Mui-checked": {
      color: "#31AB49",
    },
  });

  const rowsAreas = serviceReportList?.areas || [];
  const rowsPest = serviceReportList?.pest_found_services || [];
  const rowsProducts = serviceReportList?.used_products || [];
  const rows = serviceReportList?.treatment_methods || [];

  const skeletonAreaRows = [1, 2, 3, 4].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={150} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={200} />
      </TableCell>
    </TableRow>
  ));

  const skeletonProductRows = [1, 2, 3, 4].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={50} />
      </TableCell>
    </TableRow>
  ));

  const [service, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pests, setPests] = useState([]);

  const getAllServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDataWithToken(treatmentMethod);
      if (response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPests = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDataWithToken(services);
      if (response.data !== "") {
        setPests(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
    getAllPests();
  }, []);

  return (
    <div
      style={{
        fontSize: "0.75rem", // Reduce overall font size
        lineHeight: "1.2", // Tighten line spacing
        padding: "0.5rem", // Reduce padding
      }}
    >
      {/* Pest Found and Treatment Methods Section */}
      <Grid container spacing={1} style={{ marginBottom: "0.5rem" }}>
        <Grid item lg={4} xs={12} sm={6} md={6}>
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "2px",
              }}
            >
              Pest Found
            </div>
            <Grid container spacing={0}>
              {pests?.map((row, index) => {
                const isChecked = rowsPest.some(
                  (pest) => pest.pest_name === row.pest_name
                );

                return (
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    lg={4}
                    key={index}
                    sx={{
                      "@media print": {
                        flexBasis: "33.333%",
                        maxWidth: "33.333%",
                      },
                    }}
                  >
                    <FormControlLabel
                      disabled
                      checked={isChecked}
                      control={<CustomCheckbox />}
                      label={
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: "regular",
                          }}
                        >
                          {row?.pest_name}
                        </div>
                      }
                      sx={{
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          marginLeft: "2px",
                        },
                        "& .MuiCheckbox-root": {
                          marginRight: 0,
                        },
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Grid>

        <Grid item lg={8} xs={12} sm={6} md={6}>
          <div
            style={{
              borderLeft: "1px solid #e0e0e0",
              paddingLeft: "8px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "bold",
                marginBottom: "2px",
              }}
            >
              Treatment Methods
            </div>
            <Grid container spacing={0}>
              {service.map((row, index) => {
                const isChecked = rows.some((item) => item.name === row.name);

                return (
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    lg={3}
                    key={index}
                    sx={{
                      "@media print": {
                        flexBasis: "33.333%",
                        maxWidth: "33.333%",
                      },
                    }}
                  >
                    <FormControlLabel
                      disabled
                      checked={isChecked}
                      control={<CustomCheckbox />}
                      label={
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: "bold",
                          }}
                        >
                          {row?.name}
                        </div>
                      }
                      sx={{
                        margin: 0,
                        "& .MuiFormControlLabel-label": {
                          marginLeft: "2px",
                        },
                        "& .MuiCheckbox-root": {
                          marginRight: 0,
                        },
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </Grid>
      </Grid>

      {/* Areas Section */}
      <div style={{ marginBottom: "0.25rem" }} className={styles.clientRecord}>
        <div className={styles.areaHead} style={{ fontSize: "11px" }}>
          Areas
        </div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Inspected Area
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Infection Level
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Manifested Area
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Report and Follow Up
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonAreaRows
                : rowsAreas.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.inspected_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.infestation_level}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.manifested_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.report_and_follow_up_detail}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Products Used Section */}
      <div style={{ marginBottom: "0.25rem" }} className={styles.clientRecord}>
        <div className={styles.areaHead} style={{ fontSize: "11px" }}>
          Products Used
        </div>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Dose
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "2px 8px",
                    lineHeight: "1rem",
                    fontSize: "10px",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonProductRows
                : rowsProducts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row?.product?.product_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.dose}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.qty}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "2px 8px",
                          lineHeight: "1rem",
                          fontSize: "9px",
                        }}
                      >
                        {row.total}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Recommendations Section */}
      <div className={styles.clientRecord}>
        <div className={styles.areaHead} style={{ fontSize: "11px" }}>
          Recommendations
        </div>
        <div style={{ fontSize: "9px" }}>
          {serviceReportList?.recommendations_and_remarks}
        </div>
      </div>
    </div>
  );
};

export default ClientRecords;
