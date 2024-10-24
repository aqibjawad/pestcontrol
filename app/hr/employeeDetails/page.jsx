"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../styles/personalDetails.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material"; // Import Skeleton from MUI
import Link from "next/link";

import EmpUpcomingJobs from "../jobs/upComing"

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

export default Page;
