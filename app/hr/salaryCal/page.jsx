"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Button, Skeleton } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import styles from "../../../styles/salaryModal.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";
import Grid from "@mui/material/Grid";

import { useRouter } from "next/navigation";
import MonthPicker from "../monthPicker";
import Link from "next/link";

const SalaryCal = () => {
  const api = new APICall();
  const router = useRouter();

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [attendance_per, setAttendance] = useState("");

  const [adv_received, setAdvRec] = useState("");

  const [description, setDescription] = useState("");

  const [adv_paid, setAdvPaid] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [openAdvModal, setOpenAdvModal] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/salary/get?salary_month=${selectedMonth}`
      );
      if (response?.data) {
        // Sort employees: unpaid first, then paid
        const sortedEmployees = response.data.sort((a, b) => {
          if (a.status === "unpaid" && b.status === "paid") return -1;
          if (a.status === "paid" && b.status === "unpaid") return 1;
          return 0;
        });

        setEmployeeList(sortedEmployees);
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
  }, [selectedMonth]);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setAttendance(employee.attendance_per || "");
    setAdvRec(employee.adv_received || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    setAttendance(""); // Reset attendance input
  };

  const handleOpenAdvModal = (employee) => {
    setAdvPaid(employee.adv_paid || "");
    setSelectedEmployee(employee);
    setOpenAdvModal(true);
  };

  const handleClosAdveModal = () => {
    setOpenAdvModal(false);
    setSelectedEmployee(null);
    setAttendance(""); // Reset attendance input
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) return;
    if (
      !attendance_per ||
      isNaN(attendance_per) ||
      attendance_per < 0 ||
      attendance_per > 100
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please enter a valid attendance percentage (0-100)",
      });
      return;
    }

    setLoadingSubmit(true);

    const obj = {
      employee_salary_id: selectedEmployee.id,
      attendance_per: attendance_per,
      adv_received: adv_received,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/salary/paid`,
        obj
      );

      if (response.status === "success") {
        handleCloseModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Attendance has been updated success  fully!",
        }).then(() => {
          const employeeId = selectedEmployee?.user?.id || selectedEmployee?.id;
          if (!employeeId) {
            console.error("Employee ID is missing");
            return;
          }
          router.push(`/paySlip?id=${employeeId}`);
        });
      } else {
        handleCloseModal();
        throw new Error(
          response.error?.message || "Failed to update attendance"
        );
      }
    } catch (error) {
      handleCloseModal();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmitAdv = async () => {
    if (!selectedEmployee) return;

    setLoadingSubmit(true);

    const obj = {
      employee_salary_id: selectedEmployee.id,
      adv_paid: adv_paid,
      description: description,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/salary/advance`,
        obj
      );

      if (response.status === "success") {
        handleClosAdveModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Attendance has been updated success  fully!",
        }).then(() => {
          const employeeId = selectedEmployee?.user?.id || selectedEmployee?.id;

          if (!employeeId) {
            console.error("Employee ID is missing");
            return;
          }
        });
        window.location.reload();
      } else {
        handleClosAdveModal();
        throw new Error(
          response.error?.message || "Failed to update attendance"
        );
      }
    } catch (error) {
      handleClosAdveModal();
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
      <MonthPicker onDateChange={handleDateChange} />
      <div className="mt-10 mb-10">
        <div className="pageTitle">Salary Calculations</div>

        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
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
                  Attendance (%)
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Advance
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Total Fines
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Basic Salary
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Payable Salary
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Advance Payment
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  Update Attendence
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left">
                  View Slip
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      {Array.from({ length: 9 }).map((_, colIndex) => (
                        <td key={colIndex} className="py-5 px-4">
                          <Skeleton variant="rectangular" height={30} />
                        </td>
                      ))}
                    </tr>
                  ))
                : employeeList.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-5 px-4">{index + 1}</td>
                      <td className="py-5 px-4">{row?.user?.name}</td>
                      <td className="py-5 px-4">{row.allowance}</td>
                      <td className="py-5 px-4">{row.attendance_per}%</td>
                      <td className="py-5 px-4">{row.adv_paid}</td>
                      <td className="py-5 px-4">{row.total_fines}</td>
                      <td className="py-5 px-4">{row.basic_salary}</td>
                      <td className="py-5 px-4">{row.paid_total_salary}</td>
                      <td className="py-5 px-4">{row.status}</td>
                      <td className="py-5 px-4">
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenAdvModal(row)}
                        >
                          Add
                        </Button>
                      </td>
                      <td className="py-5 px-4">
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenModal(row)}
                        >
                          Update
                        </Button>
                      </td>
                      <td className="py-5 px-4">
                        <Link
                          variant="outlined"
                          href={`/paySlip?id=${row?.user?.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputWithTitle
                  type="text"
                  title="Attendance Percentage"
                  placeholder="Enter attendance percentage (0-100)"
                  value={attendance_per}
                  onChange={(value) => setAttendance(value)}
                  min="0"
                  max="100"
                />
              </Grid>
              <Grid item xs={6}>
                <InputWithTitle
                  type="text"
                  title="Advance Deduction"
                  placeholder="Enter advance Deduction"
                  value={adv_received}
                  onChange={(value) => setAdvRec(value)}
                />
              </Grid>
              <Grid item xs={6}>
                <InputWithTitle
                  type="text"
                  title="Description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(value) => setDescription(value)}
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
          </div>
        </Box>
      </Modal>

      <Modal open={openAdvModal} onClose={handleClosAdveModal}>
        <Box className={styles.modalBox}>
          <div className={styles.modalHead}>
            Add Advance Payment for {selectedEmployee?.user?.name}
          </div>
          <div className={styles.modalContent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputWithTitle
                  type="text"
                  title="Advance Payment"
                  placeholder="Enter Advance Payment"
                  value={adv_paid}
                  onChange={(value) => setAdvPaid(value)}
                  min="0"
                  max="100"
                />
              </Grid>
              <Grid item xs={6}>
                <InputWithTitle
                  type="text"
                  title="Description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
              </Grid>
            </Grid>

            <div className="mt-5">
              <GreenButton
                onClick={handleSubmitAdv}
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

export default withAuth(SalaryCal);
