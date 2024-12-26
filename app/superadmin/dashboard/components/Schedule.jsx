import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { startOfMonth, endOfMonth } from "date-fns";
import { Eye, Link } from "lucide-react";
import { Modal, Box, Typography, Divider, Grid, Paper } from "@mui/material";

const MyCalendar = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getAllQuotes();
  }, [selectedDate]);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      const startDate = startOfMonth(selectedDate).toISOString().split("T")[0];
      const endDate = endOfMonth(selectedDate).toISOString().split("T")[0];

      const response = await api.getDataWithToken(
        `${job}/all?start_date=${startDate}&end_date=${endDate}`
      );
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#FF4444";
      case 1:
        return "#FFD700";
      case 2:
        return "#4CAF50";
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

  const events = quoteList?.map((job) => ({
    id: job.id,
    title: job.job_title,
    start:
      job.job_date +
      (job.job_start_time ? `T${job.job_start_time}` : "T09:00:00"),
    end:
      job.job_date + (job.job_end_time ? `T${job.job_end_time}` : "T10:00:00"),
    backgroundColor: getStatusColor(job.is_completed),
    borderColor: getStatusColor(job.is_completed),
    extendedProps: {
      jobData: job, // Store the entire job object here
    },
    editable: true,
  }));

  const handleEventDrop = (info) => {
    alert(`${info.event.title} was dropped on ${info.event.startStr}`);
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
      </div>
    );
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Increased width for grid layout
    maxWidth: "900px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflow: "auto",
    borderColor: "none",
  };

  const handleDatesSet = (dateInfo) => {
    const startDate = dateInfo.start;
    const endDate = dateInfo.end;

    console.log("View Start Date:", startDate.toISOString().split("T")[0]);
    console.log("View End Date:", endDate.toISOString().split("T")[0]);
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
      <FullCalendar
        datesSet={handleDatesSet}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="600px"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,customView",
        }}
        views={{
          customView: {
            type: "dayGrid",
            duration: { days: 4 },
            buttonText: "Custom",
          },
        }}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
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
                  label="Job Title"
                  value={selectedEvent.job_title}
                  fullWidth
                />

                <JobDetailItem
                  label="Description"
                  value={selectedEvent.description}
                  fullWidth
                />

                <JobDetailItem
                  label="Client"
                  value={selectedEvent.user?.client?.firm_name}
                />

                <JobDetailItem
                  label="Address"
                  value={selectedEvent.client_address?.address}
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
                  label="Priority"
                  value={selectedEvent.priority}
                />

                <JobDetailItem
                  label="Start Time"
                  value={selectedEvent.job_start_time || "09:00 AM"}
                />

                <JobDetailItem
                  label="End Time"
                  value={selectedEvent.job_end_time || "10:00 AM"}
                />

                <JobDetailItem label="Date" value={selectedEvent.job_date} />

                <JobDetailItem
                  label="Total Amount"
                  value={
                    selectedEvent.grand_total
                      ? `$${selectedEvent.grand_total}`
                      : "N/A"
                  }
                />
              </Grid>

              <div>
                <Link href="/">View Details</Link>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default MyCalendar;
