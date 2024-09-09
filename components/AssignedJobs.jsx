import React from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
const AssignedJobs = () => {
  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientEmail: "ali@gmail.com",
    clientPhone: "0900 78601",
    service: "Pest Control",
    date: "5 May 2024",
    priority: "High",
    status: "Completed",
    teamCaptain: "Babar Azam",
  }));

  const jobTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">
                Client Name
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Job Name
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">Date</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Priority
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Captain
              </th>

              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Assigned By
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>{row.clientName}</div>
                  <div className={styles.clientEmail}>{row.clientEmail}</div>
                  <div className={styles.clientPhone}>{row.clientPhone}</div>
                </td>
                <td className="py-2 px-4">{row.service}</td>
                <td className="py-2 px-4">{row.date}</td>
                <td className="py-2 px-4">{row.priority}</td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>{row.status}</div>
                </td>
                <td className="py-2 px-4">
                  <div className={styles.teamCaptainName}>
                    {row.teamCaptain}
                  </div>
                </td>

                <td className="py-2 px-4">
                  <div className={styles.teamCaptainName}>{"Umair"}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.parentContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className="pageTitle">Assigned Jobs</div>
          </div>
          <div className="flex">
            <div className="mr-5">
              <SearchInput />
            </div>
          </div>
        </div>
        {jobTable()}
      </div>
    </div>
  );
};

export default AssignedJobs;
