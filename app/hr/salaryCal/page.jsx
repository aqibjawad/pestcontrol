"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Button, Skeleton, Menu, MenuItem } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import styles from "../../../styles/salaryModal.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import the three-dots icon

import { useRouter } from "next/navigation";
import MonthPicker from "../monthPicker";
import Link from "next/link";

import "./index.css";
import { MoreVertical } from "lucide-react";

const SalaryCal = () => {
  const api = new APICall();
  const router = useRouter();

  const [refreshComponent, setRefreshComponent] = useState(false);

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [attendance_per, setAttendance] = useState("");
  const [paid_salary, setPaidSalary] = useState("");

  const [adv_received, setAdvRec] = useState("");

  const [description, setDescription] = useState("");

  const [adv_paid, setAdvPaid] = useState("");

  const [paymentType, setPaymentType] = useState(null);

  const handlePaymentType = (type) => {
    setPaymentType(type);
  };

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

  const [openAdvPayModal, setOpenAdvPayModal] = useState(false);

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
  }, [refreshComponent]);

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

  const handleOpenAdvPayModal = (employee) => {
    setAdvPaid(employee.adv_paid || "");
    setSelectedEmployee(employee);
    setOpenAdvPayModal(true);
  };

  const handleClosAdvePayModal = () => {
    setOpenAdvPayModal(false);
    setSelectedEmployee(null);
    setAdvPaid(""); // Reset attendance input
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    // Validation checks
    if (!selectedEmployee?.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select an employee.",
        customClass: {
          container: "swal-container-class", // Add this class
          popup: "swal-popup-class", // Add this class
        },
      });
      setLoadingSubmit(false);
      return;
    }

    if (!attendance_per || attendance_per < 0 || attendance_per > 100) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide a valid attendance percentage between 0 and 100.",
        customClass: {
          container: "swal-container-class",
          popup: "swal-popup-class",
        },
      });
      setLoadingSubmit(false);
      return;
    }

    if (!adv_received || isNaN(adv_received) || adv_received < 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide a valid advance received amount.",
        customClass: {
          container: "swal-container-class",
          popup: "swal-popup-class",
        },
      });
      setLoadingSubmit(false);
      return;
    }

    if (!paid_salary || isNaN(paid_salary) || paid_salary <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please provide a valid paid salary amount.",
        customClass: {
          container: "swal-container-class",
          popup: "swal-popup-class",
        },
      });
      setLoadingSubmit(false);
      return;
    }

    if (!paymentType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a payment type.",
        customClass: {
          container: "swal-container-class",
          popup: "swal-popup-class",
        },
      });
      setLoadingSubmit(false);
      return;
    }

    // Object to send in the API request
    const obj = {
      employee_salary_id: selectedEmployee.id,
      attendance_per: attendance_per,
      adv_received: adv_received,
      description: description || "", // Optional field
      paid_salary: paid_salary,
      transection_type: paymentType,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/salary/paid`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Attendance has been updated successfully!",
          customClass: {
            popup: "my-custom-popup-class",
          },
        }).then(() => {
          const employeeId = selectedEmployee?.user?.id || selectedEmployee?.id;

          const employeeMonth = selectedEmployee?.month;
          if (!employeeId) {
            console.error("Employee ID is missing");
            return;
          }
          router.push(`/paySlip?id=${employeeId}&month=${employeeMonth}`);
        });
      } else {
        throw new Error(
          response.error?.message || "Failed to update attendance"
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
        customClass: {
          popup: "my-custom-popup-class",
        },
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [attendance, setAttendancePer] = useState("");

  const handleAttendanceChange = (value) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Ensure value is between 0 and 100
    if (
      numericValue === "" ||
      (parseFloat(numericValue) >= 0 && parseFloat(numericValue) <= 100)
    ) {
      setAttendancePer(numericValue);
    }
  };

  const handleSubmitAdv = async () => {
    if (!selectedEmployee || !attendance) return; // Ensure required fields are provided

    setLoadingSubmit(true);
    try {
      // Append `adv_paid` to the URL
      const attendancePercentage = attendance; // Percentage value
      const apiUrl = `${getAllEmpoyesUrl}/salary/set_salary_on_per/${selectedEmployee.id}/${attendancePercentage}`;

      const response = await api.getDataWithToken(apiUrl);

      handleClosAdveModal();
      setRefreshComponent((prev) => !prev);
    } catch (error) {
      handleClosAdveModal();
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleAdvPaid = (event) => {
    setAdvPaid(event.target.value);
  };

  const handleAdvePay = async () => {
    setLoadingSubmit(true);

    // Object to send in the API request
    const obj = {
      employee_salary_id: selectedEmployee.id,
      adv_paid: adv_paid,
      description: description || "", // Optional field
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/salary/advance`,
        obj
      );

      if (response.status === "success") {
        setRefreshComponent((prev) => !prev);
        handleClosAdvePayModal();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Attendance has been updated successfully!",
          customClass: {
            popup: "my-custom-popup-class",
          },
        }).then(() => {
          const employeeId = selectedEmployee?.user?.id || selectedEmployee?.id;
          if (!employeeId) {
            console.error("Employee ID is missing");
            return;
          }
          // router.push(`/paySlip?id=${employeeId}`);
        });
      } else {
        throw new Error(
          response.error?.message || "Failed to update attendance"
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unexpected error occurred",
        customClass: {
          popup: "my-custom-popup-class",
        },
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleAction = (action) => {
    if (selectedRow) {
      switch (action) {
        case "updateAttendance":
          handleOpenAdvModal(selectedRow);
          break;
        case "addAdvance":
          handleOpenAdvPayModal(selectedRow);
          break;
        case "pay":
          handleOpenModal(selectedRow);
          break;
        case "viewSlip":
          window.location.href = `/paySlip?id=${selectedRow?.user?.id}&month=${selectedRow?.month}`;
          break;
        default:
          break;
      }
    }
    handleClose();
  };

  useEffect(() => {
    if (selectedEmployee?.payable_salary) {
      setPaidSalary(selectedEmployee.payable_salary);
    }

    if (selectedEmployee?.adv_paid) {
      setAdvRec(selectedEmployee.adv_paid);
    }
  }, [selectedEmployee]);

  return (
    <div>
      <div className="mt-10 mb-10">
        <div className="pageTitle">Salary Calculations</div>
        <div className="mt-5"></div>
        <MonthPicker onDateChange={handleDateChange} />
        <div className="mt-5"></div>
        <div className={tableStyles.tableContainer}>
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "500px",
            }}
          >
            {/* Fixed Header Table */}
            <table
              className="min-w-full bg-white"
              style={{ tableLayout: "fixed" }}
            >
              <thead>
                <tr>
                  <th
                    style={{ width: "5%" }}
                    className="py-5 px-4 border-b border-gray-200 text-left"
                  >
                    Sr.
                  </th>
                  <th
                    style={{ width: "20%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Employee Name
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Allowance
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Attendance (%)
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Advance
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Fines
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Basic Salary
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Payable Salary
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Paid
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Status
                  </th>

                  <th
                    style={{ width: "5%" }}
                    className="py-2 px-4 border-b border-gray-200 text-left"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable Body Table */}
            <div style={{ overflowY: "auto", maxHeight: "500px" }}>
              <table
                className="min-w-full bg-white"
                style={{ tableLayout: "fixed" }}
              >
                <tbody>
                  {fetchingData
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "20%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                        </tr>
                      ))
                    : employeeList.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%" }} className="py-5 px-4">
                            {index + 1}
                          </td>
                          <td style={{ width: "20%" }} className="py-5 px-4">
                            {row?.user?.name}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.allowance}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.attendance_per}%
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.adv_paid}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.total_fines}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.basic_salary}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.payable_salary}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.paid_salary} {/* New Paid column */}
                          </td>
                          <td style={{ width: "10%" }} className="py-5 px-4">
                            {row.status}
                          </td>

                          <td style={{ width: "5%" }} className="py-5 px-4">
                            <Button
                              aria-controls={`actions-menu-${row?.user?.id}`}
                              aria-haspopup="true"
                              onClick={(event) => handleClick(event, row)}
                              style={{ minWidth: "auto", padding: "6px" }}
                            >
                              <MoreVertIcon />
                            </Button>
                            <Menu
                              id={`actions-menu-${row?.user?.id}`}
                              anchorEl={anchorEl}
                              open={
                                Boolean(anchorEl) &&
                                selectedRow?.user?.id === row?.user?.id
                              }
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() => handleAction("updateAttendance")}
                              >
                                Update Attendance
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleAction("addAdvance")}
                              >
                                Add Advance
                              </MenuItem>
                              <MenuItem onClick={() => handleAction("pay")}>
                                Pay
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleAction("viewSlip")}
                              >
                                View Slip
                              </MenuItem>
                            </Menu>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        style={{ zIndex: 1000 }}
      >
        <Box className={styles.modalBox}>
          <div className={styles.modalHead}>
            Update Salary for {selectedEmployee?.user?.name}
          </div>
          <div className={styles.modalContent}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Amount to be Paid"
                  placeholder="Enter Amount"
                  value={paid_salary}
                  onChange={(value) => setPaidSalary(value)}
                  helperText={`Payable Salary: ${selectedEmployee?.payable_salary}`}
                />
              </Grid>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Attendance Percentage"
                  placeholder="Enter attendance percentage (0-100)"
                  value={attendance_per}
                  onChange={(value) => setAttendance(value)}
                />
              </Grid>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Advance Deduction"
                  placeholder="Enter advance Deduction"
                  value={adv_received}
                  onChange={(value) => setAdvRec(value)}
                  helperText={`Payable Salary: ${selectedEmployee?.adv_paid}`}
                />
              </Grid>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Fine Deduction"
                  placeholder="Enter Fine to b deducted"
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
              </Grid>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(value) => setDescription(value)}
                />
              </Grid>

              <Grid item xs={4}>
                <div className="mt-5 flex gap-4">
                  <button
                    onClick={() => handlePaymentType("wps")}
                    className={`${styles.paymentButton} ${
                      paymentType === "wps" ? styles.selected : ""
                    }`}
                  >
                    WPS
                  </button>
                  <button
                    onClick={() => handlePaymentType("cash")}
                    className={`${styles.paymentButton} ${
                      paymentType === "cash" ? styles.selected : ""
                    }`}
                  >
                    Cash
                  </button>
                </div>
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
            Update Attendence for {selectedEmployee?.user?.name}
          </div>
          <div className={styles.modalContent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter attendance (0-100)"
                  value={attendance}
                  onChange={(e) => handleAttendanceChange(e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
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

      <Modal open={openAdvPayModal} onClose={handleClosAdvePayModal}>
        <Box className={styles.modalBox}>
          <div className={styles.modalHead}>
            Add Advance for {selectedEmployee?.user?.name}
          </div>
          <div className={styles.modalContent}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter attendance (0-100)"
                  value={adv_paid}
                  onChange={handleAdvPaid}
                />
              </Grid>
            </Grid>

            <div className="mt-5">
              <GreenButton
                onClick={handleAdvePay}
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

      {/* Add these styles to your CSS file */}
      <style jsx global>{`
        .swal-container-class {
          z-index: 1500 !important; // Higher z-index for error modals
        }

        .swal-popup-class {
          z-index: 1500 !important; // Higher z-index for error modals
        }
      `}</style>
    </div>
  );
};

export default withAuth(SalaryCal);
