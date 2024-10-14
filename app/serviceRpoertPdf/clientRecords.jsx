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

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    "&.Mui-checked": {
      color: "#38A73B",
    },
  }));

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

  if (pests.length > 0 && rowsPest.length > 0) {
  }

  return (
    <div>
      <div className="">
        <Grid container spacing={2}>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div
              style={{
                borderRadius: "4px",
                padding: "16px",
              }}
            >
              <div
                style={{ fontSize: "13px", fontWeight: "bold", color: "black" }}
              >
                Pest Found
              </div>
              <Grid container spacing={2}>
                {pests.map((row, index) => {
                  const isChecked = rowsPest.some(
                    (pest) => pest.pest_name === row.pest_name
                  );

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <FormControlLabel
                        disabled
                        checked={isChecked} // Set the checked value based on the match
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
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Grid>

          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div
              style={{
                borderLeft: "1px solid #e0e0e0",
                borderRadius: "4px",
                padding: "10px",
              }}
            >
              <div
                style={{ fontSize: "13px", fontWeight: "bold", color: "black" }}
              >
                Treatment Methods
              </div>
              <Grid container spacing={2}>
                {service.map((row, index) => {
                  const isChecked = rows.some((item) => item.name === row.name);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
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
                <TableCell sx={{ color: "white", height:"10px" }}>Inspected Area</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>Infection Level</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>Manifested Area</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>
                  Report and Follow Up
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonAreaRows
                : rowsAreas.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.inspected_areas}</TableCell>
                      <TableCell>{row.infestation_level}</TableCell>
                      <TableCell>{row.manifested_areas}</TableCell>
                      <TableCell>{row.report_and_follow_up_detail}</TableCell>
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
                <TableCell sx={{ color: "white", height:"10px" }}>Product Name</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>Dose</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>Quantity</TableCell>
                <TableCell sx={{ color: "white", height:"10px" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? skeletonProductRows
                : rowsProducts.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row?.product?.product_name}</TableCell>
                      <TableCell>{row.dose}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>{row.total}</TableCell>
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
