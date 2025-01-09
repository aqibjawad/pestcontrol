"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/personalDetails.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { Skeleton, CircularProgress } from "@mui/material"; // Import Skeleton from MUI
import Link from "next/link";

import EmpUpcomingJobs from "../jobs/upComing";
import withAuth from "@/utils/withAuth";

import Grid from "@mui/material/Grid";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";

import Tabs from "./tabs";

import { getDocumentsByProfession } from "../../../Helper/documents";

import {
  format,
  differenceInDays,
  differenceInYears,
  isBefore,
  differenceInMonths,
} from "date-fns";

import Swal from "sweetalert2";

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

const Page = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  const [employeeList, setEmployeeList] = useState([]);
  const [employeeCompany, setEmployeeCompany] = useState([]);
  const [employeeDevices, setEmployeeDevices] = useState([]);
  const [activeTab, setActiveTab] = useState("documents"); // State for active tab

  const [empProfession, setEmployeeProfession] = useState([]);
  const requiredDocuments = getDocumentsByProfession(empProfession);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [target, setTarget] = useState("");

  useEffect(() => {
    if (employeeList?.employee?.target) {
      setTarget(employeeList.employee.target);
    }
  }, [employeeList]);

  const handleTargetChange = (name, value) => {
    setTarget(value);
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
    if (urlId) {
      getAllEmployees(urlId);
    }
  }, []);

  const getAllEmployees = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/${employeeId}`
      );
      setEmployeeList(response.data);
      setEmployeeCompany(response.data.captain_all_jobs);
      setEmployeeDevices(response.data.devices);
      setEmployeeProfession(response?.data?.employee?.profession);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderSkeletonRows = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="rectangular" width={80} height={20} />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" width={60} />
        </td>
      </tr>
    ));
  };

  const renderStockSkeletonRows = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
        <td className="p-3 border">
          <Skeleton variant="text" />
        </td>
      </tr>
    ));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getTimeStatus = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    if (isBefore(expiry, currentDate)) {
      const daysExpired = differenceInDays(currentDate, expiry);
      return {
        text: `Expired ${daysExpired} days ago`,
        className: "bg-red-100 text-red-600", // Red for expired
      };
    }

    const yearsRemaining = differenceInYears(expiry, currentDate);
    const monthsRemaining = differenceInMonths(expiry, currentDate) % 12;
    const daysRemaining = differenceInDays(
      expiry,
      new Date(
        currentDate.getFullYear() + yearsRemaining,
        currentDate.getMonth() + monthsRemaining,
        currentDate.getDate()
      )
    );

    let timeText = "";
    if (yearsRemaining > 0) {
      timeText += `${yearsRemaining} year${yearsRemaining > 1 ? "s" : ""} `;
    }
    if (monthsRemaining > 0) {
      timeText += `${monthsRemaining} month${monthsRemaining > 1 ? "s" : ""} `;
    }
    if (daysRemaining > 0) {
      timeText += `${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`;
    }

    return {
      text: timeText.trim() || "0 days remaining",
      className:
        yearsRemaining > 0
          ? "bg-green-100 text-green-600"
          : monthsRemaining > 0 || daysRemaining <= 30
          ? "bg-yellow-100 text-yellow-600"
          : "bg-green-100 text-green-600",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      user_id: id,
      target,
    };

    const response = await api.updateFormDataWithToken(
      `${getAllEmpoyesUrl}/update`,
      obj
    );

    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      });
      window.location.reload();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${response.error.message}`,
      });
    }
  };

  return (
    <div>
      {/* Personal Information */}
      <div className={styles.personalDetailsContainer}>
        <div className={styles.imageContainer}>
          {fetchingData ? (
            <Skeleton variant="circular" width={50} height={50} />
          ) : (
            <img
              className={styles.personalImage}
              src={employeeList?.employee?.profile_image}
              alt="Person"
            />
          )}
        </div>
        <div className={styles.personalName}>
          {fetchingData ? <Skeleton width="60%" /> : employeeList?.name}
        </div>

        <div className={styles.personalContainer}>
          <div className={styles.personalHead}>Personal Information</div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.email
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.phone_number
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.country
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.personalContainer}>
        <div className={styles.personalHead}> Emergency Contact </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Name </th>
                <th> Relation </th>
                <th> Contact </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {fetchingData ? (
                    <Skeleton width="80%" />
                  ) : (
                    employeeList?.employee?.relative_name
                  )}
                </td>
                <td>
                  {fetchingData ? (
                    <Skeleton width="80%" />
                  ) : (
                    employeeList?.employee?.relation
                  )}
                </td>
                <td>
                  {fetchingData ? (
                    <Skeleton width="80%" />
                  ) : (
                    employeeList?.employee?.emergency_contact
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === "documents" && (
        <div className="w-full">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold">Employee Documents</div>
              <Link
                href={`/employeeDoc?id=${employeeList?.id}`}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block text-center"
              >
                Update
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left border">Document Name</th>
                    <th className="p-3 text-left border">Start Date</th>
                    <th className="p-3 text-left border">Expiry Date</th>
                    <th className="p-3 text-left border">Documents</th>
                    <th className="p-3 text-left border">Time Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchingData
                    ? renderSkeletonRows(5)
                    : requiredDocuments.map((docName) => {
                        const doc = employeeList?.employee?.documents.find(
                          (d) => d.name === docName
                        );
                        const userId = employeeList?.employee?.user_id;

                        if (doc) {
                          const timeStatus = getTimeStatus(
                            doc.expiry || doc?.process_date
                          );

                          return (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="p-3 border">{doc.name}</td>
                              <td className="p-3 border">
                                {doc.start
                                  ? format(new Date(doc.start), "dd MMM yyyy")
                                  : "In Process !!"}
                              </td>
                              {/* <td className="p-3 border">
                                {format(
                                  new Date(doc.expiry || doc?.process_date),
                                  "dd MMM yyyy"
                                )}
                              </td> */}
                              <td className="p-3 border">
                                {doc.expiry
                                  ? format(new Date(doc.expiry), "dd MMM yyyy")
                                  : doc?.process_date
                                  ? `${doc.process_date}`
                                  : "-"}
                              </td>
                              <td className="p-3 border">
                                <div className="flex gap-2 items-center">
                                  <a
                                    href={doc?.file}
                                    download
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Download
                                  </a>
                                </div>
                              </td>
                              <td className="p-3 border">
                                <span
                                  className={`px-2 py-1 rounded ${timeStatus.className}`}
                                >
                                  {timeStatus.text}
                                </span>
                              </td>
                              {/* <td className="p-3 border">
                
                              </td> */}
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={docName} className="hover:bg-gray-50">
                              <td className="p-3 border">{docName}</td>
                              <td className="p-3 border">-</td>
                              <td className="p-3 border">-</td>
                              <td className="p-3 border">Missing</td>
                              <td className="p-3 border">
                                <span className="px-2 py-1 rounded bg-red-100 text-red-600">
                                  Missing
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "financial" && (
        <div className={styles.personalContainer}>
          <div className={styles.personalHead}>Financial Information</div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th> Basic Salary </th>
                  <th> Allowance </th>
                  <th> Total Salary </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.basic_salary
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.allowance
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.total_salary
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {employeeList?.employee?.profession === "Sales Manager" && (
              <Grid className="mt-5" container spacing={2}>
                <Grid item lg={8} xs={12} sm={6} md={4}>
                  <InputWithTitle3
                    value={target}
                    onChange={handleTargetChange}
                    title={"Target"}
                  />
                </Grid>
                <Grid className="mt-5" item lg={4} xs={12} sm={6} md={4}>
                  <GreenButton
                    onClick={handleSubmit}
                    title={loadingSubmit ? "" : "Update Target"}
                    disabled={loadingSubmit}
                  >
                    {loadingSubmit ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Update Target"
                    )}
                  </GreenButton>
                </Grid>
              </Grid>
            )}
          </div>
        </div>
      )}

      {activeTab === "stock" && (
        <div className={styles.personalDetailsContainer}>
          <div className={styles.personalContainer}>
            <div className={styles.personalHead}>Stock</div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th> Product Name </th>
                    <th> Total Quantity </th>
                    <th> Remaining Quantity </th>
                    <th> View Details </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchingData ? (
                    renderStockSkeletonRows(3)
                  ) : employeeList.stocks?.length > 0 ? (
                    employeeList.stocks.map((stock) => (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td>{stock?.product?.product_name}</td>
                        <td>{stock.total_qty}</td>
                        <td>{stock.remaining_qty}</td>
                        <td>
                          <Link
                            href={`/stock?id=${encodeURIComponent(
                              employeeList.id
                            )}&product_id=${encodeURIComponent(
                              stock.product_id
                            )}`}
                          >
                            <span className="text-blue-600 hover:text-blue-800">
                              View Details
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-center">
                        No stock information available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className={styles.personalDetailsContainer}>
          <div className={styles.personalContainer}>
            <div className={styles.personalHead}>Jobs</div>
            {fetchingData ? (
              // Render Skeleton while jobs are loading
              <div>
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="rectangular" width="100%" height={200} />
              </div>
            ) : (
              <EmpUpcomingJobs employeeCompany={employeeCompany} />
            )}
          </div>
        </div>
      )}

      {activeTab === "devices" && (
        <div className={styles.personalDetailsContainer}>
          <div className="w-full">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left border">Code No</th>
                      <th className="p-3 text-left border">Device Name</th>
                      <th className="p-3 text-left border">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeDevices && employeeDevices.length > 0 ? (
                      employeeDevices.map((device, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="p-3 border">{device.code_no}</td>
                          <td className="p-3 border">{device.name}</td>
                          <td className="p-3 border">{device.model}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3 text-center border" colSpan="3">
                          No devices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
