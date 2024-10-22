"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import DateFilters from "./generic/DateFilters";

const UpcomingJobs = ({ jobsList, handleDateChange, isLoading }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDashboard = pathname.includes("/superadmin/dashboard");

  useEffect(() => {
    // Update loading state based on both internal loading and API loading
    const filtered = jobsList?.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    // Short timeout to prevent flash of content
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, jobsList, isDashboard]);

  // Show loading state if either internal loading or API loading is true
  const showLoading = loading || isLoading;

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
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Client Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Job Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Service Report
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Assign Job
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                View Details
              </th>
            </tr>
          </thead>
          <tbody>
            {showLoading
              ? [...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-5 px-4">
                      <Skeleton width={150} height={25} />
                      <Skeleton width={120} height={20} />
                      <Skeleton width={100} height={20} />
                    </td>
                    <td className="py-2 px-4">
                      <Skeleton width={120} height={20} />
                    </td>
                    <td className="py-2 px-4">
                      <Skeleton width={100} height={20} />
                    </td>
                    <td className="py-2 px-4">
                      <Skeleton width={100} height={20} />
                    </td>
                    <td className="py-2 px-4">
                      <Skeleton width={100} height={40} />
                    </td>
                    <td className="py-2 px-4">
                      <Skeleton width={100} height={40} />
                    </td>
                  </tr>
                ))
              : filteredJobs?.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td>
                      <div className={styles.clientName}>{row.id}</div>
                    </td>
                    <td className="py-5 px-4">
                      <div className={styles.clientName}>{row?.user?.name}</div>
                      <div className={styles.clientEmail}>
                        {`${new Date(row.job_date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`}
                      </div>
                      <div className={styles.clientPhone}>
                        {row?.user?.client?.phone_number}
                      </div>
                    </td>
                    <td className="py-2 px-4">{row.job_title}</td>
                    <td className="py-2 px-4">
                      <div className={styles.statusContainer}>
                        {row.is_completed === 0 && "Not Started"}
                        {row.is_completed === 1 && "Completed"}
                        {row.is_completed === 2 && "In Progress"}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className={styles.statusContainer}>High</div>
                    </td>
                    <td className="py-2 px-4">
                      <div className={styles.teamCaptainName}>
                        {row.captain_id === null ? (
                          <Link href={`/operations/assignJob?id=${row.id}`}>
                            <GreenButton
                              onClick={assignedJob}
                              title="Assign Job"
                            />
                          </Link>
                        ) : (
                          <span>{row?.captain?.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className={styles.teamCaptainName}>
                        {row.is_completed === 1 ? (
                          row.report === null ? (
                            <Link href={`/serviceReport?id=${row.id}`}>
                              <GreenButton
                                onClick={assignedJob}
                                title="Create Service Report"
                              />
                            </Link>
                          ) : (
                            <Link
                              href={`/serviceRpoertPdf?id=${row?.report?.id}`}
                            >
                              <GreenButton
                                onClick={assignedJob}
                                title="View Report"
                              />
                            </Link>
                          )
                        ) : (
                          <Link href={`/viewJob?id=${row.id}`}>
                            <GreenButton
                              onClick={assignedJob}
                              title="View Details"
                            />
                          </Link>
                        )}
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
        <div className="flex justify-between items-center mb-4">
          {!isDashboard && (
            <div className="flex-grow">
              <div className="pageTitle">Upcoming Jobs</div>
            </div>
          )}
          <div className="flex">
            <div className={isDashboard ? "" : "mr-5"}>
              <SearchInput onSearch={handleSearch} />
            </div>
            <div
              style={{
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
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
              <DateFilters onDateChange={handleDateChange} />
            </div>
          </div>
        </div>
        {jobTable()}
      </div>
    </div>
  );
};

export default UpcomingJobs;
