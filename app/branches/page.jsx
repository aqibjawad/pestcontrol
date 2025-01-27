"use client";

import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { branches } from "@/networkUtil/Constants";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";
import CircularProgress from "@mui/material/CircularProgress";

const Page = () => {
  const api = new APICall();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [address, setDescrp] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [rows, setRows] = useState([]);

  const handleName = (name, value) => {
    setName(value);
  };

  const handleDescrp = (name, value) => {
    setDescrp(value);
  };

  const handlePhone = (name, value) => {
    setPhone(value);
  };

  const handleEmail = (name, value) => {
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      name,
      address,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${branches}/create`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        // Clear form fields after successful submission
        setName("");
        setDescrp("");
        // Fetch updated data immediately
        await fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getDataWithToken(`${branches}`);
      const data = response.data;
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <InputWithTitle3 title="Name" value={name} onChange={handleName} />
          </div>

          <div className="mt-5">
            <InputWithTitle3
              title="Location"
              value={address}
              onChange={handleDescrp}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle3
              title="Email"
              value={email}
              onChange={handleEmail}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle3
              title="Phone"
              value={phone}
              onChange={handlePhone}
            />
          </div>

          <div className="mt-5">
            <GreenButton
              onClick={handleSubmit}
              title={
                loadingSubmit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Submit"
                )
              }
              disabled={loadingSubmit}
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
