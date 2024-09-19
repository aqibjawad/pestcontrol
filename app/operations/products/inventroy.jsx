import React, { useState, useEffect } from "react";

import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import APICall from "@/networkUtil/APICall";
import { product } from "@/networkUtil/Constants";

import { useSearchParams } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Inventory = () => {
  const api = new APICall();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}/${id}`);
      setEmployeeList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientContact: "10",
    quoteSend: "10",
    quoteApproved: "50",
    cashAdvance: "$50,000",
  }));

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Serial Number{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Job Title{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Customer{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Uses{" "}
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Date{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{row.clientName}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientContact}>
                    {row.clientContact}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <img
            src={employeeList?.product_picture}
            style={{ width: "269px", height: "493px", left: "315px" }}
          />
        </div>
        <div className="col-span-6">
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong> Product Name:</strong>
                  </TableCell>
                  <TableCell>{employeeList?.product_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Batch Number:</strong>
                  </TableCell>
                  <TableCell>{employeeList?.batch_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Manufacture Date:</strong>
                  </TableCell>
                  <TableCell>{employeeList?.mfg_date}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Unit:</strong>
                  </TableCell>
                  <TableCell>{employeeList?.unit}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="mt-5">
        <div style={{ fontSize: "20px", color: "#333333" }}>Product uses</div>

        {listTable()}
      </div>
    </div>
  );
};

export default Inventory;
