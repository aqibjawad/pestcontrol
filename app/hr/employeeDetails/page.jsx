"use client";

import React, { useState, useEffect } from "react";
import Contact from "./contact";

import styles from "../../../styles/personalDetails.module.css";

import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

import { useSearchParams } from "next/navigation";

const Page = () => {
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
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}/${id}`);
      setEmployeeList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div>
      {/* Personal Inofrmation */}
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
          <div className={styles.personalHead}>Personal Image</div>

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

      {/* Identification Inofrmation */}
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
          <div className={styles.personalHead}> Health Insurrance </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Health Insurrance</th>
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
    </div>
  );
};

export default Page;
