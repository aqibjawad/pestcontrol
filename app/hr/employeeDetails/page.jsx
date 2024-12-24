"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/personalDetails.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material"; // Import Skeleton from MUI
import Link from "next/link";

import EmpUpcomingJobs from "../jobs/upComing";
import withAuth from "@/utils/withAuth";

import { Eye } from "lucide-react";

import Tabs from "./tabs";

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
  const [activeTab, setActiveTab] = useState("documents"); // State for active tab

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

  const requiredDocuments = [
    "Labor Card",
    "Employment Letter",
    "Offer Letter",
    "Joining Letter",
    "Medical Insurance",
    "Driving License",
    "DM Card",
    "EHOC (Emergency Health Operations Certificate)",
    "Visa Status",
    "Asset and Vehicle Policy Confirmation",
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
            <div className="text-xl font-semibold mb-4">Employee Documents</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left border">Document Name</th>
                    <th className="p-3 text-left border">Start Date</th>
                    <th className="p-3 text-left border">Expiry Date</th>
                    <th className="p-3 text-left border">Status</th>
                    <th className="p-3 text-left border">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchingData
                    ? renderSkeletonRows(5)
                    : requiredDocuments.map((docName) => {
                        const doc = employeeList?.employee?.documents.find(
                          (d) => d.name === docName
                        );
                        if (doc) {
                          const currentDate = new Date();
                          const expiryDate = new Date(doc.expiry);
                          const diffTime = expiryDate - currentDate;
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );

                          let status = "Valid";
                          let statusClass = "bg-green-100 text-green-600";

                          if (diffDays < 0) {
                            status = "Expired";
                            statusClass = "bg-red-100 text-red-600";
                          } else if (diffDays <= 10) {
                            status = `Near to Expire (${diffDays} days left)`;
                            statusClass = "bg-red-100 text-red-600";
                          } else if (diffDays <= 30) {
                            status = `Near to Expire (${diffDays} days left)`;
                            statusClass = "bg-yellow-100 text-yellow-600";
                          }

                          return (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="p-3 border">{doc.name}</td>
                              <td className="p-3 border">{doc.start}</td>
                              <td className="p-3 border">{doc.expiry}</td>
                              <td className="p-3 border">
                                <span
                                  className={`px-2 py-1 rounded ${statusClass}`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className="p-3 border">
                                <Link
                                  href={`/employeeDoc?id=${doc.id}`}
                                >
                                  Update
                                </Link>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={docName} className="hover:bg-gray-50">
                              <td className="p-3 border">{docName}</td>
                              <td className="p-3 border">-</td>
                              <td className="p-3 border">-</td>
                              <td className="p-3 border">
                                <span className="px-2 py-1 rounded bg-red-100 text-red-600">
                                  Missing
                                </span>
                              </td>
                              <td className="p-3 border">
                                <Link
                                  href={`/employeeDoc?id=${employeeList.id}`}
                                >
                                  Update
                                </Link>
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
    </div>
  );
};

export default withAuth(Page);
