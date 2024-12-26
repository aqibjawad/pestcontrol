import React, { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import { Scheduler } from "@aldabil/react-scheduler";
import { startOfMonth, endOfMonth } from "date-fns"; // Import date-fns functions

import "./index.css";

const Schedule = ({ isVisible }) => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (isVisible) {
      getAllQuotes();
    }
  }, [selectedDate, isVisible]);

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

  const formatSchedulerEvents = (jobs) => {
    return jobs.map((job) => {
      // Parse the job_date and create start/end times
      const jobDate = new Date(job.job_date);
      const startTime = job.job_start_time
        ? new Date(job.job_start_time)
        : new Date(jobDate.setHours(9, 0, 0)); // Default to 9 AM if no start time

      const endTime = job.job_end_time
        ? new Date(job.job_end_time)
        : new Date(jobDate.setHours(10, 0, 0)); // Default to 1 hour duration

      return {
        event_id: job.id,
        title: job.subject || `Job #${job.id}`,
        start: startTime,
        end: endTime,
        description: job.description,
        // Additional custom fields
        priority: job.priority,
        status: job.is_completed ? "Completed" : "Pending",
        client: job.user?.client?.firm_name,
        location: job.client_address?.address,
      };
    });
  };

  const handleEventClick = (event) => {
    console.log("Event clicked:", event);
    // You can add custom handling here, like opening a modal with job details
  };

  return (
    <div className="w-full h-full">
      {fetchingData ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading schedule...</p>
        </div>
      ) : (
        <Scheduler
          maxAppointmentsPerCell={undefined}
          view="month"
          events={formatSchedulerEvents(quoteList)}
          onEventClick={handleEventClick}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
            startHour: 9,
            endHour: 17,
            maxEvents: Infinity, // Ensure all events are displayed
            renderDay: (date, events) => (
              <div className="custom-day-cell">
                <div>{date.getDate()}</div>
                {events.map((event) => (
                  <div key={event.event_id} className="event-item">
                    {event.title}
                  </div>
                ))}
              </div>
            ),
          }}
          day={{
            startHour: 9,
            endHour: 17,
            step: 60,
          }}
        />
      )}
    </div>
  );
};

export default Schedule;
