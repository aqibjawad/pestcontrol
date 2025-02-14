"use client";

import React, { useState, useEffect } from "react";
import { Skeleton, Card, Button } from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { leave } from "@/networkUtil/Constants";

import ApproveModal from "./ApproveModal";
import RejectModal from "./RejectModal";
const EmpLeaves = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [formData, setFormData] = useState({
    start_date: employeeList?.start_date || "",
    end_date: employeeList?.end_date || "",
    total_days: employeeList?.total_days || "",
    remarks: "",
  });

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${leave}`);
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

  const handleApprove = (id) => {
    console.log(`Approved Employee ID: ${id}`);
  };

  const handleReject = (id) => {
    console.log(`Rejected Employee ID: ${id}`);
  };

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
                        {Array(6)
                          .fill(null)
                          .map((_, i) => (
                            <td key={i} className="p-4">
                              <Skeleton variant="rectangular" height={20} />
                            </td>
                          ))}
                      </tr>
                    ))
                  : employeeList.map((employee, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">
                          {employee?.employee?.user?.name}
                        </td>
                        <td className="p-4">{employee?.start_date}</td>
                        <td className="p-4">{employee?.end_date}</td>
                        <td className="p-4">{employee?.total_days}</td>
                        <td className="p-4">{employee?.reason}</td>
                        <td className="p-4 flex gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setApproveModalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setRejectModalOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Approve Modal */}
          <ApproveModal
            open={approveModalOpen}
            handleClose={() => setApproveModalOpen(false)}
            employee={selectedEmployee}
            handleApprove={handleApprove}
          />

          {/* Reject Modal */}
          <RejectModal
            open={rejectModalOpen}
            handleClose={() => setRejectModalOpen(false)}
            employeeId={selectedEmployee?.id}
            handleReject={handleReject}
          />
        </div>
      </Card>
    </div>
  );
};

export default EmpLeaves;
