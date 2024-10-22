"use client";

import React, { useState, useEffect } from "react";
import SearchInput from "@/components/generic/SearchInput";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";


const serviceReport = (serviceList) => {
  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          fontSize: "20px",
          fontFamily: "semibold",
          marginBottom: "0.5rem",
        }}
      >
        Services report
      </div>
      {listServiceTable(serviceList)}
    </div>
  );
};

const sales = () => {
  return (
    <div
      style={{
        border: "1px solid #68CC5838",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontFamily: "semibold",
          marginBottom: "-4rem",
        }}
      >
        Sales
      </div>
      <div className="flex">
        <div className="flex-grow"></div>
        <div className="flex">
          <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
            <SearchInput />
          </div>
        </div>
      </div>
      {listSaleTable()}
    </div>
  );
};

const FeedBack = (serviceReportList) => {
  return (
    <div
      style={{
        border: "1px solid #68CC5838",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontFamily: "semibold",
          marginBottom: "-4rem",
        }}
      >
        Feedback
      </div>
      {/* <div className="flex">
        <div className="flex-grow"></div>
        <div className="flex" style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              marginTop: "2rem",
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "100px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            Filters
          </div>
        </div>
      </div> */}
      <div className="mt-20">
        {listeedBackTable(serviceReportList)}
      </div>
    </div>
  );
};

const listSaleTable = () => {
  return (
    ""
  );
};

const listeedBackTable = (serviceReportList) => {
  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Recommendations
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {serviceReportList && serviceReportList.length > 0 ? (
            serviceReportList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4">{row.recommendations_and_remarks}</td>
                <td className="py-2 px-4">{row.for_office_use}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-5 px-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const listServiceTable = (serviceList) => {
  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              {" "}
              Sr.{" "}
            </th>

            <th className="py-5 px-4 border-b border-gray-200 text-left">
              {" "}
              Report.{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {serviceList && serviceList.length > 0 ? (
            serviceList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index+1}</td>
                <td className="py-2 px-4"> View All </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-5 px-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Reports = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setServiceReportList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const [serviceList, setServiceList] = useState(null);

  useEffect(() => {
    getAllJobs();
    getAllServices();
  }, []);

  const getAllJobs = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/service_report/all`);
      setServiceReportList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const getAllServices = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/service_report/all`);
      setServiceReportList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{serviceReport(serviceList)}</div>
      </div>
      <div className="mt-10 mb-10">{sales()}</div>
      <div className="mt-10 mb-10">{FeedBack(serviceReportList)}</div>
    </div>
  );
};

export default Reports;
