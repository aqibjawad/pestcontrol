import { useState, useEffect } from "react";
import { Skeleton, Switch, Tabs, Tab, Select, MenuItem } from "@mui/material";
import Link from "next/link";
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
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [branches, setBranches] = useState([
    { id: "All", name: "All Branches" },
  ]);

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

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (employeesList?.length > 0) {
      const uniqueBranches = [
        ...new Set(employeesList?.map((emp) => emp.branch?.id)),
      ]
        .filter((id) => id !== undefined)
        .map((id) => {
          const branch = employeesList?.find(
            (emp) => emp.branch?.id === id
          )?.branch;
          return { id: branch.id, name: branch.name };
        });
      setBranches([{ id: "All", name: "All Branches" }, ...uniqueBranches]);
    }
  }, [employeesList]);

  useEffect(() => {
    let branchFiltered = employeesList;
    if (selectedBranch !== "All") {
      branchFiltered = employeesList.filter(
        (emp) => emp.branch?.id === selectedBranch
      );
    }

    if (selectedRole === "All") {
      setFilteredEmployees(branchFiltered);
    } else {
      setFilteredEmployees(
        branchFiltered.filter(
          (emp) => emp.employee?.profession === selectedRole
        )
      );
    }
  }, [selectedRole, selectedBranch, employeesList]);

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

  const addEmployee = () => {
    router.push("/hr/employee/");
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="p-4 bg-white rounded shadow-md">
          <Skeleton variant="rectangular" height={150} />
          <Skeleton width="60%" className="mt-4" />
          <Skeleton width="80%" />
          <Skeleton width="40%" className="mt-2" />
          <Skeleton width="50%" />
        </div>
      ))}
    </div>
  );

  const renderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {filteredEmployees?.map((employee) => (
        <div
          key={employee.id}
          className="p-4 bg-white rounded shadow-md w-full"
        >
          <img
            className="w-24 h-24 rounded-full mx-auto"
            src={employee?.employee?.profile_image || "/Asset 1@2x.png"}
            alt={employee.name}
          />
          <div className="text-center mt-4">
            <h3 className="font-semibold text-lg">{employee.name}</h3>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-gray-600">
              {employee.employee?.phone_number || "N/A"}
            </p>
            <p className="text-gray-400">
              Employee ID: {employee.employee?.id || "N/A"}
            </p>
            <p className="text-gray-400">
              Branch: {employee.branch?.name || "N/A"}
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
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">All Employees</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="min-w-[200px]"
            size="small"
          >
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
          <GreenButton onClick={() => addEmployee()} title="+ Employee" />
        </div>
      </div>

      <div className="mt-4 w-full overflow-x-auto">
        <div className="min-w-full">
          <Tabs
            value={selectedRole}
            onChange={(e, newValue) => setSelectedRole(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Scrollable professions tabs"
          >
            {professions.map((role) => (
              <Tab key={role} label={role} value={role} />
            ))}
          </Tabs>
        </div>
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
