"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import { useRouter } from "next/navigation";

const UpcomingJobs = ({ jobsList }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobsList);

  useEffect(() => {
    const filtered = jobsList.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobsList]);

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const jobTable = () => {
    return (
      <div className={styles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Client Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Job Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Priority
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">
                  <div className={styles.clientName}>{row?.user?.name}</div>
                  <div className={styles.clientEmail}>{row.job_date}</div>
                  <div className={styles.clientPhone}>
                    {row?.user?.client?.phone_number}
                  </div>
                </td>
                <td className="py-2 px-4">{row.job_title}</td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>
                    {row.is_completed === "0" && "Not Started"}
                    {row.is_completed === "1" && "Completed"}
                    {row.is_completed === "2" && "In Progress"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={styles.statusContainer}>
                    {row.is_completed === "0" && "Not Service Report"}
                    {row.is_completed === "1" && "Service Report Completed"}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className={styles.teamCaptainName}>
                    <GreenButton onClick={assignedJob} title="Assign Job" />
                  </div>
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
            <div className="pageTitle">Upcoming Jobs</div>
          </div>
          <div className="flex">
            <div className="mr-5">
              <SearchInput onSearch={handleSearch} />
            </div>
          </div>
        </div>
        {jobTable()}
      </div>
    </div>
  );
};

export default UpcomingJobs;
