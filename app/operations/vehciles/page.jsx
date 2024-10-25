"use client";
import React from "react";
import { useVehicles } from "./useVehcilesHook"; // Adjust the import path as needed
import Loading from "../../../components/generic/Loading";
import styles from "../../../styles/account/addBrandStyles.module.css";
import { Delete, Edit, Check, Close } from "@mui/icons-material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";
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
    vehiclesList,

    vehicle_number,
    modal_number, 
    condition,
    expiry_date,
    oil_change_limit,

    setVehicleNumber,
    setModalNumber,
    setCondition,
    setExpiryDate,
    setOilChange,

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
                    <Delete
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
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

  return (
    <div>
      <div className="pageTitle">Vehicles</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="pageTitle">Add Vehicle</div>
            <div className="mt-10"></div>

            <InputWithTitle
              title={"Enter Modal Name"}
              placeholder={"Enter Modal Number"}
              value={modal_number}
              onChange={(value) => setModalNumber(value)}
            />

            <div className="mt-5">
              <InputWithTitle
                title={"Enter Plate Number"}
                placeholder={"Enter Plate Number"}
                value={vehicle_number}
                onChange={(value) => setVehicleNumber(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Assign To"}
                placeholder={"Assign To"}
                value={vehicle_number}
                onChange={(value) => setVehicleNumber(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Condition"}
                placeholder={"Condition"}
                value={condition}
                onChange={(value) => setCondition(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle3
                title={"Mulkia Expiry Date"}
                placeholder={"Mulkia Expiry Date"}
                value={expiry_date}
                type={"date"}
                onChange={(value) => setExpiryDate(value)}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Oil Change Limit"}
                placeholder={"Oil Change Limit"}
                value={oil_change_limit}
                onChange={(value) => setOilChange(value)}
              />
            </div>

            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={
                editingVehiclesId
                  ? () => updateVehicle(editingVehiclesId, vehicle_number)
                  : addVehicle
              }
              title={editingVehiclesId ? "Update Vehicle" : "Add Vehicle"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
