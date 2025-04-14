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
          <Grid item lg={12} xs={12} sm={6} md={6}>
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
                {pests
                  ?.filter((row) =>
                    rowsPest.some((pest) => pest.pest_name === row.pest_name)
                  )
                  .map((row, index) => (
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
                        checked={true}
                        control={<CustomCheckbox />}
                        label={
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: "regular",
                              color: "black",
                            }}
                          >
                            {row?.pest_name
                              ? row.pest_name.charAt(0).toUpperCase() +
                                row.pest_name.slice(1).toLowerCase()
                              : ""}
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
                  ))}
              </Grid>
            </div>
          </Grid>

          <Grid item lg={12} xs={12} sm={6} md={6}>
            <div
              style={{
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
                {service
                  .filter((row) => rows.some((item) => item.name === row.name))
                  .map((row, index) => (
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
                        checked={true}
                        control={<CustomCheckbox />}
                        label={
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            {row?.name
                              ? row.name.charAt(0).toUpperCase() +
                                row.name.slice(1).toLowerCase()
                              : ""}
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
                  ))}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>

      <div style={{ marginTop: "2rem" }} className={styles.clientRecord}>
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
                 Pest Found
                </TableCell>

                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                   Treatment Area
                </TableCell>

                <TableCell
                  sx={{
                    color: "white",
                    padding: "4px 16px",
                    lineHeight: "1rem",
                  }}
                >
                  Main Infected Area
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
                          fontSize:"10px"
                        }}
                      >
                        {row.inspected_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                          fontSize:"10px"
                        }}
                      >
                        {row.infestation_level}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                          fontSize:"10px"
                        }}
                      >
                        {row.manifested_areas}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "4px 16px",
                          lineHeight: "1rem",
                          fontSize:"10px"
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

      <div className="flex gap-4 mt-5">
        <div style={{ flex: 1 }}>
          <div
            style={{
              marginTop: "-10px",
              paddingTop: "0px",
              fontSize: "12px",
              marginBottom: "10px",
            }}
            className={styles.areaHead}
          >
            Products Used
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className={styles.tableHead}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontSize: "10px",
                    }}
                  >
                    Product
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontSize: "10px",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontSize: "10px",
                    }}
                  >
                    Dose
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      padding: "4px 16px",
                      lineHeight: "1rem",
                      fontSize: "10px",
                    }}
                  >
                    Average Price
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
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                            fontSize: "10px",
                            borderRight: "1px solid rgba(224, 224, 224, 0.5)", // Add right border to first cell
                          }}
                        >
                          {row?.product?.product_name}
                        </TableCell>
                        <TableCell
                          sx={{
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                            fontSize: "10px",
                          }}
                        >
                          {row.qty}
                        </TableCell>
                        <TableCell
                          sx={{
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                            fontSize: "10px",
                          }}
                        >
                          {row.dose}
                        </TableCell>
                        <TableCell
                          sx={{
                            marginTop: "-10px",
                            paddingTop: "0px",
                            paddingBottom: "15px",
                            fontSize: "10px",
                          }}
                        >
                          {row.avg_price}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div
          className={styles.clientRecord}
          style={{ flex: 1, paddingTop: "-3rem" }}
        >
          <div className={styles.areaHead}>Recommendations</div>
          <div>{serviceReportList?.recommendations_and_remarks}</div>
        </div>
      </div>
    </div>
  );
};

export default ClientRecords;
