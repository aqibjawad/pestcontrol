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
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDashboard = pathname.includes("/superadmin/dashboard");

  useEffect(() => {
    const filtered = jobsList?.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, jobsList, isDashboard]);

  const showLoading = loading || isLoading;

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
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
                <Link href={`/serviceReportPdf?id=${row?.report?.id}`}>
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
        {[...Array(7)].map((_, colIdx) => (
          <td key={colIdx} className="py-2 px-4">
            <Skeleton width={100 + colIdx * 10} height={25} />
          </td>
        ))}
      </tr>
    ));

  const isActiveFilter = (filterType) => currentFilter === filterType;

  const renderFilterButtons = () => (
    <>
      <GreenButton
        title="Assigned"
        onClick={() => handleFilter("assigned")}
        style={{
          backgroundColor: isActiveFilter("assigned") ? "#2c852f" : "#38A73B",
          color: "white",
          marginLeft: "12px",
        }}
      />
      <div className="ml-5">
        <GreenButton
          title="Not Assigned"
          onClick={() => handleFilter("not-assigned")}
          style={{
            backgroundColor: isActiveFilter("not-assigned")
              ? "#2c852f"
              : "#38A73B",
            color: "white",
          }}
        />
      </div>
    </>
  );

  return (
    <div className={styles.parentContainer}>
      <div className="flex justify-between items-center mb-4">
        {!isDashboard && <div className="pageTitle">Upcoming Jobs</div>}
        <div className="flex items-center">
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
