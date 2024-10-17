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
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import { format } from "date-fns";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Inventory = () => {
  const api = new APICall();
  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState(null);

  const [stockHistory, setStockHistory] = useState(null);
  const [stockBuy, setStockBuy] = useState(null);
  const [stocks, setStocks] = useState(null);

  const [activeTab, setActiveTab] = useState("current");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllEmployees(id);
    }
  }, [id]);

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}/${id}`);
      setEmployeeList(response.data);

      setStockHistory(response.data.assigned_stock_history || []);

      setStockBuy(response.data.purchased_stock_history || []);
      setStocks(response.data.stocks || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const CurrentStockTable = () => (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr No
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Date
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              {" "}
              Person Name{" "}
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              {" "}
              Total Stock{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {fetchingData
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                </tr>
              ))
            : stockHistory?.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>{index + 1}</div>
                  </td>
                  <td className="py-5 px-4">
                    {format(new Date(row.updated_at), "MMMM d, yyyy")}
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row?.person?.name}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row.stock_in}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  const StockHistoryTable = () => (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Date
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Purchase Order Invoice
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Person Name
            </th>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {fetchingData
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton width="100%" height={30} />
                  </td>
                </tr>
              ))
            : stockBuy?.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    {format(new Date(row.updated_at), "MMMM d, yyyy")}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        row.transaction_type === "IN"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row?.purchase_order?.po_id}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className={tableStyles.clientContact}>
                      {row?.purchase_order?.supplier?.supplier_name}
                    </div>
                  </td>
                  <td className="py-2 px-4">{row.quantity}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          {fetchingData ? (
            <Skeleton
              variant="rectangular"
              width={269}
              height={493}
              sx={{ borderRadius: "8px" }}
            />
          ) : (
            <img
              src={employeeList?.product_picture}
              style={{
                width: "200px",
                height: "200px",
                left: "315px",
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div className="col-span-6">
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                {fetchingData ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton width="100%" height={30} />
                      </TableCell>
                      <TableCell>
                        <Skeleton width="100%" height={30} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    <TableRow>
                      <TableCell>
                        <strong>Product Name:</strong>
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
                    <TableRow>
                      <TableCell>
                        <strong>Total Quantity:</strong>
                      </TableCell>
                      <TableCell>
                        {stocks && stocks.length > 0
                          ? stocks[0].total_qty
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Remaining Quantity:</strong>
                      </TableCell>
                      <TableCell>
                        {stocks && stocks.length > 0
                          ? stocks[0].remaining_qty
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div className="mt-5">
        <div style={{ fontSize: "20px", color: "#333333" }}>Product uses</div>

        {/* Tab buttons */}
        <div className="flex gap-4 mb-4 mt-5">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "current"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Assign
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === "history"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Stock Buy
          </button>
        </div>

        {/* Tab content */}
        <div className="mt-5">
          {activeTab === "current" && <CurrentStockTable />}
          {activeTab === "history" && <StockHistoryTable />}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
