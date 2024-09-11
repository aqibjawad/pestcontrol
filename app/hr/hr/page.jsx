"use client";

import React from "react";
import styles from "../../../styles/superAdmin/finanaceStyles.module.css";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import DateFilters from "@/components/generic/DateFilters";
import SearchInput from "@/components/generic/SearchInput";
import GreenButton from "@/components/generic/GreenButton";
import { useRouter } from "next/navigation";
import { AppAlerts } from "@/Helper/AppAlerts";

const Page = () => {
  const router = useRouter();
  const alert = new AppAlerts();
  const accountStatement = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="pageTitle"> Employees </div>

          <div className="flex items-center">
            <div className="mr-5">
              <SearchInput />
            </div>
            <GreenButton
              onClick={() => {
                router.push("/hr/employee");
              }}
              title={"Add"}
            />
          </div>
        </div>
        {listTable()}
      </div>
    );
  };

  const salaryCal = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="pageTitle">Salary Calculations</div>

          <div className="flex items-center">
            <div className="mr-5">
              <SearchInput />
            </div>

            <div
              style={{
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
                width: "63px",
                marginRight: "2rem",
              }}
            >
              Filter
            </div>

            <GreenButton title={"Details"} />
          </div>
        </div>

        {salaryTable()}
      </div>
    );
  };

  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientEmail: "ali@gmail.com",
    clientPhone: "0900 78601",
    service: "Pest Control",
    date: "5 May 2024",
    priority: "High",
    status: "Completed",
    teamCaptain: "Babar Azam",
    imageUrl: "/person.png",
  }));

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Photo and Name{" "}
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Email
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Contact
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Passport
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">1</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{row.clientName}</div>
                  <div className={tableStyles.clientEmail}>
                    {row.clientEmail}
                  </div>
                  <div className={tableStyles.clientPhone}>
                    {row.clientPhone}
                  </div>
                </td>
                <td className="py-2 px-4">{"5"}</td>
                <td className="py-2 px-4">{"View Statement"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const salaryTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">
                {" "}
                Sr.{" "}
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                {" "}
                Employee Name{" "}
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Designation
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Attendence
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Comission
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Salary
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">1</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{row.clientName}</div>
                  <div className={tableStyles.clientEmail}>
                    {row.clientEmail}
                  </div>
                  <div className={tableStyles.clientPhone}>
                    {row.clientPhone}
                  </div>
                </td>
                <td className="py-2 px-4">{"5"}</td>
                <td className="py-2 px-4">{"View Statement"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle mb-10">Accounts</div>

      <div className="mt-10 mb-10">{accountStatement()}</div>
      <div className="mt-10 mb-10">{salaryCal()}</div>
    </div>
  );
};

export default Page;
