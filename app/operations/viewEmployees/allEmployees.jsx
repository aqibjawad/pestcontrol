"use client";
import { useState, useEffect } from "react";
import {
  Skeleton,
  Switch,
  Modal,
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import Swal from "sweetalert2";

import { FaPencil } from "react-icons/fa6";

import InputWithTitle3 from "../../../components/generic/InputWithTitle3";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";

import GreenButton from "@/components/generic/GreenButton";

import CircularProgress from "@mui/material/CircularProgress";

const AllEmployees = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState({});

  const [formData, setFormData] = useState({});

  const [eidStart, setEidStart] = useState("");
  const [eidExpiry, setEidExpiry] = useState("");
  const [passportStart, setPassportStart] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [hiStart, setHiStart] = useState("");
  const [hiExpiry, setHiExpiry] = useState("");
  const [uiStart, setUiStart] = useState("");
  const [uiExpiry, setUiExpiry] = useState("");
  const [dmStart, setDmStart] = useState("");
  const [dmExpiry, setDmExpiry] = useState("");
  const [labourCardExpiry, setLabourCardExpiry] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllExpenses();
  }, []);

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleStatusToggle = async (
    event,
    employeeId,
    currentStatus,
    firedAt,
    employeeName
  ) => {
    event.preventDefault();

    if (firedAt) return;

    if (loading[employeeId]) return;

    if (currentStatus === 1) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to fire?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, fire employee!",
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setLoading((prev) => ({ ...prev, [employeeId]: true }));

    try {
      if (currentStatus === 1) {
        const response = await api.getDataWithToken(
          `${getAllEmpoyesUrl}/fired_at/${employeeId}`
        );

        if (response.status === "success") {
          await Swal.fire({
            title: "Employee Fired",
            text: `Employee has been fired successfully`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          window.location.reload();
        }
      } else {
        if (response.success) {
          setEmployeesList((prevList) =>
            prevList.map((employee) =>
              employee.id === employeeId
                ? { ...employee, is_active: currentStatus === 1 ? 0 : 1 }
                : employee
            )
          );
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      await Swal.fire({
        title: "Error",
        text: "There was an error processing your request",
        icon: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [employeeId]: false }));
    }
  };

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white mt-5">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Picture
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Employee Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Employee Designation
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Contact
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Fired
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Update
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseList?.length > 0 ? (
              expenseList?.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                      src={row?.employee?.profile_image}
                      alt="Profile"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{row.name}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{row.email}</div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.employee.phone_number || "null"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div
                      className={tableStyles.clientContact}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Switch
                        checked={row.is_active === 0}
                        onChange={(e) =>
                          handleStatusToggle(e, row.id, row.is_active)
                        }
                        disabled={loading[row.id]}
                        color="primary"
                        size="small"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <Link href={`/hr/employeeDetails?id=${row.id}`}>
                        <span className="text-blue-600 hover:text-blue-800">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      <FaPencil
                        onClick={() => handleOpen(row)} // Pass the current employee data
                        style={{ cursor: "pointer", color: "blue" }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-5 px-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpen = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const [productImage, setProductForImage] = useState();

  const renderSkeleton = () => (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white mt-5">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Picture
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Employee Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Employee Designation
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Contact
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Status
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5).keys()].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">
                <Skeleton width="50px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton variant="circular" width={50} height={50} />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="100px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="100px" height="20px" />
              </td>
              <td className="py-2 px-4">
                <Skeleton width="150px" height="20px" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleFileSelect = (file) => {
    setProfileImage(file);
  };

  const onChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectedEmployee?.employee) {
      setEidStart(selectedEmployee.employee.eid_start || "");
      setEidExpiry(selectedEmployee.employee.eid_expiry || "");
      setPassportStart(selectedEmployee.employee.passport_start || "");
      setPassportExpiry(selectedEmployee.employee.passport_expiry || "");
      setHiStart(selectedEmployee.employee.hi_start || "");
      setHiExpiry(selectedEmployee.employee.hi_expiry || "");
      setUiStart(selectedEmployee.employee.ui_start || "");
      setUiExpiry(selectedEmployee.employee.ui_expiry || "");
      setDmStart(selectedEmployee.employee.dm_start || "");
      setDmExpiry(selectedEmployee.employee.dm_expiry || "");
      setLabourCardExpiry(selectedEmployee.employee.labour_card_expiry || "");
      setProfileImage(selectedEmployee.employee.profile_image || null);
    }
  }, [selectedEmployee]);

  const handleChange = (name, value) => {
    switch (name) {
      case "eid_start":
        setEidStart(value);
        break;
      case "eid_expiry":
        setEidExpiry(value);
        break;
      case "passport_start":
        setPassportStart(value);
        break;
      case "passport_expiry":
        setPassportExpiry(value);
        break;
      case "hi_start":
        setHiStart(value);
        break;
      case "hi_expiry":
        setHiExpiry(value);
        break;
      case "ui_start":
        setUiStart(value);
        break;
      case "ui_expiry":
        setUiExpiry(value);
        break;
      case "dm_start":
        setDmStart(value);
        break;
      case "dm_expiry":
        setDmExpiry(value);
        break;
      case "labour_card_expiry":
        setLabourCardExpiry(value);
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const formData = {
      user_id: selectedEmployee.id,
      eid_start: eidStart,
      eid_expiry: eidExpiry,
      passport_start: passportStart,
      passport_expiry: passportExpiry,
      hi_start: hiStart,
      hi_expiry: hiExpiry,
      ui_start: uiStart,
      ui_expiry: uiExpiry,
      dm_start: dmStart,
      dm_expiry: dmExpiry,
      labour_card_expiry: labourCardExpiry,
      profile_image: profileImage,
    };

    try {
      const response = await api.postFormDataWithToken(
        `${getAllEmpoyesUrl}/update`,
        formData
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        handleClose();
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the data",
      });
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
          <div className="pageTitle">{"All Employees"}</div>
        </div>
      </div>

      {fetchingData ? renderSkeleton() : listServiceTable()}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "57%",
            transform: "translate(-50%, -50%)",
            width: 1300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            {selectedEmployee?.name}
          </Typography>
          <UploadImagePlaceholder
            onFileSelect={handleFileSelect}
            title={"Profile Image"}
            imageUrl={profileImage}
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <InputWithTitle3
                title="EID Start"
                type="date"
                placeholder="EID Start"
                name="eid_start"
                value={eidStart}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="EID End"
                type="date"
                placeholder="EID End"
                name="eid_expiry"
                value={eidExpiry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="Passport Start"
                type="date"
                placeholder="Passport Start"
                name="passport_start"
                value={passportStart}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="Passport End"
                type="date"
                placeholder="Passport End"
                name="passport_expiry"
                value={passportExpiry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="Health Insurance Start"
                type="date"
                placeholder="Health Insurance Start"
                name="hi_start"
                value={hiStart}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="Health Insurance End"
                type="date"
                placeholder="Health Insurance End"
                name="hi_expiry"
                value={hiExpiry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="UnEmployment Start"
                type="date"
                placeholder="UnEmployment Start"
                name="ui_start"
                value={uiStart}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="UnEmployment End"
                type="date"
                placeholder="UnEmployment End"
                name="ui_expiry"
                value={uiExpiry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="DM Card Start"
                type="date"
                placeholder="DM Card Start"
                name="dm_start"
                value={dmStart}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="DM Card Expiry"
                type="date"
                placeholder="DM Card Expiry"
                name="dm_expiry"
                value={dmExpiry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={3}>
              <InputWithTitle3
                title="Labour Card Expiry"
                type="date"
                placeholder="Labour Card Expiry"
                name="labour_card_expiry"
                value={labourCardExpiry}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
            className="mt-5"
          >
            {/* Submit Button */}
            <Grid item lg={6}>
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
            </Grid>
            {/* Close Button */}
            <Grid item lg={6}>
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={handleClose}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default AllEmployees;
