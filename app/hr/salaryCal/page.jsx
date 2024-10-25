"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Typography, Button } from "@mui/material";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import InputWithTitle from "@/components/generic/InputWithTitle";

import styles from "../../../styles/salaryModal.module.css";

import GreenButton from "@/components/generic/GreenButton";

import Swal from "sweetalert2";

import CircularProgress from "@mui/material/CircularProgress";

const SalarCal = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCompany, setEmployeeCompany] = useState([]);

  const [attendance_per, setAttendence] = useState("");

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get`
      );
      setEmployeeList(response.data);
      setEmployeeCompany(response.data.captain_jobs);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Modal open/close handlers
  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = async (employee) => {
    setLoadingSubmit(true);

    const obj = {
      employee_commission_id: employee?.referencable?.id, // Set referencable id directly
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/commission/paid`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Commission has been paid successfully!",
        }).then(() => {
          window.location.reload(); // Reload to update the table if necessary
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error.message || "Error processing payment",
        });
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
          <table className="min-w-full bg-white ">
            <thead>
              <tr>
                <th className="py-5 px-4 border-b border-gray-200 text-left">
                  Sr.
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Employee Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Allowance
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Attendance
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Basic salary
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Paid total Salary
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Total Salary
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Update Attendence
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-5 px-4">{row.employee_id}</td>
                  <td className="py-5 px-4">{row.allowance}</td>
                  <td className="py-5 px-4">{row.attendance_per}</td>
                  <td className="py-5 px-4">{row.basic_salary}</td>
                  <td className="py-5 px-4">{row.paid_total_salary}</td>
                  <td className="py-5 px-4">{row.status}</td>
                  <td className="py-5 px-4">{row.total_salary}</td>
                  <td className="py-5 px-4">
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenModal(row)}
                    >
                      Update Attendence
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for updating attendance */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modalBox}>
          <div className={styles.modalHead}>
            Update Attendance for {selectedEmployee?.employee_id}
          </div>
          <div className={styles.modalContent}>
            <InputWithTitle
              type={"text"}
              title="Attendance Percentage"
              placeholder="Enter attendance percentage"
              value={attendance_per}
              onChange={setAttendence}
            />
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
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SalarCal;
