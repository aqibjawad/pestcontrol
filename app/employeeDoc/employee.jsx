"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/personalDetails.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { Skeleton } from "@mui/material";

import withAuth from "@/utils/withAuth";

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

const Employee = () => {
  const api = new APICall();

  const [id, setId] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  const [employeeList, setEmployeeList] = useState([]);

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
    </div>
  );
};

export default withAuth(Employee);
