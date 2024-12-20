import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Tabs, Tab, Box, Button, Alert } from "@mui/material";
import CalendarComponent from "./calender.component";
import InputWithTitle from "../../components/generic/InputWithTitle";

const DateSelectionModal = ({
  open,
  onClose,
  selectedJobType,
  duration_in_months,
  selectedDates,
  onDateChange,
  activeTab,
  onTabChange,
  dayWiseSelection,
  onDayWiseSelectionChange,
  intervalDays,
  onIntervalDaysChange,
  quoteServices,
  quoteData,
}) => {

  console.log(quoteData?.duration_in_months, "duration in months");

  const quoteServi = quoteData?.quote_services || [];

  const noOfServicesArray = quoteServi.map((service) => ({
    name: service.name, // Assuming 'name' is the property for the service name
    no_of_services: service.no_of_services, // Keeping the existing property
  }));

  console.log(noOfServicesArray, "Array of no_of_services");

  // Calculate max services per month
  const maxServicesPerMonth = useMemo(() => {
    if (!quoteServices?.length || !duration_in_months) return 0;

    const totalServices = quoteServices.reduce(
      (sum, service) =>
        sum + (service.job_type === "monthly" ? service.no_of_services : 0),
      0
    );

    return Math.floor(totalServices / duration_in_months);
  }, [quoteServices, duration_in_months]);

  // Check if selected dates exceed max services per month
  const exceedsMonthlyLimit = useMemo(() => {
    if (!selectedDates?.length || !maxServicesPerMonth) return false;

    // Group dates by month and check if any month exceeds limit
    const monthCounts = selectedDates.reduce((acc, date) => {
      const monthYear = new Date(date).toISOString().slice(0, 7);
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return Object.values(monthCounts).some(
      (count) => count > maxServicesPerMonth
    );
  }, [selectedDates, maxServicesPerMonth]);

  const handleDateChange = (dates) => {
    // Group new dates by month
    const monthCounts = dates.reduce((acc, date) => {
      const monthYear = date.toISOString().slice(0, 7);
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Only allow date selection if it doesn't exceed monthly limit
    if (
      Object.values(monthCounts).every((count) => count <= maxServicesPerMonth)
    ) {
      onDateChange(dates);
    }
  };

  const renderDayWiseSelection = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeks = ["1st Week", "2nd Week", "3rd Week", "4th Week"];

    return (
      <div className="day-wise-selection">
        {maxServicesPerMonth > 0 && (
          <Alert severity="info" className="mb-4">
            Maximum {maxServicesPerMonth} services allowed per month
          </Alert>
        )}
        <table>
          <thead>
            <tr>
              <th></th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={week}>
                <td>{week}</td>
                {days.map((day, dayIndex) => (
                  <td key={`${week}-${day}`}>
                    <Button
                      variant={
                        dayWiseSelection.some(
                          (item) =>
                            item.week === weekIndex && item.day === dayIndex
                        )
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        let newSelection = [];
                        if (selectedJobType === "daily") {
                          newSelection = [{ week: weekIndex, day: dayIndex }];
                        } else {
                          newSelection = [...dayWiseSelection];
                          const isSelected = newSelection.some(
                            (item) =>
                              item.week === weekIndex && item.day === dayIndex
                          );
                          if (isSelected) {
                            const index = newSelection.findIndex(
                              (item) =>
                                item.week === weekIndex && item.day === dayIndex
                            );
                            if (index !== -1) newSelection.splice(index, 1);
                          } else if (
                            newSelection.length < maxServicesPerMonth
                          ) {
                            newSelection.push({
                              week: weekIndex,
                              day: dayIndex,
                            });
                          }
                        }
                        onDayWiseSelectionChange(newSelection);
                      }}
                    >
                      {day}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedJobType === "monthly" || selectedJobType === "daily"
          ? `Select Dates (Will repeat for ${duration_in_months} months)`
          : selectedJobType === "daily"
          ? "Select Date (Only one date allowed)"
          : "Select Dates"}
      </DialogTitle>
      <DialogContent>
        {exceedsMonthlyLimit && (
          <Alert severity="error" className="mb-4">
            Maximum {maxServicesPerMonth} services allowed per month
          </Alert>
        )}

        {(selectedJobType === "weekly" ||
          selectedJobType === "daily" ||
          selectedJobType === "monthly") && (
          <Tabs value={activeTab} onChange={onTabChange}>
            <Tab label="Date" />
            <Tab label="Day-wise" />
          </Tabs>
        )}
        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            <CalendarComponent
              initialDates={selectedDates?.map((date) => new Date(date))}
              onDateChange={handleDateChange}
              minDate={selectedJobType === "daily" ? new Date() : undefined}
              maxSelectable={selectedJobType === "daily" ? 1 : undefined}
            />
          )}
          {activeTab === 1 && renderDayWiseSelection()}
        </Box>
        {selectedJobType === "custom" && (
          <InputWithTitle
            title="Interval Days"
            type="number"
            name="intervalDays"
            placeholder="Enter interval days"
            value={intervalDays}
            onChange={onIntervalDaysChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onClose}
          color="primary"
          disabled={exceedsMonthlyLimit}
        >
          Save Dates
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateSelectionModal;
