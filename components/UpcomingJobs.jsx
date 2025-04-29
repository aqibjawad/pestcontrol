"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import DateFilters from "./generic/DateFilters";
import APICall from "../networkUtil/APICall";
import { job } from "../networkUtil/Constants";
import * as XLSX from "xlsx";

// Helper functions
const getStatusInfo = (status) => {
  switch (status) {
    case 0:
      return { text: "Pending", backgroundColor: "red", color: "white" };
    case 1:
      return { text: "Completed", backgroundColor: "", color: "" };
    case 2:
      return { text: "In Progress", backgroundColor: "", color: "" };
    default:
      return { text: "Unknown", backgroundColor: "", color: "" };
  }
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const prepareExportData = (jobs) => {
  return jobs.map((job) => ({
    "Sr No": job.id,
    "Job Title": job.job_title,
    Date: new Date(job.job_date).toLocaleDateString(),
    Area: job?.client_address?.area || "No Area",
    "Firm Name": job?.user?.client?.firm_name,
    Status: getStatusInfo(job.is_completed).text, // Use .text property from getStatusInfo
    Priority: job.priority,
    Tag: job.tag || "No Tag",
    "Job Schedule":
      job.reschedule_dates?.length > 1
        ? `Reschedule - ${formatDateTime(
            job.reschedule_dates[job.reschedule_dates.length - 1].job_date
          )}`
        : `Regular${
            job.reschedule_dates?.[0]?.job_date
              ? " - " + formatDateTime(job.reschedule_dates[0].job_date)
              : ""
          }`,
    "Team Captain": job?.captain?.name || "Not Assigned",
  }));
};

const downloadCSV = (data) => {
  const exportData = prepareExportData(data);
  const headers = Object.keys(exportData[0]);
  const csvContent = [
    headers.join(","),
    ...exportData.map((row) =>
      headers.map((header) => `"${row[header]}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "jobs_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadExcel = (data) => {
  const exportData = prepareExportData(data);
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Jobs");
  XLSX.writeFile(wb, "jobs_data.xlsx");
};

const PDFDownloadButton = dynamic(
  () => import("./PDFComponents").then((mod) => mod.PDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <button className="py-2 px-4 rounded text-black mt-2">
        Loading PDF...
      </button>
    ),
  }
);

const PDFButton = dynamic(
  () => import("./pdfGrouped").then((mod) => mod.GroupedPDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <button className="py-2 px-4 rounded text-black mt-2">
        Loading PDF...
      </button>
    ),
  }
);

const UpcomingJobs = ({
  jobsList,
  handleDateChange,
  isLoading,
  handleFilter,
  currentFilter,
  startDate,
  endDate,
}) => {
  const api = new APICall();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobIdInput, setJobIdInput] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobsList || []);
  const [loading, setLoading] = useState(true);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Changed from a single activeFilter to an array of selected filters
  const [selectedFilters, setSelectedFilters] = useState([]);

  const isDashboard = pathname.includes("/superadmin/dashboard");

  useEffect(() => {
    if (jobsList) {
      setFilteredJobs(jobsList);
    }
  }, [jobsList]);

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

  // Update selected filters when currentFilter changes
  useEffect(() => {
    if (currentFilter) {
      // If the parent sends a currentFilter string, parse it
      const filterArray = currentFilter.includes(",")
        ? currentFilter.split(",")
        : [currentFilter];

      // Update the local state with all filters from the parent
      setSelectedFilters(filterArray);
    }
  }, [currentFilter]);

  useEffect(() => {
    if (!jobsList) return;

    // First apply search and area filters
    let filtered = jobsList.filter((job) => {
      const searchTermLower = searchTerm.toLowerCase();
      const jobTitleMatch = job?.job_title
        ?.toLowerCase()
        .includes(searchTermLower);
      const firmNameMatch = job?.user?.client?.firm_name
        ?.toLowerCase()
        .includes(searchTermLower);
      const tagMatch = job?.tag?.toLowerCase()?.includes(searchTermLower);
      const areaMatch =
        !selectedArea || job?.client_address?.area === selectedArea;

      return (jobTitleMatch || firmNameMatch || tagMatch) && areaMatch;
    });

    // Then apply multiple filters based on selections
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((job) => {
        // Check if job matches ANY of the selected filters
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "assigned":
              return job.captain_id !== null;
            case "not-assigned":
              return job.captain_id === null;
            case "pending":
              return job.is_completed === 0;
            case "completed":
              return job.is_completed === 1;
            default:
              return true;
          }
        });
      });
    }

    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, selectedArea, jobsList, isDashboard, selectedFilters]);

  const showLoading = loading || isLoading;

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      // Reset to current filter state
      applyCurrentFilters(jobsList);
    }
  };

  // Function to apply current filters to the jobs list
  const applyCurrentFilters = (jobs) => {
    if (!jobs) return;

    let filtered = jobs;

    // Apply multiple filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((job) => {
        return selectedFilters.some((filter) => {
          switch (filter) {
            case "assigned":
              return job.captain_id !== null;
            case "not-assigned":
              return job.captain_id === null;
            case "pending":
              return job.is_completed === 0;
            case "completed":
              return job.is_completed === 1;
            default:
              return true;
          }
        });
      });
    }

    setFilteredJobs(isDashboard ? filtered?.slice(0, 10) : filtered);
  };

  const handleJobIdSearch = async () => {
    if (!jobIdInput.trim()) {
      applyCurrentFilters(jobsList);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getDataWithToken(`${job}/${jobIdInput}`);
      setFilteredJobs(response.data ? [response.data] : []);
    } catch (error) {
      console.error("Error fetching job:", error);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    if (!e.target.value) {
      applyCurrentFilters(jobsList);
    }
  };

  const renderJobRows = () => {
    let sortedJobs = [...filteredJobs];

    if (sortField) {
      sortedJobs.sort((a, b) => {
        let valueA, valueB;

        switch (sortField) {
          case "clientName":
            valueA = a.job_title?.toLowerCase() || "";
            valueB = b.job_title?.toLowerCase() || "";
            break;
          case "firmName":
            valueA = a.user?.client?.firm_name?.toLowerCase() || "";
            valueB = b.user?.client?.firm_name?.toLowerCase() || "";
            break;
          case "status":
            valueA = getStatusInfo(a.is_completed).text;
            valueB = getStatusInfo(b.is_completed).text;
            break;
          default:
            return 0;
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedJobs.map((row, index) => (
      <tr key={index} className="border-b border-gray-200">
        <td>{index + 1}</td>
        <td>{row.id}</td>
        <td>
          <div className={styles.clientName}>Job Title: {row.job_title}</div>
          <div className={styles.clientEmail}>
            {new Date(row.job_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className={styles.clientArea}>
            {row?.client_address?.area || "No Area Specified"}
          </div>
          {row.tag && <div className={styles.clientTag}>Tag: {row.tag}</div>}
        </td>
        <td>{row?.user?.client?.firm_name}</td>
        <td>
          {row.job_services
            ?.map((js) => js.service?.service_title)
            .filter(Boolean)
            .join(", ")}
        </td>

        <td>
          <div
            className={styles.statusContainer}
            style={{
              backgroundColor: getStatusInfo(row.is_completed).backgroundColor,
              color: getStatusInfo(row.is_completed).color,
            }}
          >
            {getStatusInfo(row.is_completed).text}
          </div>
        </td>
        <td>
          <div className={styles.statusContainer}>{row.priority}</div>
        </td>
        <td>
          <div>
            {row.reschedule_dates?.length > 1 ? (
              <div
                style={{ color: "red", fontSize: "12px", textAlign: "center" }}
              >
                <div style={{ textAlign: "center" }}>Reschedule</div>
                <br />
                {formatDateTime(
                  row.reschedule_dates[row.reschedule_dates.length - 1].job_date
                )}
              </div>
            ) : (
              <div style={{ fontSize: "12px", textAlign: "center" }}>
                Regular
                <br />
                {row.reschedule_dates?.[0]?.job_date &&
                  formatDateTime(row.reschedule_dates[0].job_date)}
              </div>
            )}
          </div>
        </td>
        <td>
          <div style={{ color: "red", fontSize: "12px", textAlign: "center" }}>
            {row.captain_id === null ? (
              <Link href={`/operations/assignJob?id=${row.id}`}>
                Assign Job
              </Link>
            ) : (
              <span>{row?.captain?.name}</span>
            )}
          </div>
        </td>

        <td>
          <div style={{ fontSize: "12px", textAlign: "center" }}>
            {row.is_completed === 1 ? (
              <Link
                href={
                  row.report !== null
                    ? `/serviceRpoertPdf?id=${row?.report?.id}`
                    : "#"
                }
                style={{
                  color: row.report !== null ? "blue" : "gray",
                  pointerEvents: row.report !== null ? "auto" : "none",
                  textDecoration: row.report !== null ? "underline" : "none",
                  cursor: row.report !== null ? "pointer" : "not-allowed",
                }}
              >
                Send Email
              </Link>
            ) : (
              <Link
                href={
                  row.report !== null
                    ? `/serviceRpoertPdf?id=${row?.report?.id}`
                    : "#"
                }
                style={{
                  color: row.report !== null ? "blue" : "gray",
                  pointerEvents: row.report !== null ? "auto" : "none",
                  textDecoration: row.report !== null ? "underline" : "none",
                  cursor: row.report !== null ? "pointer" : "not-allowed",
                }}
              >
                Send Email
              </Link>
            )}
          </div>
        </td>

        <td>
          <div
            style={{ color: "#32A92E", textAlign: "center", fontSize: "12px" }}
          >
            {row.is_completed === 1 ? (
              row.report === null ? (
                <Link href={`/serviceReport?id=${row.id}`}>
                  Create Service Report
                </Link>
              ) : (
                <Link href={`/serviceReportPdf?id=${row?.report?.id}`}>
                  View Report
                </Link>
              )
            ) : (
              <Link href={`/viewJob?id=${row.id}`}>View Details</Link>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  const renderSkeletonRows = () =>
    [...Array(5)].map((_, index) => (
      <tr key={index} className="border-b border-gray-200">
        {[...Array(9)].map((_, colIdx) => (
          <td key={colIdx} className="py-2 px-4">
            <Skeleton width={100 + colIdx * 10} height={25} />
          </td>
        ))}
      </tr>
    ));

  // Function to check if a filter is active
  const isFilterSelected = (filterType) => selectedFilters.includes(filterType);

  // Modified function to handle checkbox clicking
  const handleFilterToggle = (filterType) => {
    // Make a copy of the current selectedFilters array
    let updatedFilters = [...selectedFilters];

    if (isFilterSelected(filterType)) {
      // Remove the filter if it's already selected
      updatedFilters = updatedFilters.filter((filter) => filter !== filterType);
    } else {
      // Add the filter if it's not selected
      updatedFilters.push(filterType);
    }

    // Update the local state with the new filters array
    setSelectedFilters(updatedFilters);

    // Call the parent component's handler with a comma-separated string of all filters
    if (handleFilter) {
      handleFilter(updatedFilters.length > 0 ? updatedFilters.join(",") : "");
    }
  };

  // Function to reset all filters
  const clearAllFilters = () => {
    setSelectedFilters([]);
    if (handleFilter) {
      handleFilter("");
    }
    setIsFilterOpen(false);
  };

  const RenderDownloadOptions = () => {
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => {
            setIsDownloadOpen(!isDownloadOpen);
            setIsFilterOpen(false); // Close other dropdown
          }}
          className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
        >
          Download Options
        </button>

        {isDownloadOpen && (
          <>
            <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                <div className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mt-2">
                  <PDFDownloadButton
                    filteredJobs={filteredJobs}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>

                <div className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <PDFButton
                    filteredJobs={filteredJobs}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
                <button
                  onClick={() => {
                    downloadExcel(filteredJobs);
                    setIsDownloadOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 mt-2"
                >
                  Excel
                </button>
              </div>
            </div>

            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsDownloadOpen(false)}
            ></div>
          </>
        )}
      </div>
    );
  };

  const RenderFilterOptions = () => {
    // Create an array of filter types
    const filterTypes = [
      { id: "assigned", label: "Assigned" },
      { id: "not-assigned", label: "Not Assigned" },
      { id: "pending", label: "Pending" },
      { id: "completed", label: "Completed" },
    ];

    return (
      <div className="relative inline-block text-left ml-3">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsDownloadOpen(false); // Close other dropdown
          }}
          className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
        >
          Filter Options{" "}
          {selectedFilters.length > 0 ? `(${selectedFilters.length})` : ""}
        </button>

        {isFilterOpen && (
          <>
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu">
                {filterTypes.map((filter) => (
                  <div
                    key={filter.id}
                    className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
                      isFilterSelected(filter.id)
                        ? "bg-green-100 text-green-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <input
                      type="checkbox"
                      id={`filter-${filter.id}`}
                      checked={isFilterSelected(filter.id)}
                      readOnly
                      className="mr-2 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor={`filter-${filter.id}`}
                      className="cursor-pointer flex-grow"
                    >
                      {filter.label}
                    </label>
                  </div>
                ))}

                {selectedFilters.length > 0 && (
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={clearAllFilters}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsFilterOpen(false)}
            ></div>
          </>
        )}
      </div>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJobIdSearch();
    }
  };

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center flex-wrap">
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

          <SearchInput
            onSearch={handleSearch}
            placeholder="Search Firm Name / Job Title / Tag"
          />
          <div className="flex items-center border border-green-500 rounded-lg h-10 w-36 ml-3 px-2 mr-3">
            <img
              src="/Filters lines.svg"
              alt="Filters"
              width={20}
              height={20}
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={jobIdInput}
              onChange={(e) => setJobIdInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter job ID"
              className="h-10 px-3 border border-green-500 rounded-lg focus:outline-none focus:border-green-700"
            />
            <button
              onClick={handleJobIdSearch}
              className="ml-2 h-10 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Search
            </button>
          </div>

          <div className="ml-5 flex mt-2 sm:mt-0">
            {RenderDownloadOptions()}
            {RenderFilterOptions()}
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                { id: "srNo", label: "Sr No" },
                { id: "jobId", label: "Job Id" },
                { id: "clientName", label: "Client Name", sortable: true },
                { id: "firmName", label: "Firm Name", sortable: true },
                { id: "jobName", label: "Service Name" },
                { id: "status", label: "Status", sortable: true },
                { id: "priority", label: "Priority" },
                { id: "jobSchedule", label: "Job Schedule" },
                { id: "assignJob", label: "Assign Job" },
                { id: "viewDetails", label: "Send Email" },
                { id: "printDetails", label: "View Details" },
              ].map((header) => (
                <th
                  key={header.id}
                  className={`py-5 px-4 border-b border-gray-200 text-left ${
                    header.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                  onClick={
                    header.sortable ? () => handleSort(header.id) : undefined
                  }
                >
                  <div className="flex items-center">
                    {header.label}
                    {header.sortable && (
                      <span className="ml-2">
                        {sortField === header.id
                          ? sortDirection === "asc"
                            ? "▲"
                            : "▼"
                          : "⇵"}
                      </span>
                    )}
                  </div>
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
