"use client";
import { useState, useEffect } from "react";
import { Skeleton, Switch } from "@mui/material";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import Swal from "sweetalert2";
import { FaPencil } from "react-icons/fa6";
import EmployeeUpdateModal from "../../../components/employeeUpdate";

const AllEmployees = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  const handleOpen = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
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
                        onClick={() => handleOpen(row)}
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

  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
          <div className="pageTitle">{"All Employees"}</div>
        </div>
      </div>

      {fetchingData ? renderSkeleton() : listServiceTable()}

      <EmployeeUpdateModal
        open={open}
        handleClose={handleClose}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
};

export default AllEmployees;
