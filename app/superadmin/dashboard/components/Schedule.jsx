import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction"; // For drag & drop
import { startOfMonth, endOfMonth } from "date-fns"; // Import date-fns functions

const MyCalendar = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getAllQuotes();
  }, [selectedDate]);

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      // Get start and end of the current month
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
        return "#FF4444"; // Red for not completed
      case 1:
        return "#FFD700"; // Yellow for in progress
      case 2:
        return "#4CAF50"; // Green for completed
      default:
        return "#FF4444"; // Default red
    }
  };

  const events = quoteList.map((job) => ({
    title: job.job_title,
    start:
      job.job_date +
      (job.job_start_time ? `T${job.job_start_time}` : "T09:00:00"),
    end:
      job.job_date + (job.job_end_time ? `T${job.job_end_time}` : "T10:00:00"),
    backgroundColor: getStatusColor(job.is_completed),
    borderColor: getStatusColor(job.is_completed),
    extendedProps: {
      description: job.description,
      priority: job.priority,
      client: job.user?.client?.firm_name,
      address: job.client_address?.address,
    },
    editable: true,
  }));

  const handleEventDrop = (info) => {
    alert(`${info.event.title} was dropped on ${info.event.startStr}`);
  };

  const renderEventContent = (eventInfo) => {
    const { extendedProps } = eventInfo.event;
    return (
      <div
        className="p-2 rounded-lg shadow-sm bg-white border hover:shadow-md"
        style={{
          margin: "2px",
          cursor: "pointer",
          borderLeft: `4px solid ${eventInfo.event.backgroundColor}`,
        }}
      >
        <div className="text-xs text-gray-600">{extendedProps.client}</div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="600px"
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
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
    </div>
  );
};

export default MyCalendar;
