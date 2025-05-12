"use client";

import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import APICall from "@/networkUtil/APICall";
import { clients } from "@/networkUtil/Constants";
import { format } from "date-fns";
import DateFilters from "../../components/generic/DateFilters";

export default function Page() {
  const api = new APICall();
  const [followups, setFollowups] = useState([]);
  const [filteredFollowups, setFilteredFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFollowupData();
  }, [startDate, endDate]);

  // Apply filters whenever followups, statusFilter, or searchTerm changes
  useEffect(() => {
    applyFilters();
  }, [followups, statusFilter, searchTerm]);

  const getFollowupData = async () => {
    setLoading(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${clients}/follow_up/get?${queryParams.join("&")}`
      );

      // Ensure we're setting an array even if the API returns something else
      const responseArray = Array.isArray(response?.data) ? response.data : [];

      setFollowups(responseArray);
    } catch (error) {
      console.error("Error fetching follow-up data:", error);
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...followups];

    // Apply status filter
    if (statusFilter !== "all") {
      const isCompleted = statusFilter === "completed";
      filtered = filtered.filter((item) =>
        isCompleted ? item.completed_at : !item.completed_at
      );
    }

    // Apply search filter (case-insensitive)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        // Search in client name or firm name
        const clientName = item.client_user?.name?.toLowerCase() || "";
        const firmName =
          item.client_user?.client?.firm_name?.toLowerCase() || "";
        return clientName.includes(term) || firmName.includes(term);
      });
    }

    setFilteredFollowups(filtered);
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Delayed":
        return "bg-orange-100 text-orange-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to render skeleton loader rows
  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          <td className="py-4 px-4 border-b border-r text-center">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b border-r">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 border-b">
            <div className="h-4 w-16 bg-gray-200 rounded-full mx-auto"></div>
          </td>
        </tr>
      ));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1
          style={{ fontSize: "20px", fontWeight: "600"}}
        >
          Sales Follow-up Tracking
        </h1>
        <div className="bg-green-500 text-white font-semibold text-base h-11 w-auto px-4 rounded-lg flex justify-center items-center">
          <DateFilters onDateChange={handleDateChange} />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Status Filter Dropdown */}
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="flex-grow max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by client or firm name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b border-r">Sr.</th>
              <th className="py-2 px-4 border-b border-r">Sales Man</th>
              <th className="py-2 px-4 border-b border-r">Firm Name</th>
              <th className="py-2 px-4 border-b border-r">Client Sales Man</th>
              <th className="py-2 px-4 border-b border-r">
                Recovery Person Name
              </th>
              <th className="py-2 px-4 border-b border-r">Follow-up Date</th>
              <th className="py-2 px-4 border-b border-r">
                Next Follow-up Date
              </th>
              <th className="py-2 px-4 border-b border-r">Description</th>
              <th className="py-2 px-4 border-b border-r">Location</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loader when loading
              renderSkeletonRows()
            ) : filteredFollowups.length > 0 ? (
              // Actual data rows when data exists
              filteredFollowups.flatMap((item, index) => {
                // For each follow-up, create rows from its detail entries
                if (
                  item.client_follow_detail_ups &&
                  item.client_follow_detail_ups.length > 0
                ) {
                  return item.client_follow_detail_ups.map(
                    (detail, detailIndex) => (
                      <tr
                        key={`${item.id}-${detail.id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-2 px-4 border-b border-r text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {/* Sales Man name from employee_user object */}
                          {detail.employee_user
                            ? detail.employee_user.name
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {item.client_user
                            ? item.client_user.client?.firm_name
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {item.client_user
                            ? item.client_user.client?.referencable?.name
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {detail.employee_user
                            ? detail.employee_user.name
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {detail.promise_date
                            ? new Date(detail.promise_date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {detail.next_promise_date
                            ? new Date(
                                detail.next_promise_date
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {detail.other || "No description"}
                        </td>
                        <td className="py-2 px-4 border-b border-r">
                          {detail.latitude && detail.longitude ? (
                            <button
                              onClick={() =>
                                openInGoogleMaps(
                                  detail.latitude,
                                  detail.longitude
                                )
                              }
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <MapPin size={16} className="mr-1" />
                              View Location
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.completed_at ? "Completed" : "Pending"
                            )}`}
                          >
                            {item.completed_at ? "Completed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    )
                  );
                } else {
                  // Fallback for items without details
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-r text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b border-r">N/A</td>
                      <td className="py-2 px-4 border-b border-r">
                        {item.client_user && item.client_user.client
                          ? item.client_user.client.firm_name
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-r">
                        {item.client_user &&
                        item.client_user.client?.referencable
                          ? item.client_user.client.referencable.name
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-r">N/A</td>
                      <td className="py-2 px-4 border-b border-r">N/A</td>
                      <td className="py-2 px-4 border-b border-r">N/A</td>
                      <td className="py-2 px-4 border-b border-r">
                        No details available
                      </td>
                      <td className="py-2 px-4 border-b border-r">N/A</td>
                      <td className="py-2 px-4 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.completed_at ? "Completed" : "Pending"
                          )}`}
                        >
                          {item.completed_at ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                }
              })
            ) : (
              // Empty state row when no data
              <tr>
                <td
                  colSpan="10"
                  className="py-10 text-center text-gray-500 border-b"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    <span className="font-medium text-lg">
                      No follow-up data found
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
