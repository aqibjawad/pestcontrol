"use client";

import React from "react";
import MonthPicker from "../monthPicker";

const EmpAttendence = ({ attendence, onMonthChange }) => {
  return (
    <>
      <div className="mt-5">
        <MonthPicker onDateChange={onMonthChange} />
      </div>

      <div className="mt-4">
        {attendence?.[0]?.attendance_per !== undefined ? (
          <div>{attendence[0].attendance_per}</div>
        ) : (
          <div>No attendance data available</div>
        )}
      </div>
    </>
  );
};

export default EmpAttendence;
