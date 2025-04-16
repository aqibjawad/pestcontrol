"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "../../../components/generic/SearchInput";
import GreenButton from "../../../components/generic/GreenButton";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import DateFilters from "../../../components/generic/DateFilters";
import withAuth from "@/utils/withAuth";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";

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

const EmpUpcomingJobs = () => {
  const api = new APICall();

  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingData, setFetchingData] = useState(false);
  const [employeeList, setEmployeeList] = useState(null);
  const [employeeCompany, setEmployeeCompany] = useState([]);
  // Add date filter states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [id, setId] = useState(null);

  const isDashboard = pathname.includes("/superadmin/dashboard");

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

  useEffect(() => {
    // Apply both search and date filters
    let filtered = employeeCompany?.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply date filter if both dates are selected
    if (startDate && endDate) {
      filtered = filtered?.filter((job) => {
        const jobDate = new Date(job.job_date);
        return jobDate >= startDate && jobDate <= endDate;
      });
    }

    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    // Short timeout to prevent flash of content
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, employeeCompany, isDashboard, startDate, endDate]);

  // Show loading state if either internal loading or API loading is true
  const showLoading = loading || fetchingData;

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // In your EmpUpcomingJobs component

  // Make sure your handleDateChange function properly processes the dates from your DateFilters component
  const handleDateChange = (dates) => {
    console.log("Raw dates received:", dates);

    // Check if dates is an object with startDate and endDate properties
    if (dates && dates.startDate && dates.endDate) {
      setStartDate(new Date(dates.startDate));
      setEndDate(new Date(dates.endDate));
      console.log(
        "Date filter set:",
        new Date(dates.startDate),
        new Date(dates.endDate)
      );
    }
    // Check if dates is an array
    else if (Array.isArray(dates) && dates.length === 2) {
      setStartDate(new Date(dates[0]));
      setEndDate(new Date(dates[1]));
      console.log("Date filter set:", new Date(dates[0]), new Date(dates[1]));
    }
    // If dates is a single date object (some date pickers work this way)
    else if (dates instanceof Date) {
      setStartDate(dates);
      setEndDate(dates);
      console.log("Single date filter set:", dates);
    }
    // Handle case where filter is cleared
    else if (!dates) {
      setStartDate(null);
      setEndDate(null);
      console.log("Date filter cleared");
    }
  };

  // Then make sure your filtering logic in useEffect properly handles these dates
  useEffect(() => {
    // First apply search filter
    let filtered = employeeCompany?.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then apply date filter if dates are set
    if (startDate && endDate) {
      console.log("Filtering by date range:", startDate, endDate);
      filtered = filtered?.filter((job) => {
        if (!job.job_date) return false;

        const jobDate = new Date(job.job_date);

        // Debug log to check job dates
        console.log(
          "Job:",
          job.id,
          "Date:",
          jobDate,
          "In range:",
          jobDate >= startDate && jobDate <= endDate
        );

        // Set hours to 0 for reliable date comparison
        const jobDateOnly = new Date(jobDate.setHours(0, 0, 0, 0));
        const startDateOnly = new Date(startDate.setHours(0, 0, 0, 0));
        const endDateOnly = new Date(endDate.setHours(23, 59, 59, 999));

        return jobDateOnly >= startDateOnly && jobDateOnly <= endDateOnly;
      });
      console.log("After date filter, jobs count:", filtered?.length);
    }

    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    // Short timeout to prevent flash of content
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, employeeCompany, isDashboard, startDate, endDate]);

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

export default withAuth(EmpUpcomingJobs);
