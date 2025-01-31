"use client";
import React from "react";
import { useVehicles } from "./useVehcilesHook"; // Adjust the import path as needed
import Loading from "../../../components/generic/Loading";
import styles from "../../../styles/account/addBrandStyles.module.css";
import { Delete, Edit, Check, Close } from "@mui/icons-material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const {
    fetchingData,
    vehiclesList,
    vehicle_number,
    modal_name,
    condition,
    expiry_date,
    oil_change_limit,
    meter_reading,
    employeesList,
    selectedEmployee,
    setSelectedEmployee,
    setVehicleNumber,
    setModalNumber,
    setCondition,
    setExpiryDate,
    setOilChange,
    setMeterRead,

    sendingData,
    addVehicle,
    updateVehicle,
    editingVehiclesId,
    startEditing,
    cancelEditing,
  } = useVehicles();

  const handleEditClick = (id, number) => {
    startEditing(id, number);
  };

  const handleUpdateClick = () => {
    updateVehicle(editingVehiclesId, vehicle_number);
  };

  const handleCancelClick = () => {
    cancelEditing();
  };

  const viewList = () => (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr #</TableCell>
            <TableCell>Vehicle Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehiclesList?.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {editingVehiclesId === item.id ? (
                  <input
                    type="text"
                    value={vehicle_number}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  item.vehicle_number
                )}
              </TableCell>
              <TableCell>
                {editingVehiclesId === item.id ? (
                  <>
                    <Check
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={handleUpdateClick}
                    />
                    <Close
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={handleCancelClick}
                    />
                  </>
                ) : (
                  <>
                    <Edit
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={() =>
                        handleEditClick(item.id, item.vehicle_number)
                      }
                    />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleDateChange = (name, value) => {
    setExpiryDate(value);
  };

  return (
    <div>
      <div className="pageTitle">Vehicles</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div>
          <div className="pageTitle">Add Vehicle</div>

          <Grid container spacing={3} className="mt-10">
            {/* Model Name */}
            <Grid item xs={12} md={6}>
              <InputWithTitle
                title={"Enter Modal Name"}
                placeholder={"Enter Modal Number"}
                value={modal_name}
                onChange={(value) => setModalNumber(value)}
              />
            </Grid>

            {/* Plate Number */}
            <Grid item xs={12} md={6}>
              <InputWithTitle
                title={"Enter Plate Number"}
                placeholder={"Enter Plate Number"}
                value={vehicle_number}
                onChange={(value) => setVehicleNumber(value)}
              />
            </Grid>

            {/* Assign To */}
            <Grid item xs={12} md={6}>
              <label className="text-black text-sm font-medium mb-1 block">
                Assign To
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                style={{
                  border: "1px solid rgb(229, 231, 235)",
                  height: "45px",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select Employee</option>
                {Array.isArray(employeesList) && employeesList.length > 0 ? (
                  employeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.role.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No employees available
                  </option>
                )}
              </select>
            </Grid>

            {/* Condition */}
            <Grid item xs={12} md={6}>
              <InputWithTitle
                title={"Condition"}
                placeholder={"Condition"}
                value={condition}
                onChange={(value) => setCondition(value)}
              />
            </Grid>

            {/* Mulkia Expiry Date */}
            <Grid item xs={12} md={6}>
              <InputWithTitle3
                title="Mulkia Expiry Date"
                placeholder="Mulkia Expiry Date"
                value={expiry_date}
                type="date"
                onChange={handleDateChange}
                name="expiry_date"
              />
            </Grid>

            {/* Oil Change Limit */}
            <Grid item xs={12} md={6}>
              <InputWithTitle
                title={"Oil Change Limit"}
                placeholder={"Oil Change Limit"}
                value={oil_change_limit}
                onChange={(value) => setOilChange(value)}
              />
            </Grid>

            {/* Price */}
            {/* <Grid item xs={12} md={6}>
              <InputWithTitle3
                title="Price"
                placeholder="Price"
                value={expiry_date}
                type="text"
                onChange={handleDateChange}
                name="expiry_date"
              />
            </Grid> */}

            <Grid item xs={12} md={6}>
              <InputWithTitle3
                title="Meter Reading"
                placeholder="Meter Reading"
                value={meter_reading}
                type="text"
                onChange={(value) => setOilChange(value)}
                name="meter_reading"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} className="mt-10">
              <GreenButton
                sendingData={sendingData}
                onClick={
                  editingVehiclesId
                    ? () => updateVehicle(editingVehiclesId, vehicle_number)
                    : addVehicle
                }
                title={editingVehiclesId ? "Update Vehicle" : "Add Vehicle"}
              />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
