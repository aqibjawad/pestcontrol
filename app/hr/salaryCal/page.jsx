"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Modal, Box, Button, Skeleton, Menu, MenuItem } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl, bank } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import styles from "../../../styles/salaryModal.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useRouter } from "next/navigation";
import MonthPicker from "../monthPicker";

import "./index.css";
import Tabs from "./tabs";

import Dropdown2 from "@/components/generic/DropDown2";

// Remove the static import of SalaryPDFGenerator
// import SalaryPDFGenerator from "./salarypdf";

// Instead, use dynamic import only when needed
import dynamic from "next/dynamic";

const SalaryCal = () => {
  // Properly implement dynamic import with ssr: false to prevent server-side rendering
  // This is crucial because React-PDF uses browser-only APIs
  const SalaryPDFGenerator = dynamic(() => import("./salarypdf"), {
    ssr: false,
    loading: () => <p>Loading PDF generator...</p>,
  });

  const api = new APICall();
  const router = useRouter();

  const [refreshComponent, setRefreshComponent] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [attendance_per, setAttendance] = useState("");
  const [paid_salary, setPaidSalary] = useState("");

  const [adv_received, setAdvRec] = useState("");
  const [fine_received, setFineRec] = useState("");
  const [bonus, setBonus] = useState("");

  const [description, setDescription] = useState("");

  const [adv_paid, setAdvPaid] = useState("");

  const [paymentType, setPaymentType] = useState(null);

  const [activeTab, setActiveTab] = useState("cash");

  const [showPDF, setShowPDF] = useState(false);

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
  const [allEmployees, setAllEmployees] = useState();

  // Bank related states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [vat_per, setVat] = useState("");

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
        setAllEmployees(sortedEmployees);
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
    setSearchInput("");
  }, [selectedMonth]);

  useEffect(() => {
    getAllEmployees();
    setSearchInput("");
  }, [refreshComponent]);

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setAttendance(employee.attendance_per || "");
    setAdvRec(employee.adv_received || "");
    setFineRec(employee.fine_received || "");
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

    // Object to send in the API request
    const obj = {
      employee_salary_id: selectedEmployee.id,
      attendance_per: attendance_per,
      adv_received: adv_received,
      description: description || "", // Optional field
      paid_salary: paid_salary,
      transection_type: paymentType,
      fine_received: fine_received,
      payment_type: activeTab,
    };

    if (activeTab === "online") {
      obj.bank_id = selectedBankId;
      obj.transection_id = transactionId;
      obj.vat = vat_per; // Adding VAT field if needed
    }

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/salary/paid`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Record has been updated successfully!",
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
      payment_type: activeTab,
    };

    // For online payment, add additional fields
    if (activeTab === "online") {
      obj.bank_id = selectedBankId;
      obj.transection_id = transactionId;
      obj.vat = vat_per; // Adding VAT field if needed
    }

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

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      const banks = response.data;
      setAllBankList(banks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllBanks();
  }, []);

  const bankOptions = allBanksList?.map((bank) => ({
    value: bank.id,
    label: bank.bank_name,
  }));

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

  const handleEmployeeNameChange = (value) => {
    setSearchInput(value);
    if (value === "") {
      setEmployeeList(allEmployees);
    } else {
      const filteredList = allEmployees.filter((employee) =>
        employee.user?.name.toLowerCase().includes(value.toLowerCase())
      );
      setEmployeeList(filteredList);
    }
  };
  // Common table cell style
  const cellStyle = {
    textAlign: "center",
    padding: "12px 4px",
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
  };

  return (
    <div>
      <GreenButton
        onClick={() => setShowPDF(true)}
        title="Generate PDF Report"
      />

      {/* Only render PDF component when showPDF is true */}
      {showPDF && (
        <Modal
          open={showPDF}
          onClose={() => setShowPDF(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div
            style={{ width: "95%", height: "95%", backgroundColor: "white" }}
          >
            <SalaryPDFGenerator
              data={employeeList}
              selectedMonth={selectedMonth}
            />
          </div>
        </Modal>
      )}
      {/* Salary Table */}
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
                    style={{ width: "5%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Sr.
                  </th>
                  <th
                    style={{
                      width: "20%",
                      textAlign: "left",
                      padding: "12px 4px",
                    }}
                    className="border-b border-gray-200"
                  >
                    <InputWithTitle
                      title={"Employee Name"}
                      placeholder="Filter by Name"
                      value={searchInput}
                      onChange={(value) => {
                        handleEmployeeNameChange(value);
                      }}
                    />
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Allowance
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Other
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Attendance (%)
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Advance
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Fines
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Basic Salary
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Payable Salary
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Paid
                  </th>
                  <th
                    style={{ width: "10%", ...cellStyle }}
                    className="border-b border-gray-200"
                  >
                    Status
                  </th>
                  <th
                    style={{ width: "5%", ...cellStyle }}
                    className="border-b border-gray-200"
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
                          <td
                            style={{ width: "5%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "20%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "10%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                          <td
                            style={{ width: "5%", textAlign: "center" }}
                            className="py-5 px-4"
                          >
                            <Skeleton variant="rectangular" height={30} />
                          </td>
                        </tr>
                      ))
                    : employeeList.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td style={{ width: "5%", ...cellStyle }}>
                            {index + 1}
                          </td>
                          <td
                            style={{
                              width: "20%",
                              textAlign: "left",
                              padding: "12px 4px",
                            }}
                          >
                            {row?.user?.name}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.allowance}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.other}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.attendance_per}%
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.adv_paid}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.total_fines}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.basic_salary}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.payable_salary}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.paid_salary}
                          </td>
                          <td style={{ width: "10%", ...cellStyle }}>
                            {row.status}
                          </td>
                          <td style={{ width: "5%", ...cellStyle }}>
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

      {/* Salary Clculation Modal */}
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
                  value={fine_received}
                  onChange={(value) => setFineRec(value)}
                />
              </Grid>
              <Grid item xs={4}>
                <InputWithTitle
                  type="text"
                  title="Bonus"
                  placeholder="Enter Bonus"
                  value={bonus}
                  onChange={(value) => setBonus(value)}
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
            <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

            {activeTab === "online" && (
              <Grid
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  marginTop: "1rem",
                }}
                container
                spacing={3}
              >
                <Grid item xs={6}>
                  <Dropdown2
                    onChange={handleBankChange}
                    title="Select Bank"
                    options={bankOptions}
                    value={selectedBankId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputWithTitle
                    title={"Transaction Id"}
                    type={"text"}
                    placeholder={"Transaction Id"}
                    onChange={setTransactionId}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <InputWithTitle
                    title={"VAT"}
                    type={"text"}
                    placeholder={"VAT"}
                    onChange={setVat}
                  />
                </Grid>
              </Grid>
            )}

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

      {/* Attendence Update Modal */}
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

      {/* Pay Advance Modal */}
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

            <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

            {activeTab === "online" && (
              <Grid
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  marginTop: "1rem",
                }}
                container
                spacing={3}
              >
                <Grid item xs={6}>
                  <Dropdown2
                    onChange={handleBankChange}
                    title="Select Bank"
                    options={bankOptions}
                    value={selectedBankId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputWithTitle
                    title={"Transaction Id"}
                    type={"text"}
                    placeholder={"Transaction Id"}
                    onChange={setTransactionId}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <InputWithTitle
                    title={"VAT"}
                    type={"text"}
                    placeholder={"VAT"}
                    onChange={setVat}
                  />
                </Grid>
              </Grid>
            )}

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
