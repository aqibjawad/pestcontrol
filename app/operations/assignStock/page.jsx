"use client";
import React from "react";
import { useBrands } from "./useAssignStockHook"; // Adjust the import path as needed
import Loading from "../../../components/generic/Loading";
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
} from "@mui/material";

const Page = () => {
  const {
    fetchingData,
    brandsList,
    employeesList,
    brandName,
    setBrandName,
    sendingData,
    addBrand,
    updateBrand,
    editingBrandId,
    startEditing,
    cancelEditing,
    setSelectedEmployeedId,
    handleEmployeedChange,
  } = useBrands();

  const viewList = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Picture</TableCell>
            <TableCell>Product Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              <img src={brandsList?.product_picture} width="50" height="200" />
            </TableCell>
            <TableCell component="th" scope="row">
              <div>
                {brandsList?.product_name}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <div className="pageTitle"> Assign Stock </div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="">{viewList()}</div>
          <div className=" ">
            <div className="pageTitle">Assign Stock</div>

            <div className="mt-5">
              <Dropdown
                onChange={handleEmployeedChange}
                options={employeesList}
                title={"Select Employee"}
              />
            </div>

            {/* <div className="mt-5">
              <Dropdown options={employeesList} title={"Select Product"} />
            </div> */}

            <div className="mt-5">
              <InputWithTitle
                title={"Enter Quantity"}
                placeholder={"Enter Quantity"}
                value={brandName}
                onChange={(value) => setBrandName(value)}
              />
            </div>
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={addBrand}
              title={"Add Brand"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
