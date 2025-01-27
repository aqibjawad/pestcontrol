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
import SearchInput from "../../../../components/generic/SearchInput";

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
      const response = await api.getDataWithToken(
        `${job}/all?start_date=${viewStartDate}&end_date=${viewEndDate}`
      );
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch jobs",
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#FF4444"; // Not Completed
      case 2:
        return "#FFD700"; // In Progress
      case 1:
        return "#4CAF50"; // Completed
      default:
        return "#FF4444";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Not Completed";
      case 1:
        return "In Progress";
      case 2:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const events = filteredQuoteList?.map((job) => {
    const latestReschedule =
      job.reschedule_dates?.[job.reschedule_dates.length - 1];
    let defaultTime;

    if (latestReschedule?.job_date) {
      const [date, time] = latestReschedule.job_date.split(" ");
      defaultTime = time || "09:00:00";
    } else {
      defaultTime = job.job_start_time || "09:00:00";
    }

    const endTime =
      job.job_end_time ||
      (() => {
        const [hours, minutes] = defaultTime.split(":");
        return `${String(Number(hours) + 1).padStart(2, "0")}:${minutes}:00`;
      })();

    return {
      id: job.id,
      title: job.user?.client?.firm_name || "No Client Name", // Changed to show firm name
      start: `${job.job_date}T${defaultTime}`,
      end: `${job.job_date}T${endTime}`,
      backgroundColor: getStatusColor(job.is_completed),
      borderColor: getStatusColor(job.is_completed),
      extendedProps: {
        jobData: job,
        originalTime: defaultTime,
      },
      editable: true,
    };
  });

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
        <div className="text-xs text-gray-500">
          {format(
            new Date(
              `${jobData.job_date}T${eventInfo.event.extendedProps.originalTime}`
            ),
            "h:mm a"
          )}
        </div>
      </div>
    );
  };

  const handleDatesSet = (dateInfo) => {
    const startDate = dateInfo.start.toISOString().split("T")[0];
    const endDate = dateInfo.end.toISOString().split("T")[0];
    setViewStartDate(startDate);
    setViewEndDate(endDate);
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
                  label="Address"
                  value={selectedEvent.client_address?.address}
                />
                <JobDetailItem
                  label="Area"
                  value={selectedEvent.client_address?.area}
                />
                <JobDetailItem
                  label="Status"
                  value={
                    <Box
                      sx={{
                        bgcolor: getStatusColor(selectedEvent.is_completed),
                        color:
                          selectedEvent.is_completed === 1 ? "black" : "white",
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
