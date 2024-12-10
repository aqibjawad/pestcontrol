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

  const [showImage, setShowImage] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setShowImage(true);
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
          {fetchingData ? <Skeleton width="60%" /> : employeeList.name}
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
                      employeeList.email
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

      {/* Document Information */}
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
                  <th className="p-3 text-left border">Action</th>
                  <th className="p-3 text-left border">Update</th>
                </tr>
              </thead>
              <tbody>
                {employeeList?.employee?.documents.map((doc) => {
                  const currentDate = new Date();
                  const expiryDate = new Date(doc.expiry);
                  const diffTime = expiryDate - currentDate;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days until expiry

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
                        <span className={`px-2 py-1 rounded ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                      </td>
                      <td className="p-3 border">
                        <Link href={`/hr/empDocuments?id=${doc.id}`}>
                          Update
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showImage && selectedDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-4 max-w-4xl w-full">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedDoc.name}</h3>
                  <button
                    onClick={() => setShowImage(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <img
                  src={selectedDoc.file}
                  alt={selectedDoc.name}
                  className=""
                  style={{ height: "100px", width: "100px" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Identification Information */}
      <div>
        <div className={styles.personalContainer}>
          <div className={styles.personalHead}> Identification </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>EID No</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.eid_no
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.eid_start
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.eid_expiry
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.personalContainer}>
          <div className={styles.personalHead}> Passport Details </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Passport No</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.passport_no
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.passport_start
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.passport_expiry
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div>
        <div className={styles.personalContainer}>
          <div className={styles.personalHead}> Health Insurance </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Health Insurance</th>
                  <th>Start Date</th>
                  <th>Expiry Date</th>
                  <th> DM Card</th>
                  <th> Card Start </th>
                  <th> Card Expiry </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.hi_status
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.hi_start
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.hi_expiry
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.dm_card
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.dm_start
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.hi_expiry
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.personalContainer}>
          <div className={styles.personalHead}> Unemployment Insurance </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th> Unemployment Insurance status</th>
                  <th> Start Date </th>
                  <th> Expiry Date </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.ui_status
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.ui_start
                    )}
                  </td>
                  <td>
                    {fetchingData ? (
                      <Skeleton width="80%" />
                    ) : (
                      employeeList?.employee?.ui_expiry
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
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

        <div className={styles.personalContainer}>
          <div className={styles.personalHead}> Financial Information </div>

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
      </div>

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
                {employeeList.stocks?.map((stock) => (
                  <tr key={stock.id}>
                    <td>{stock?.product?.product_name}</td>
                    <td>{stock.total_qty}</td>
                    <td>{stock.remaining_qty}</td>
                    <td>
                      <Link
                        href={`/stock?id=${encodeURIComponent(
                          employeeList.id
                        )}&product_id=${encodeURIComponent(stock.product_id)}`}
                      >
                        <span className="text-blue-600 hover:text-blue-800">
                          View Details
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.personalDetailsContainer}>
        <div className={styles.personalContainer}>
          <div className={styles.personalHead}>Jobs</div>
          <EmpUpcomingJobs employeeCompany={employeeCompany} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
