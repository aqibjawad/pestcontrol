"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/vendorStyles.module.css";
import { getAllEmpoyesUrl } from "../../../networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import { Switch } from "@mui/material";
import { format } from "date-fns";
import Swal from "sweetalert2";

const FiredEmployees = () => {
  const api = new APICall();
  const router = useRouter();
  const [fetchingData, setFetchingData] = useState(false);
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState({}); // Track loading state for each employee

  const handleStatusToggle = async (
    event,
    employeeId,
    currentStatus,
    firedAt,
    employeeName
  ) => {
    event.preventDefault();

    if (firedAt) return; // Prevent action if the employee is already fired
    if (loading[employeeId]) return; // Prevent multiple clicks during loading

    if (currentStatus === 1) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to Reactive again?`,
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
          `${getAllEmpoyesUrl}/reactivate/${employeeId}`
        );

        if (response.status === "success") {
          await Swal.fire({
            title: "Employee Fired",
            text: `${employeeName} has been fired successfully`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          // Reload employee list after firing
          fetchVendors();
        }
      } else {
        // Handle status toggle for reactivation
        const response = await api.getDataWithToken(
          `${getAllEmpoyesUrl}/reactivate/${employeeId}`
        );

        if (response.success) {
          setVendorsData((prevList) =>
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

  const jobTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Fired At
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {vendorsData?.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>{row.name}</div>
                  <div className={styles.clientEmail}>{row.email}</div>
                </td>
                <td className="py-2 px-4">
                  {row.fired_at
                    ? format(new Date(row.fired_at), "yyyy-MM-dd")
                    : "Not Fired"}
                </td>
                <td className="py-2 px-4">
                  <div
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
                    <span style={{ marginLeft: "4px" }}>
                      {row.is_active === 1 ? "Inactive" : "Active"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const fetchVendors = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/fired/get`
      );
      setVendorsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className={styles.parentContainer}>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">Fired Employees</div>
        </div>
      </div>
      {jobTable()}
    </div>
  );
};

export default FiredEmployees;
