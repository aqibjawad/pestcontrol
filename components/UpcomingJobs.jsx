import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";
import SearchInput from "../components/generic/SearchInput";
import GreenButton from "../components/generic/GreenButton";
import DateFilters from "./generic/DateFilters";

const UpcomingJobs = ({
  jobsList,
  employeeList,
  handleDateChange,
  isLoading,
  employeeCompany,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const isDashboard = pathname.includes("/superadmin/dashboard");

  useEffect(() => {
    // Debug logs
    console.log("JobsList received:", jobsList);
    console.log("EmployeeList received:", employeeList);

    if (!jobsList || !employeeList) {
      console.log("Warning: Missing data", {
        hasJobsList: !!jobsList,
        hasEmployeeList: !!employeeList,
      });
      return;
    }

    // Filter jobs based on search
    const filtered = jobsList.filter((job) =>
      job?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Filtered jobs:", filtered);

    const limitedJobs = isDashboard ? filtered?.slice(0, 10) : filtered;
    setFilteredJobs(limitedJobs);

    // Filter employees
    const filteredEmps = employeeList.filter((emp) =>
      emp?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Filtered employees:", filteredEmps);
    setFilteredEmployees(filteredEmps);

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [searchTerm, jobsList, employeeList, isDashboard]);

  const showLoading = loading || isLoading;

  const assignedJob = () => {
    router.push("/operations/assignJob");
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Debug rendering
  console.log("Current render state:", {
    showLoading,
    filteredJobsLength: filteredJobs?.length,
    filteredEmployeesLength: filteredEmployees?.length,
  });

  const jobTable = () => {
    // Add debug check
    if (!filteredJobs?.length) {
      return (
        <div className="p-4 text-center text-gray-500">
          No jobs data available to display
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
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
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Assigned Employee
              </th>
            </tr>
          </thead>
          <tbody>
            {showLoading
              ? [...Array(5)].map((_, index) => (
                  <tr
                    key={`loading-${index}`}
                    className="border-b border-gray-200"
                  >
                    <td className="py-5 px-4">
                      <Skeleton width={50} height={20} />
                    </td>
                    <td className="py-5 px-4">
                      <Skeleton width={150} height={25} />
                      <Skeleton width={120} height={20} />
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
                    <td className="py-2 px-4">
                      <Skeleton width={120} height={20} />
                    </td>
                  </tr>
                ))
              : filteredJobs.map((row, index) => {
                  console.log("Rendering row:", row); // Debug log for each row
                  const assignedEmployee = filteredEmployees.find(
                    (emp) => emp.id === row.captain_id
                  );
                  console.log("Assigned employee for row:", assignedEmployee);

                  return (
                    <tr
                      key={`job-${row.id}`}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 px-4">{row.id}</td>
                      <td className="py-5 px-4">
                        <div className="font-medium">
                          {row?.user?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {row.job_date
                            ? new Date(row.job_date).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {row?.user?.client?.phone_number || "N/A"}
                        </div>
                      </td>
                      <td className="py-2 px-4">{row.job_title || "N/A"}</td>
                      <td className="py-2 px-4">
                        <div
                          className={`px-3 py-1 rounded-full text-sm inline-block
                        ${
                          row.is_completed === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          row.is_completed === 1
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          row.is_completed === 2
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }`}
                        >
                          {row.is_completed === 0 && "Not Started"}
                          {row.is_completed === 1 && "Completed"}
                          {row.is_completed === 2 && "In Progress"}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm inline-block">
                          High
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {!row.captain_id ? (
                          <Link href={`/operations/assignJob?id=${row.id}`}>
                            <GreenButton
                              onClick={assignedJob}
                              title="Assign Job"
                            />
                          </Link>
                        ) : (
                          <span>{assignedEmployee?.name || "N/A"}</span>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {row.is_completed === 1 ? (
                          !row.report ? (
                            <Link href={`/serviceReport?id=${row.id}`}>
                              <GreenButton title="Create Service Report" />
                            </Link>
                          ) : (
                            <Link
                              href={`/serviceRpoertPdf?id=${row?.report?.id}`}
                            >
                              <GreenButton title="View Report" />
                            </Link>
                          )
                        ) : (
                          <Link href={`/viewJob?id=${row.id}`}>
                            <GreenButton title="View Details" />
                          </Link>
                        )}
                      </td>
                      <td className="py-2 px-4">
                        {assignedEmployee ? (
                          <div>
                            <div className="font-medium">
                              {assignedEmployee.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {assignedEmployee.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Not Assigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          {!isDashboard && (
            <div className="flex-grow">
              <h1 className="text-2xl font-bold">Upcoming Jobs</h1>
            </div>
          )}
          <div className="flex">
            <div className={isDashboard ? "" : "mr-5"}>
              <SearchInput onSearch={handleSearch} />
            </div>
            <div className="border border-green-600 rounded-lg h-10 w-[150px] flex items-center">
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
                alt="filter"
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
