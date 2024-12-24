"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import DateFilters from "./generic/DateFilters";

const UpcomingJobs = ({
  jobsList,
  handleDateChange,
  isLoading,
  handleFilter,
  currentFilter,
  isVisible,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueAreas, setUniqueAreas] = useState([]);

  const isDashboard = pathname.includes("/superadmin/dashboard");

  // Extract unique areas from jobsList
  useEffect(() => {
    if (jobsList) {
      const areas = jobsList
        .map((job) => job?.client_address?.area)
        .filter((area) => area !== null && area !== undefined && area !== "")
        .filter((area, index, self) => self.indexOf(area) === index)
        .sort();
      setUniqueAreas(areas || []);
    }
  }, [jobsList]);

  // Filter jobs based on search term and selected area
  useEffect(() => {
    const filtered = jobsList?.filter((job) => {
      const nameMatch = job?.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const areaMatch =
        !selectedArea || job?.client_address?.area === selectedArea;
      return nameMatch && areaMatch;
    });

    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, selectedArea, jobsList, isDashboard]);

  const showLoading = loading || isLoading;

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const renderJobRows = () =>
    filteredJobs?.map((row, index) => (
      <tr key={index} className="border-b border-gray-200">
        <td>{row.id}</td>
        <td>
          <div className={styles.clientName}>{row?.user?.name}</div>
          <div className={styles.clientEmail}>
            {`${new Date(row.job_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`}
          </div>
          <div className={styles.clientPhone}>
            {row?.user?.client?.phone_number}
          </div>
          <div className={styles.clientArea}>
            {row?.client_address?.area || "No Area Specified"}
          </div>
        </td>
        <td>{row.job_title}</td>
        <td>
          <div className={styles.statusContainer}>
            {row.is_completed === 0 && "Not Started"}
            {row.is_completed === 1 && "Completed"}
            {row.is_completed === 2 && "In Progress"}
          </div>
        </td>
        <td>
          <div className={styles.statusContainer}>High</div>
        </td>
        <td>
          <div className={styles.teamCaptainName}>
            {row.reschedule_dates?.length > 1 ? (
              <td>
                <div className={styles.teamCaptainName}>
                  {row.reschedule_dates?.length > 1 ? (
                    <span style={{ color: "red", fontSize: "15px" }}>
                      <div style={{ textAlign: "center" }}> Reschedule </div>
                      <br />
                      {new Date(
                        row.reschedule_dates[
                          row.reschedule_dates.length - 1
                        ].job_date
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span style={{ fontSize: "15px" }}>
                      Regular
                      <br />
                      {new Date(
                        row.reschedule_dates[0].job_date
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </td>
            ) : (
              <span style={{ fontSize: "15px" }}>
                Regular
                <br />
                {row.reschedule_dates?.[0]?.job_date &&
                  new Date(row.reschedule_dates[0].job_date).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
              </span>
            )}
          </div>
        </td>
        <td>
          <div className={styles.teamCaptainName}>
            {row.captain_id === null ? (
              <Link href={`/operations/assignJob?id=${row.id}`}>
                <GreenButton onClick={assignedJob} title="Assign Job" />
              </Link>
            ) : (
              <span>{row?.captain?.name}</span>
            )}
          </div>
        </td>
        <td>
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
                <Link href={`/serviceRpoertPdf?id=${row?.report?.id}`}>
                  <GreenButton onClick={assignedJob} title="View Report" />
                </Link>
              )
            ) : (
              <Link href={`/viewJob?id=${row.id}`}>
                <GreenButton onClick={assignedJob} title="View Details" />
              </Link>
            )}
          </div>
        </td>
      </tr>
    ));

  const renderSkeletonRows = () =>
    [...Array(5)].map((_, index) => (
      <tr key={index} className="border-b border-gray-200">
        {[...Array(8)].map((_, colIdx) => (
          <td key={colIdx} className="py-2 px-4">
            <Skeleton width={100 + colIdx * 10} height={25} />
          </td>
        ))}
      </tr>
    ));

  const isActiveFilter = (filterType) => currentFilter === filterType;

  const renderFilterButtons = () => (
    <>
      <button
        onClick={() => handleFilter("assigned")}
        className={`py-2 px-4 rounded text-white ml-3 ${
          isActiveFilter("assigned") ? "bg-green-700" : "bg-green-500"
        }`}
      >
        Assigned
      </button>
      <button
        onClick={() => handleFilter("not-assigned")}
        className={`py-2 px-4 rounded text-white ml-5 ${
          isActiveFilter("not-assigned") ? "bg-green-700" : "bg-green-500"
        }`}
      >
        Not Assigned
      </button>
    </>
  );

  return (
    <div className={styles.parentContainer}>
      <div className="flex justify-between items-center mb-4">
        {!isDashboard && <div className="pageTitle">Upcoming Jobs</div>}
        <div className="flex items-center">
          <div className="mr-3">
            <select
              value={selectedArea}
              onChange={handleAreaChange}
              className="ml-3 h-10 px-3 border border-green-500 rounded-lg focus:outline-none focus:border-green-700 bg-white"
            >
              <option value="">All Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <SearchInput onSearch={handleSearch} />
          <div className="flex items-center border border-green-500 rounded-lg h-10 w-36 ml-3 px-2 mr-3">
            <img
              src="/Filters lines.svg"
              alt="Filters"
              width={20}
              height={20}
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
          {renderFilterButtons()}
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                "Sr No",
                "Client Name",
                "Job Name",
                "Status",
                "Priority",
                "Job Schedule",
                "Assign Job",
                "View Details",
              ].map((header, index) => (
                <th
                  key={index}
                  className="py-5 px-4 border-b border-gray-200 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{showLoading ? renderSkeletonRows() : renderJobRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingJobs;
