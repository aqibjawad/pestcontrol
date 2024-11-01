"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Typography, Button, Skeleton } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import styles from "../../../styles/salaryModal.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";

const SalaryCal = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [attendance_per, setAttendance] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}/salary/get`);
      if (response?.data) {
        setEmployeeList(response.data);
        setEmployeeCompany(response.data.captain_jobs || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch employee data",
      });
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setAttendance(employee.attendance_per || ""); // Pre-fill current attendance
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    setAttendance(""); // Reset attendance input
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) return;
    if (!attendance_per || isNaN(attendance_per) || attendance_per < 0 || attendance_per > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please enter a valid attendance percentage (0-100)",
      });
      return;
    }

    setLoadingSubmit(true);

    const obj = {
      employee_id: selectedEmployee.id,
      attendance_percentage: attendance_per,
      month: selectedMonth,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/attendance/update`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Attendance has been updated successfully!",
        }).then(() => {
          handleCloseModal();
          getAllEmployees(); // Refresh the data
        });
      } else {
        throw new Error(response.error?.message || "Failed to update attendance");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="mt-10 mb-10">
        <div className="pageTitle">Salary Calculations</div>

        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-5 px-4 border-b border-gray-200 text-left">Sr.</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Employee Name</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Allowance</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Attendance (%)</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Basic Salary</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Paid Total Salary</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Status</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Total Salary</th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchingData ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    {Array.from({ length: 9 }).map((_, colIndex) => (
                      <td key={colIndex} className="py-5 px-4">
                        <Skeleton variant="rectangular" height={30} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                employeeList.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-5 px-4">{index + 1}</td>
                    <td className="py-5 px-4">{row?.user?.name}</td>
                    <td className="py-5 px-4">{row.allowance}</td>
                    <td className="py-5 px-4">{row.attendance_per}%</td>
                    <td className="py-5 px-4">{row.basic_salary}</td>
                    <td className="py-5 px-4">{row.paid_total_salary}</td>
                    <td className="py-5 px-4">{row.status}</td>
                    <td className="py-5 px-4">{row.total_salary}</td>
                    <td className="py-5 px-4">
                      <Button 
                        variant="outlined" 
                        onClick={() => handleOpenModal(row)}
                      >
                        Update Attendance
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modalBox}>
          <div className={styles.modalHead}>
            Update Attendance for {selectedEmployee?.user?.name}
          </div>
          <div className={styles.modalContent}>
            <InputWithTitle
              type="number"
              title="Attendance Percentage"
              placeholder="Enter attendance percentage (0-100)"
              value={attendance_per}
              onChange={(value) => setAttendance(value)}
              min="0"
              max="100"
            />
            <div className="mt-5">
              <GreenButton
                onClick={handleSubmit}
                title={loadingSubmit ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                disabled={loadingSubmit}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SalaryCal; 