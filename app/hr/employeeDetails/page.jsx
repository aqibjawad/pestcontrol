"use client";

import React, { useState, useEffect } from "react";
import Contact from "./contact";
import styles from "../../../styles/personalDetails.module.css";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

const getIdFromUrl = (url) => {
  const parts = url.split('?');
  if (parts.length > 1) {
    const queryParams = parts[1].split('&');
    for (const param of queryParams) {
      const [key, value] = param.split('=');
      if (key === 'id') {
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

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Extract id from URL
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllEmployees(urlId);
    }
  }, []);

  const getAllEmployees = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}/${employeeId}`);
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
          <img
            className={styles.personalImage}
            src={employeeList?.employee?.profile_image}
            alt="Person"
          />
        </div>
        <div className={styles.personalName}> {employeeList.name} </div>

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
                  <td> {employeeList.email} </td>
                  <td> {employeeList?.employee?.phone_number} </td>
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
                  <td> {employeeList?.employee?.eid_no} </td>
                  <td> {employeeList?.employee?.eid_start} </td>
                  <td> {employeeList?.employee?.eid_expiry} </td>
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
                  <td> {employeeList?.employee?.passport_no} </td>
                  <td> {employeeList?.employee?.passport_start} </td>
                  <td> {employeeList?.employee?.passport_expiry} </td>
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
                  <td> {employeeList?.employee?.hi_status} </td>
                  <td> {employeeList?.employee?.hi_start} </td>
                  <td> {employeeList?.employee?.hi_expiry} </td>
                  <td> {employeeList?.employee?.dm_card} </td>
                  <td> {employeeList?.employee?.dm_start} </td>
                  <td> {employeeList?.employee?.hi_expiry} </td>
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
                  <td> {employeeList?.employee?.ui_status} </td>
                  <td> {employeeList?.employee?.ui_start} </td>
                  <td> {employeeList?.employee?.ui_expiry} </td>
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
                  <td> {employeeList?.employee?.relative_name} </td>
                  <td> {employeeList?.employee?.relation} </td>
                  <td> {employeeList?.employee?.emergency_contact} </td>
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
                  <td> {employeeList?.employee?.basic_salary} </td>
                  <td> {employeeList?.employee?.allowance} </td>
                  <td> {employeeList?.employee?.total_salary} </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={styles.personalDetailsContainer}>
        <div className={styles.personalContainer}>
          <div className={styles.personalHead}>
            {employeeList?.stocks?.[0]?.product?.product_name}
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Total Quantity</th>
                  <th>Remaining Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {employeeList.stocks?.map((stock) => (
                      <div key={stock.id}>{stock.total_qty}</div>
                    ))}
                  </td>
                  <td>
                    {employeeList.stocks?.map((stock) => (
                      <div key={stock.id}>{stock.remaining_qty}</div>
                    ))}
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

export default Page;