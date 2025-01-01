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
  Typography,
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
      color: "#31AB49", // MUI's default green color
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
    <div>
      <div>
        <Grid container spacing={0}>
          <Grid item lg={6} xs={12} sm={6} md={6}>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "4px", // Reduced margin
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
                              fontSize: "10px",
                              fontWeight: "regular",
                              color: "black",
                            }}
                          >
                            {row?.pest_name}
                          </div>
                        }
                        sx={{
                          margin: 0,
                          "& .MuiFormControlLabel-label": {
                            marginLeft: "2px", // Reduced spacing between checkbox and label
                          },
                          "& .MuiCheckbox-root": {
                            marginRight: 0, // Remove right margin of checkbox
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Grid>

          <Grid item lg={6} xs={12} sm={6} md={6}>
            <div
              style={{
                borderLeft: "1px solid #e0e0e0",
                paddingLeft: "8px", // Reduced padding
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "4px", // Reduced margin
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
                              fontSize: "10px",
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            {row?.name}
                          </div>
                        }
                        sx={{
                          margin: 0,
                          "& .MuiFormControlLabel-label": {
                            marginLeft: "2px", // Reduced spacing between checkbox and label
                          },
                          "& .MuiCheckbox-root": {
                            marginRight: 0, // Remove right margin of checkbox
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
      </div>

      <div className={styles.clientRecord}>
        <div className={styles.areaHead}>Areas</div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Inspected Area
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Infection Level
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Manifested Area
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
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
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row.inspected_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row.infestation_level}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row.manifested_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
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

      <div className={styles.clientRecord}>
        <div className={styles.areaHead}>Products Used</div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead className={styles.tableHead}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Dose
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
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
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row?.product?.product_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row.dose}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                        }}
                      >
                        {row.qty}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
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

      <div className={styles.clientRecord}>
        <div className={styles.areaHead}>Recommendations</div>
        <div>{serviceReportList?.recommendations_and_remarks}</div>
      </div>
    </div>
  );
};

export default ClientRecords;
