import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  serviceType,
  remainingMonths = 0,
  maxSelectable = Infinity,
}) => {
  // Separate the manually selected dates from auto-generated ones
  const [selectedDates, setSelectedDates] = useState([]);
  const [generatedDates, setGeneratedDates] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  // Track which source date generated which dates
  const [generatedDateMap, setGeneratedDateMap] = useState({});

  useEffect(() => {
    if (
      JSON.stringify(selectedDates.concat(generatedDates)) !==
      JSON.stringify(initialDates)
    ) {
      // Initialize with all dates as selected - we'll separate them later if needed
      setSelectedDates(initialDates);
      setGeneratedDates([]);
      setGeneratedDateMap({});
    }
  }, [initialDates]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check if a date exists in our manually selected dates array
  const isDateSelected = (date) => {
    const formattedDate = formatDate(date);
    return selectedDates.some((d) => formatDate(d) === formattedDate);
  };

  // Check if a date exists in our generated dates array
  const isDateGenerated = (date) => {
    const formattedDate = formatDate(date);
    return generatedDates.some((d) => formatDate(d) === formattedDate);
  };

  // Find the source date that generated a specific date
  const findSourceDate = (generatedDate) => {
    const formattedGenDate = formatDate(generatedDate);
    for (const [sourceDate, genDates] of Object.entries(generatedDateMap)) {
      if (genDates.some((gd) => formatDate(gd) === formattedGenDate)) {
        return sourceDate;
      }
    }
    return null;
  };

  const handleDateChange = (date) => {
    if (!date) return;

    // Ensure we're working with a date with normalized time (set to midnight)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const formattedDate = formatDate(normalizedDate);

    // If the date is already manually selected, remove it
    if (isDateSelected(normalizedDate)) {
      removeDate(formattedDate);
      return;
    }

    // If it's a generated date, find and remove its source
    if (isDateGenerated(normalizedDate)) {
      const sourceDate = findSourceDate(normalizedDate);
      if (sourceDate) {
        removeDate(sourceDate);
      }
      return;
    }

    // Check if adding this date would exceed max selectable
    if (selectedDates.length >= maxSelectable && maxSelectable !== Infinity) {
      alert(`You can only select ${maxSelectable} dates.`);
      return;
    }

    // Add the date if it's not already selected
    addDate(normalizedDate);
    setStartDate(normalizedDate);
  };

  // Function to add a date and generate its sequence
  const addDate = (date) => {
    // Normalize the date by removing time component
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const formattedDate = formatDate(normalizedDate);

    // Ensure we don't add duplicate dates
    if (isDateSelected(normalizedDate)) {
      return;
    }

    // Add to manually selected dates
    const newSelectedDates = [...selectedDates, normalizedDate];
    setSelectedDates(newSelectedDates);

    // Generate dates based on service type
    let newGeneratedDates = [];
    let newGeneratedDateMap = { ...generatedDateMap };

    if (serviceType === "Monthly" && remainingMonths > 0) {
      newGeneratedDates = generateDatesForRemainingMonths(
        normalizedDate,
        remainingMonths
      );
    } else if (serviceType === "Quarterly" && remainingMonths > 0) {
      newGeneratedDates = generateQuarterlyDates(
        normalizedDate,
        remainingMonths
      );
    }

    // Filter out any generated dates that would be duplicates
    newGeneratedDates = newGeneratedDates.filter((gDate) => {
      const formattedGDate = formatDate(gDate);
      return !isDateSelected(gDate) && !isDateGenerated(gDate);
    });

    // Add the generated dates to our map and generated dates array
    if (newGeneratedDates.length > 0) {
      newGeneratedDateMap[formattedDate] = newGeneratedDates;
      setGeneratedDateMap(newGeneratedDateMap);
      setGeneratedDates([...generatedDates, ...newGeneratedDates]);
    }

    // Call onDateChange with both selected and generated dates
    onDateChange &&
      onDateChange(
        [...newSelectedDates, ...generatedDates, ...newGeneratedDates],
        newSelectedDates
      );
  };

  // Function to remove a date and its generated sequence
  const removeDate = (formattedDate) => {
    // Get the generated dates for this source date
    const dateGeneratedDates = generatedDateMap[formattedDate] || [];

    // Remove the source date
    const newSelectedDates = selectedDates.filter(
      (d) => formatDate(d) !== formattedDate
    );

    // Remove generated dates associated with this source
    const newGeneratedDates = generatedDates.filter((d) => {
      const currentFormatted = formatDate(d);
      return !dateGeneratedDates.some(
        (gd) => formatDate(gd) === currentFormatted
      );
    });

    // Update the generated date map
    const newGeneratedDateMap = { ...generatedDateMap };
    delete newGeneratedDateMap[formattedDate];

    setSelectedDates(newSelectedDates);
    setGeneratedDates(newGeneratedDates);
    setGeneratedDateMap(newGeneratedDateMap);

    // Call onDateChange with both selected and generated dates
    onDateChange &&
      onDateChange(
        [...newSelectedDates, ...newGeneratedDates],
        newSelectedDates
      );
  };

  // Function to clear all selected dates
  const handleClearDates = () => {
    setSelectedDates([]);
    setGeneratedDates([]);
    setGeneratedDateMap({});
    onDateChange && onDateChange([], []);
  };

  // Function to generate dates for remaining months
  const generateDatesForRemainingMonths = (baseDate, months) => {
    const result = [];
    const baseDay = new Date(baseDate).getDate();

    // Start from next month
    let currentDate = new Date(baseDate);

    // Generate dates for remaining months - 1 (since we already have the initial date)
    for (let i = 1; i < months; i++) {
      currentDate = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 1);

      // Handle edge cases
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();
      const targetDay = Math.min(baseDay, lastDayOfMonth);

      currentDate.setDate(targetDay);
      // Normalize time
      currentDate.setHours(0, 0, 0, 0);
      result.push(new Date(currentDate));
    }

    return result;
  };

  // Generate quarterly dates based on selected date
  const generateQuarterlyDates = (baseDate, remainingMonths) => {
    const result = [];
    baseDate = new Date(baseDate);

    // Calculate number of quarters remaining
    const quarters = Math.ceil(remainingMonths / 3);

    for (let i = 1; i < quarters; i++) {
      const newDate = new Date(baseDate);
      newDate.setMonth(baseDate.getMonth() + i * 3);
      // Normalize time
      newDate.setHours(0, 0, 0, 0);
      result.push(newDate);
    }

    return result;
  };

  // Get all dates for highlighting in calendar
  const getHighlightedDates = () => {
    return [...selectedDates, ...generatedDates].map((date) => new Date(date));
  };

  // Get only manually selected dates for display
  const getDisplayDates = () => {
    return selectedDates
      .sort((a, b) => new Date(a) - new Date(b))
      .map((date) => new Date(date).toLocaleDateString())
      .join(", ");
  };

  // Function to determine the style of each day in the calendar
  const getDayClassName = (date) => {
    if (!date) return undefined;

    // Normalize the date by removing time component
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const formattedDate = formatDate(normalizedDate);

    // Check if this date is manually selected
    if (selectedDates.some((d) => formatDate(d) === formattedDate)) {
      return "selected-date"; // Style for manually selected dates
    }

    // Check if this date is auto-generated
    if (generatedDates.some((d) => formatDate(d) === formattedDate)) {
      return "generated-date"; // Style for auto-generated dates
    }

    return undefined;
  };

  // This function always returns true to allow selection of any date including past dates
  const allowAllDates = () => true;

  return (
    <div className="w-full max-w-md mx-auto">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        inline
        highlightDates={getHighlightedDates()}
        dateFormat="yyyy-MM-dd"
        showTimeSelect={false}
        dayClassName={getDayClassName}
        filterDate={allowAllDates} // This enables selection of all dates including past dates
      />
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700">
          {selectedDates.length > 0
            ? `Selected Dates (${selectedDates.length}): ${getDisplayDates()}`
            : "No dates selected"}
        </p>
        {(selectedDates.length > 0 || generatedDates.length > 0) && (
          <button
            onClick={handleClearDates}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Clear All
          </button>
        )}
      </div>
      {generatedDates.length > 0 && (
        <p className="text-gray-500 text-sm mt-2">
          <span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span>
          {generatedDates.length} additional dates will be auto-generated based
          on your selection
        </p>
      )}
      <style jsx>{`
        .selected-date {
          background-color: #007bff !important;
          color: white !important;
          border-radius: 0.25rem;
        }
        .generated-date {
          background-color: #28a745 !important;
          color: white !important;
          border-radius: 0.25rem;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;