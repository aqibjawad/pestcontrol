"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import { Skeleton, Card } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { leave } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import withAuth from "@/utils/withAuth";
import MonthPicker from "../monthPicker";
import Link from "next/link";

const EmpLeaves = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${leave}`);

      console.log(response);
      
      setEmployeeList(response);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Employees Leaves</h2>
      <Card sx={{ mb: 4, p: 3 }}>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">Sr.</th>
                  <th className="p-4 text-left">Employee Name</th>
                  <th className="p-4 text-left">Start Date</th>
                  <th className="p-4 text-left">End Date</th>
                  <th className="p-4 text-left">Total Days</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetchingData
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                        <td className="p-4">
                          <Skeleton variant="rectangular" height={20} />
                        </td>
                      </tr>
                    ))
                  : employeeList.map((employee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{employee?.employee?.user?.name}</td>
                        <td className="p-4">{employee?.start_date}</td>
                        <td className="p-4">{employee?.end_date}</td>
                        <td className="p-4">{employee?.total_days}</td>
                        <td className="p-4">{employee?.reason}</td>
                        <td className="p-4">View Details</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmpLeaves;
