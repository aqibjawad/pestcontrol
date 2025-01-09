"use client";
import { useState, useEffect, use } from "react";
import { Skeleton, Switch, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { FaPencil } from "react-icons/fa6";
import Swal from "sweetalert2";
import EmployeeUpdateModal from "../../../components/employeeUpdate";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import { useRouter } from "next/navigation";

const AllEmployees = () => {
  const api = new APICall();
  const router = useRouter();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = [
    { label: "All", value: 0 },
    { label: "HR-Manager", value: 2 },
    { label: "Operations", value: 3 },
    { label: "Office Staff", value: 4 },
    { label: "Sales-Manager", value: 5 },
    { label: "Accountant", value: 6 },
  ];

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    // Filter employees when selectedRole changes
    if (selectedRole === "All") {
      setFilteredEmployees(employeesList);
    } else {
      setFilteredEmployees(
        employeesList.filter((emp) => emp.employee?.profession === selectedRole)
      );
    }
  }, [selectedRole, employeesList]);

  const fetchAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(getAllEmpoyesUrl);
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
    firedAt
  ) => {
    if (firedAt || loading[employeeId]) return;

    const confirmation =
      currentStatus === 1 &&
      (
        await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to fire this employee?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, fire!",
        })
      ).isConfirmed;

    if (currentStatus === 1 && !confirmation) return;

    setLoading((prev) => ({ ...prev, [employeeId]: true }));

    try {
      if (currentStatus === 1) {
        const response = await api.getDataWithToken(
          `${getAllEmpoyesUrl}/fired_at/${employeeId}`
        );
        if (response.status === "success") {
          Swal.fire(
            "Success",
            "Employee has been fired successfully",
            "success"
          );
          fetchAllEmployees();
        }
      } else {
        const response = await api.patchDataWithToken(
          `${getAllEmpoyesUrl}/toggle/${employeeId}`
        );
        if (response.success) {
          setEmployeesList((prevList) =>
            prevList.map((emp) =>
              emp.id === employeeId
                ? { ...emp, is_active: !emp.is_active }
                : emp
            )
          );
        }
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire("Error", "An error occurred while updating status", "error");
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

  const renderSkeleton = () => (
    <div className="flex flex-wrap gap-4 mt-5">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="w-72 p-4 bg-white rounded shadow-md">
          <Skeleton variant="rectangular" height={150} />
          <Skeleton width="60%" className="mt-4" />
          <Skeleton width="80%" />
          <Skeleton width="40%" className="mt-2" />
          <Skeleton width="50%" />
        </div>
      ))}
    </div>
  );

  const addEmployee = () => {
    router.push("/hr/employee/");
  };

  const renderCards = () => (
    <div className="flex flex-wrap gap-4 mt-5">
      {filteredEmployees?.map((employee) => {
        return (
          <div key={employee.id} className="p-4 bg-white rounded shadow-md" style={{minWidth:"250px", maxWidth:"250px"}}>
            <img
              className="w-24 h-24 rounded-full mx-auto"
              src={employee?.employee?.profile_image || "/default-avatar.png"}
              alt={employee.name}
            />
            <div className="text-center mt-4">
              <h3 className="font-semibold text-lg">{employee.name}</h3>
              <p className="text-gray-600">{employee.email}</p>
              <p className="text-gray-600">
                {employee.employee?.phone_number || "N/A"}
              </p>
              <p className="text-gray-400">
                Employee ID : {employee.employee?.id || "N/A"}
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Switch
                checked={employee.is_active === 1}
                onChange={(e) =>
                  handleStatusToggle(e, employee.id, employee.is_active)
                }
                disabled={loading[employee.id]}
                color="primary"
                size="small"
              />
              <Link href={`/hr/employeeDetails?id=${employee.id}`}>
                <span className="text-blue-600 hover:text-blue-800">
                  View Details
                </span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  const professions = [
    "All",
    "HR Manager",
    "Accountant",
    "Operation Manager",
    "Agriculture Engineer",
    "Sales Manager",
    "Pesticides Technician",
    "Sales Officer",
    "Receptionist",
    "Office Boy",
    "Technician helper",
    "Recovery Officer",
    "operation supervisor",
  ];

  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <h1 className="text-xl font-bold">All Employees</h1>
        </div>
        <div>
          <GreenButton onClick={() => addEmployee()} title={"+ Employee"} />
        </div>
      </div>

      <div style={{ maxWidth: "1000px" }}>
        <Tabs
          value={selectedRole}
          onChange={(e, newValue) => setSelectedRole(newValue)}
          indicatorColor="primary"
          textColor="primary"
          className="mt-4"
          variant="scrollable" // Makes the Tabs scrollable
          scrollButtons="auto" // Automatically shows scroll buttons if needed
          aria-label="Scrollable professions tabs"
        >
          {professions.map((role) => (
            <Tab key={role} label={role} value={role} />
          ))}
        </Tabs>
      </div>
      {fetchingData ? renderSkeleton() : renderCards()}

      <EmployeeUpdateModal
        open={open}
        handleClose={handleClose}
        selectedEmployee={selectedEmployee}
      />
      <div className="mt-5"></div>
      <hr />
      <div className="mt-5"></div>
    </div>
  );
};

export default AllEmployees;
