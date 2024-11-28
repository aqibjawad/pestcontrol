"use client";

import React, { useState } from "react";
import { useCustomersHook } from "./useCustomersHook";
import Loading from "../../components/generic/Loading";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import Dropdown from "@/components/generic/Dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const {
    fetchingData,
    brandsList,

    person_name,
    setPersonName,
    contact,
    setContact,
    address,
    setAddress,
    opening_balance,
    setOpeningBalance,
    description,
    setDescrp,

    addCustomer,
  } = useCustomersHook();

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const viewList = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Peson Name</TableCell>
            <TableCell>Contact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {brandsList?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{item.person_name}</TableCell>
              <TableCell>{item.contact}</TableCell>
              {/* <TableCell>
                <Edit
                  sx={{ color: "#3deb49", cursor: "pointer" }}
                  onClick={() => handleEditClick(item.id, item.name)}
                />
                <Delete
                  sx={{
                    color: "red",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleSave = async () => {
    setLoadingSubmit(true);
    try {
      await addCustomer();
    } catch (error) {
      console.error("Error assigning stock:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="pageTitle"> Add Customers </div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Add Customers</div>

            <div className="mt-5">
              <InputWithTitle
                title="Person Name"
                placeholder="Person Name"
                value={person_name}
                onChange={(value) => setPersonName(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title="Contact"
                placeholder="Contact"
                value={contact}
                onChange={(value) => setContact(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title="Address"
                placeholder="Address"
                value={address}
                onChange={(value) => setAddress(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title="Opening Balance"
                placeholder="Opening Balance"
                value={opening_balance}
                onChange={(value) => setOpeningBalance(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title="Description"
                placeholder="Description"
                value={description}
                onChange={(value) => setDescrp(value)}
              />
            </div>

            <div className="mt-20">
              <GreenButton
                onClick={handleSave}
                title={loadingSubmit ? "Saving..." : "Save"}
                disabled={loadingSubmit}
                startIcon={
                  loadingSubmit ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
