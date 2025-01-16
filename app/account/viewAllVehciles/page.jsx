"use client";

import { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import DateFilters from "../../../components/generic/DateFilters";
import APICall from "@/networkUtil/APICall";
import { vehciles, getAllEmpoyesUrl } from "@/networkUtil/Constants";
import {
  Skeleton,
  Modal,
  Box,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import withAuth from "@/utils/withAuth";

import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import Swal from "sweetalert2";

import GreenButton from "@/components/generic/GreenButton";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vehiclesList, setVehiclesList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [employeesList, setEmployeesList] = useState([]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleOpenModal = (vehicleId) => {
    setIsModalOpen(true);
    setSelectedVehicleId(vehicleId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllVehicles();
  }, [startDate, endDate]);

  const getAllVehicles = async () => {
    setFetchingData(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${vehciles}?${queryParams.join("&")}`
      );
      setVehiclesList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const calculateTotalAmount = () => {
    return vehiclesList.reduce(
      (sum, row) => sum + (parseFloat(row.total_amount) || 0),
      0
    );
  };

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Vehicle Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                View
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Add Fine
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Reassign
              </th>
            </tr>
          </thead>
          <tbody>
            {vehiclesList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row?.vehicle_number} ({row?.user?.name})
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.total_amount}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <Link href={`/account/vehicleExpense?id=${row.id}`}>
                    <span className="text-blue-600 hover:text-blue-800">
                      View Details
                    </span>
                  </Link>
                </td>
                <td className="py-2 px-4">
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenModal(row.id)}
                  >
                    Add Fine
                  </Button>
                </td>
                <td className="py-2 px-4">
                  <Button
                    variant="outlined"
                    onClick={() => handleOpenReassignModal(row)}
                  >
                    Reassign Vehicle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="py-3 px-4 text-right">
          <strong>Total Amount: </strong>
          {calculateTotalAmount()}
        </div>
      </div>
    );
  };

  const renderSkeleton = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Vehicle Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Total Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Array(5)).map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <Skeleton width="20px" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="rectangular" width="100px" height={40} />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
                <td className="py-2 px-4">
                  <Skeleton variant="text" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const [fine, setFine] = useState("");
  const [fine_date, setFineDate] = useState("");

  const handleFineDateChange = (name, value) => {
    setFineDate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      fine,
      fine_date,
      vehicle_id: selectedVehicleId,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/vehicle/fine`,
        obj
      );

      if (response?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        handleCloseModal();
        window.location.reload();
      } else {
        throw new Error(response.error?.message || "Something went wrong");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignVehicleData, setReassignVehicleData] = useState(null);

  console.log(reassignVehicleData);

  // Handler to open the reassign modal
  const handleOpenReassignModal = (vehicle) => {
    setReassignVehicleData(vehicle);
    setIsReassignModalOpen(true);
  };

  // Handler to close the reassign modal
  const handleCloseReassignModal = () => {
    setIsReassignModalOpen(false);
  };

  const getAllEmployees = async () => {
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alerts.errorAlert("Failed to fetch employees. Please try again.");
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  const handleUpdateVehicle = async (e) => {
    setLoadingSubmit(true);
    const obj = {
      vehicle_id: reassignVehicleData.id,
      vehicle_number: reassignVehicleData.vehicle_number,
      user_id: selectedEmployee,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${vehciles}/update/${reassignVehicleData.id}`,
        obj
      );

      if (response?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vehicle reassigned successfully!",
        });
        handleCloseReassignModal();
        getAllVehicles();
      } else {
        throw new Error(response.error?.message || "Something went wrong");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
          <div className="pageTitle">{"Vehicles"}</div>
        </div>
        <div
          style={{
            marginTop: "2rem",
            border: "1px solid #38A73B",
            borderRadius: "8px",
            height: "40px",
            width: "150px",
            alignItems: "center",
            display: "flex",
            marginLeft: "2rem",
          }}
        >
          <img
            src="/Filters lines.svg"
            height={20}
            width={20}
            className="ml-2 mr-2"
          />
          <DateFilters onDateChange={handleDateChange} />
        </div>
      </div>

      {fetchingData ? renderSkeleton() : listServiceTable()}

      {/* MUI Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Grid container spacing={2}>
            {/* Header */}
            <Grid item xs={12}>
              <InputWithTitle
                title={"Fine"}
                type={"text"}
                placeholder={"Fine"}
                value={fine}
                onChange={setFine}
              />
            </Grid>

            {/* Left Section */}
            <Grid item xs={12}>
              <InputWithTitle3
                onChange={handleFineDateChange}
                title={"Fine Date"}
                type={"date"}
                value={fine_date}
              />
            </Grid>
          </Grid>
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
        </Box>
      </Modal>

      <Modal open={isReassignModalOpen} onClose={handleCloseReassignModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Reassign Vehicle
          </div>
          {reassignVehicleData && (
            <div>
              <Grid container spacing={2}>
                {/* Header */}
                <Grid item xs={6}>
                  <p>
                    <strong>Vehicle Number:</strong>{" "}
                    {reassignVehicleData.vehicle_number}
                  </p>
                </Grid>

                {/* Left Section */}
                <Grid item xs={6}>
                  <p>
                    <strong>Owner:</strong> {reassignVehicleData.user?.name}
                  </p>
                </Grid>
              </Grid>
            </div>
          )}

          {/* Add input fields for reassigning */}
          <div className="mt-5">
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
            {/* Add this temporarily to debug */}
            <div style={{ display: "none" }}>
              Debug: {employeesList?.length || 0} employees loaded
            </div>
          </div>

          {/* <div className="mt-5">handleUpdateVehicle 
            <GreenButton
              onClick={() => {
                handleUpdateVehicle();
              }}
              title={"Submit"}
            />
          </div> */}
          <div className="mt-5">
            <GreenButton
              onClick={handleUpdateVehicle}
              title={
                loadingSubmit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "handleUpdateVehicle "
                )
              }
              disabled={loadingSubmit}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default withAuth(Page);
