// pages/scheduler.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Scheduler = () => {
  const handleDateClick = (arg) => {
    alert('Date clicked: ' + arg.dateStr);
  };

  return (
    <div style={{ padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={[
          { title: 'event 1', date: '2024-06-20' },
          { title: 'event 2', date: '2024-06-21' },
        ]}
      />
    </div>
  );
};

export default Scheduler;
