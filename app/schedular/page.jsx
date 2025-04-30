"use client";
import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import SearchInput from "../../components/generic/SearchInput";

const MyCalendar = () => {
  const api = new APICall();
  const router = useRouter();

  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [filteredQuoteList, setFilteredQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewStartDate, setViewStartDate] = useState(null);
  const [viewEndDate, setViewEndDate] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (viewStartDate && viewEndDate) {
      getAllQuotes();
    }
  }, [viewStartDate, viewEndDate]);

  // Set initial dates for first load
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setViewStartDate(firstDay.toISOString().split("T")[0]);
    setViewEndDate(lastDay.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (quoteList?.length > 0) {
      const uniqueAreas = [
        ...new Set(
          quoteList
            .map((job) => job.client_address?.area)
            .filter((area) => area)
        ),
      ];
      setAreas(uniqueAreas);
    }
  }, [quoteList]);

  useEffect(() => {
    let filtered = quoteList;

    // Filter by area
    if (selectedArea !== "all") {
      filtered = filtered.filter(
        (job) => job.client_address?.area === selectedArea
      );
    }

    // Filter by search term (firm name)
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.user?.client?.firm_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tag?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredQuoteList(filtered);
  }, [selectedArea, quoteList, searchTerm]);

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      console.log(`Fetching data from ${viewStartDate} to ${viewEndDate}`);
      const response = await api.getDataWithToken(
        `${job}/all?start_date=${viewStartDate}&end_date=${viewEndDate}`
      );

      console.log("API Response:", response);

      if (response.data && Array.isArray(response.data)) {
        setQuoteList(response.data);
        console.log("Job data loaded:", response.data.length, "items");
      } else if (response.data) {
        // Handle if data is not in expected format
        console.warn("Unexpected data format:", response.data);
        setQuoteList([]);
      } else {
        console.warn("No data received from API");
        setQuoteList([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch jobs",
        icon: "error",
        confirmButtonText: "Ok",
      });
      setQuoteList([]);
    } finally {
      setFetchingData(false);
    }
  };

  // Fixed status functions to match the correct values
  const getStatusColor = (status) => {
    // Convert to number if string
    const statusNum = Number(status);

    switch (statusNum) {
      case 0:
        return "#4CAF50"; // Not Completed
      case 1:
        return "#FF4444"; // Completed
      case 2:
        return "#FFD700"; // In Progress
      default:
        return "#FF4444"; // Default red
    }
  };

  const getStatusText = (status) => {
    // Convert to number if string
    const statusNum = Number(status);

    switch (statusNum) {
      case 0:
        return "Not Completed";
      case 1:
        return "Completed";
      case 2:
        return "In Progress";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;

    // Handle if dateString already has time component
    if (dateString.includes("T") || dateString.includes(" ")) {
      return dateString;
    }

    // Otherwise, add default time
    return `${dateString}T00:00:00`;
  };

  // Update the events mapping function in the MyCalendar component

  const events = filteredQuoteList
    ?.map((job) => {
      try {
        // Use the main job date instead of reschedule date
        let jobDate = job.job_date;

        // Default time if none is provided
        let defaultTime = "09:00:00";

        // Split date and time if needed
        if (jobDate && jobDate.includes(" ")) {
          const [date, time] = jobDate.split(" ");
          jobDate = date;
          defaultTime = time || defaultTime;
        } else if (job.job_start_time) {
          defaultTime = job.job_start_time;
        }

        // Calculate end time (1 hour after start if not provided)
        const endTime =
          job.job_end_time ||
          (() => {
            const [hours, minutes] = defaultTime.split(":");
            return `${String(Number(hours) + 1).padStart(
              2,
              "0"
            )}:${minutes}:00`;
          })();

        // Format dates for FullCalendar
        const startDate = formatDate(jobDate)?.split("T")[0];

        if (!startDate) {
          console.warn("Missing job date for job:", job.id);
          return null;
        }

        return {
          id: job.id,
          title: job.user?.client?.firm_name || "No Client Name",
          start: `${startDate}T${defaultTime}`,
          end: `${startDate}T${endTime}`,
          backgroundColor: getStatusColor(job.is_completed),
          borderColor: getStatusColor(job.is_completed),
          extendedProps: {
            jobData: job,
            originalTime: defaultTime,
          },
          editable: true,
        };
      } catch (error) {
        console.error("Error creating event for job:", job.id, error);
        return null;
      }
    })
    .filter((event) => event !== null); // Remove any null events

  const handleEventDrop = async (info) => {
    const droppedEvent = info.event;
    const originalTime = droppedEvent.extendedProps.originalTime;
    const newDate = format(droppedEvent.start, "yyyy-MM-dd");
    const jobId = droppedEvent.extendedProps.jobData.id;

    try {
      const formData = {
        job_id: jobId,
        job_date: `${newDate} ${originalTime}`,
        reason: "Event rescheduled via calendar",
      };

      const response = await api.postFormDataWithToken(
        `${job}/reschedule`,
        formData
      );

      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          text: "Job rescheduled successfully",
          icon: "success",
          confirmButtonText: "Ok",
        });
        getAllQuotes();
      } else {
        info.revert();
        Swal.fire({
          title: "Error!",
          text: response.error?.message || "Failed to reschedule job",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      info.revert();
      console.error("Error rescheduling job:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while rescheduling the job",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleEventClick = (info) => {
    const eventData = info.event.extendedProps.jobData;
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  const renderEventContent = (eventInfo) => {
    const jobData = eventInfo.event.extendedProps.jobData;
    return (
      <div
        className="p-2 rounded-lg shadow-sm bg-white border hover:shadow-md"
        style={{
          margin: "2px",
          cursor: "pointer",
          borderLeft: `4px solid ${eventInfo.event.backgroundColor}`,
        }}
      >
        <div className="text-xs text-gray-600">
          {jobData?.user?.client?.firm_name || "No Client Name"}
        </div>
        {/* <div className="text-xs text-gray-500">
          {format(
            new Date(eventInfo.event.start),
            "h:mm a"
          )}
        </div> */}
        {/* {jobData.job_title && (
          <div className="text-xs font-semibold mt-1">
            {jobData.job_title}
          </div>
        )} */}
      </div>
    );
  };

  const handleDatesSet = (dateInfo) => {
    const startDate = dateInfo.start.toISOString().split("T")[0];
    const endDate = dateInfo.end.toISOString().split("T")[0];

    // Only update if dates have changed
    if (startDate !== viewStartDate || endDate !== viewEndDate) {
      setViewStartDate(startDate);
      setViewEndDate(endDate);
    }
  };

  const handleRedirect = (jobId) => {
    router.push(`/viewJob/?id=${jobId}`);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "900px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflow: "auto",
  };

  const JobDetailItem = ({ label, value, fullWidth = false }) => (
    <Grid item xs={12} md={fullWidth ? 12 : 6}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          height: "100%",
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body1">{value || "N/A"}</Typography>
      </Paper>
    </Grid>
  );

  return (
    <div className="p-4">
      <div
        style={{ fontWeight: "700", fontSize: "20px", marginBottom: "3rem" }}
      >
        Job Calender
      </div>
      <div className="flex gap-4 mb-4">
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="area-select-label">Select Area</InputLabel>
          <Select
            labelId="area-select-label"
            id="area-select"
            value={selectedArea}
            label="Select Area"
            onChange={handleAreaChange}
          >
            <MenuItem value="all">All Areas</MenuItem>
            {areas.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }}>
          <SearchInput
            title="Search by Firm Name, Tag"
            onSearch={handleSearch}
            placeholder="Search by firm name, Tag"
          />
        </Box>
      </div>

      {/* {fetchingData && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography>Loading calendar events...</Typography>
        </Box>
      )} */}

      {!fetchingData && filteredQuoteList.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">
            No jobs found for this date range
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try adjusting your filters or changing the date range
          </Typography>
        </Box>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        loading={fetchingData}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="job-details-modal"
      >
        <Box sx={modalStyle}>
          {selectedEvent && (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Job Details
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <JobDetailItem
                  label="Client"
                  value={selectedEvent.user?.client?.firm_name}
                />
                <JobDetailItem
                  label="Phone"
                  value={selectedEvent.user?.client?.mobile_number}
                />
                <JobDetailItem
                  label="Job Title"
                  value={selectedEvent.job_title}
                />
                <JobDetailItem
                  label="Address"
                  value={selectedEvent.client_address?.address}
                />
                <JobDetailItem
                  label="Area"
                  value={selectedEvent.client_address?.area}
                />
                <JobDetailItem label="Tag" value={selectedEvent.tag} />
                <JobDetailItem
                  label="Status"
                  value={
                    <Box
                      sx={{
                        bgcolor: getStatusColor(selectedEvent.is_completed),
                        color:
                          selectedEvent.is_completed === 1 ? "white" : "black",
                        py: 0.5,
                        px: 2,
                        borderRadius: 10,
                        display: "inline-block",
                      }}
                    >
                      {getStatusText(selectedEvent.is_completed)}
                    </Box>
                  }
                />
                <JobDetailItem
                  label="Total Amount"
                  value={
                    selectedEvent.grand_total
                      ? `${selectedEvent.grand_total}`
                      : "N/A"
                  }
                />
                <JobDetailItem
                  label="Job Date"
                  value={selectedEvent.job_date}
                />
              </Grid>

              <Box mt={3} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleRedirect(selectedEvent.job_id || selectedEvent.id)
                  }
                >
                  View Details
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyCalendar;
