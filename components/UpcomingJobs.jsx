"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/upcomingJobsStyles.module.css";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import DateFilters from "./generic/DateFilters";
import APICall from "../networkUtil/APICall";
import { job } from "../networkUtil/Constants";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import * as XLSX from "xlsx";

// PDF styles
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 30,
    alignItems: "center",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    flex: 1,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  dateRange: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    color: "#666666",
  },
});

// Helper functions
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return "Not Started";
    case 1:
      return "Completed";
    case 2:
      return "In Progress";
    default:
      return "Unknown";
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
    Status: getStatusText(job.is_completed),
    Priority: job.priority,
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

// PDF Document Component
const JobsTablePDF = ({ data, startDate, endDate }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Image src="/logo.jpeg" style={pdfStyles.logo} />
        <Text style={pdfStyles.title}>Upcoming Jobs</Text>
        <Text style={pdfStyles.dateRange}>
          {startDate &&
            endDate &&
            `Date Range: ${new Date(
              startDate
            ).toLocaleDateString()} to ${new Date(
              endDate
            ).toLocaleDateString()}`}
        </Text>
      </View>

      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          {[
            "Sr No",
            "Client Name",
            "Firm Name",
            "Job Name",
            "Status",
            "Job Schedule",
            "Team Captain",
          ].map((header) => (
            <View key={header} style={pdfStyles.tableCell}>
              <Text>{header}</Text>
            </View>
          ))}
        </View>
        {data.map((row) => (
          <View key={row.id} style={pdfStyles.tableRow}>
            <View style={pdfStyles.tableCell}>
              <Text>{row.id}</Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>{`${row.job_title}\n${new Date(
                row.job_date
              ).toLocaleDateString()}\n${
                row?.client_address?.area || "No Area"
              }`}</Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>{row?.user?.client?.firm_name}</Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>{row.job_title}</Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>{getStatusText(row.is_completed)}</Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>
                {row.reschedule_dates?.length > 1
                  ? `Reschedule\n${formatDateTime(
                      row.reschedule_dates[row.reschedule_dates.length - 1]
                        .job_date
                    )}`
                  : `Regular${
                      row.reschedule_dates?.[0]?.job_date
                        ? "\n" +
                          formatDateTime(row.reschedule_dates[0].job_date)
                        : ""
                    }`}
              </Text>
            </View>
            <View style={pdfStyles.tableCell}>
              <Text>{row?.captain?.name || "Not Assigned"}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
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

  useEffect(() => {
    if (!jobsList) return;

    const filtered = jobsList.filter((job) => {
      const searchTermLower = searchTerm.toLowerCase();
      const jobTitleMatch = job?.job_title
        ?.toLowerCase()
        .includes(searchTermLower);
      const firmNameMatch = job?.user?.client?.firm_name
        ?.toLowerCase()
        .includes(searchTermLower);
      const areaMatch =
        !selectedArea || job?.client_address?.area === selectedArea;

      return (jobTitleMatch || firmNameMatch) && areaMatch;
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
    if (!value.trim()) {
      setFilteredJobs(jobsList || []);
    }
  };

  const handleJobIdSearch = async () => {
    if (!jobIdInput.trim()) {
      setFilteredJobs(jobsList || []);
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
      setFilteredJobs(jobsList || []);
    }
  };

  const renderJobRows = () =>
    filteredJobs?.map((row, index) => (
      <tr key={row.id} className="border-b border-gray-200">
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
        </td>
        <td>{row?.user?.client?.firm_name}</td>
        <td>{row.job_title}</td>
        <td>
          <div className={styles.statusContainer}>
            {getStatusText(row.is_completed)}
          </div>
        </td>
        <td>
          <div className={styles.statusContainer}>{row.priority}</div>
        </td>
        <td>
          <div className={styles.teamCaptainName}>
            {row.reschedule_dates?.length > 1 ? (
              <span style={{ color: "red", fontSize: "15px" }}>
                <div style={{ textAlign: "center" }}>Reschedule</div>
                <br />
                {formatDateTime(
                  row.reschedule_dates[row.reschedule_dates.length - 1].job_date
                )}
              </span>
            ) : (
              <span style={{ fontSize: "15px" }}>
                Regular
                <br />
                {row.reschedule_dates?.[0]?.job_date &&
                  formatDateTime(row.reschedule_dates[0].job_date)}
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
                  <GreenButton title="Create Service Report" />
                </Link>
              ) : (
                <Link href={`/serviceRpoertPdf?id=${row?.report?.id}`}>
                  <GreenButton title="View Report" />
                </Link>
              )
            ) : (
              <Link href={`/viewJob?id=${row.id}`}>
                <GreenButton title="View Details" />
              </Link>
            )}
          </div>
        </td>
      </tr>
    ));

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

  const isActiveFilter = (filterType) => currentFilter === filterType;

  const renderFilterButtons = () => (
    <>
      <PDFDownloadLink
        document={
          <JobsTablePDF
            data={filteredJobs}
            startDate={startDate}
            endDate={endDate}
          />
        }
        fileName="jobs-table.pdf"
        className="py-2 px-4 rounded text-white ml-3 bg-green-500 hover:bg-green-600"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "PDF")}
      </PDFDownloadLink>
      <button
        style={{ fontSize: "12px" }}
        onClick={() => downloadExcel(filteredJobs)}
        className="py-2 px-4 rounded text-white ml-3 bg-green-500 hover:bg-green-600"
      >
        Excel
      </button>
      <button
        style={{ fontSize: "12px" }}
        onClick={() => downloadCSV(filteredJobs)}
        className="py-2 px-4 rounded text-white ml-3 bg-green-500 hover:bg-green-600"
      >
        CSV
      </button>
      <button
        style={{ fontSize: "12px" }}
        onClick={() => handleFilter("assigned")}
        className={`py-2 px-4 rounded text-white ml-3 ${
          isActiveFilter("assigned") ? "bg-green-700" : "bg-green-500"
        }`}
      >
        Assign
      </button>
      <button
        style={{ fontSize: "12px" }}
        onClick={() => handleFilter("not-assigned")}
        className={`py-2 px-4 rounded text-white ml-5 ${
          isActiveFilter("not-assigned") ? "bg-green-700" : "bg-green-500"
        }`}
      >
        Not Assign
      </button>
    </>
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJobIdSearch();
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className="flex justify-between items-center mb-4">
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

          <SearchInput
            onSearch={handleSearch}
            placeholder="Search by job title"
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
          <div className="mr-2">{renderFilterButtons()}</div>
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
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {[
                "Sr No",
                "Client Name",
                "Firm Name",
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
