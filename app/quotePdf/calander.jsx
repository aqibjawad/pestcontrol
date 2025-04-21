import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CalendarComponent = ({
  onDateChange,
  initialDates = [],
  isDateSelectable,
  serviceType,
  remainingMonths = 0,
  maxSelectable = Infinity,
}) => {
  const [selectedDates, setSelectedDates] = useState(initialDates);
  const [startDate, setStartDate] = useState(new Date());
  // Track both generated dates and their source dates
  const [generatedDateMap, setGeneratedDateMap] = useState({});
  // Track source dates (manually selected)
  const [sourceDates, setSourceDates] = useState([]);

  useEffect(() => {
    if (JSON.stringify(selectedDates) !== JSON.stringify(initialDates)) {
      setSelectedDates(initialDates);

      // Clear generated date map when initialDates changes to avoid stale references
      setGeneratedDateMap({});
      setSourceDates([]);
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

  // Check if a date exists in our selected dates array - using exact matching with time stripped out
  const isDateSelected = (date) => {
    const formattedDate = formatDate(date);
    return selectedDates.some((d) => formatDate(d) === formattedDate);
  };

  // Check if a date is auto-generated
  const isGeneratedDate = (date) => {
    const formattedDate = formatDate(date);
    return Object.values(generatedDateMap)
      .flat()
      .some((gd) => formatDate(gd) === formattedDate);
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

  // Function to get unique dates count (source dates + generated dates)
  const getUniqueDatesCount = () => {
    // Create a set of unique formatted dates
    const uniqueDatesSet = new Set(
      selectedDates.map((date) => formatDate(date))
    );
    return uniqueDatesSet.size;
  };

  const handleDateChange = (date) => {
    if (!date) return;

    // Ensure we're working with a date with normalized time (set to midnight)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const formattedDate = formatDate(normalizedDate);

    // Check if adding this date would exceed max selectable
    const uniqueCount = getUniqueDatesCount();
    const isMaxedOut = uniqueCount >= maxSelectable;

    // If the date is already selected
    if (isDateSelected(normalizedDate)) {
      // Check if it's a generated date
      if (isGeneratedDate(normalizedDate)) {
        // If we click on a generated date, find and remove its source date
        const sourceDate = findSourceDate(normalizedDate);
        if (sourceDate) {
          removeDate(sourceDate);
        }
      } else {
        // If it's a regular selected date, just remove it
        removeDate(formattedDate);
      }
    } else if (!isMaxedOut || maxSelectable === Infinity) {
      // Add the date if it's not already selected and we haven't hit the max
      addDate(normalizedDate);
      // Also update the startDate to show the selected date in the picker
      setStartDate(normalizedDate);
    } else {
      // Optional: Alert user they've reached max selectable dates
      alert(`You can only select ${maxSelectable} unique dates.`);
    }
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

    // Add to source dates (manually selected)
    const newSourceDates = [...sourceDates, normalizedDate];
    setSourceDates(newSourceDates);

    let newDates = [...selectedDates, normalizedDate];
    let newGeneratedDateMap = { ...generatedDateMap };

    // Generate dates based on service type
    let generatedDates = [];

    if (serviceType === "Monthly" && remainingMonths > 0) {
      generatedDates = generateDatesForRemainingMonths(
        normalizedDate,
        remainingMonths
      );
    } else if (serviceType === "Quarterly" && remainingMonths > 0) {
      generatedDates = generateQuarterlyDates(normalizedDate, remainingMonths);
    }

    // Filter out any generated dates that would be duplicates
    generatedDates = generatedDates.filter((gDate) => {
      const formattedGDate = formatDate(gDate);
      return (
        !isDateSelected(gDate) &&
        !Object.values(generatedDateMap)
          .flat()
          .some((existingGDate) => formatDate(existingGDate) === formattedGDate)
      );
    });

    // Add the generated dates to our map and selected dates
    if (generatedDates.length > 0) {
      newGeneratedDateMap[formattedDate] = generatedDates;
      newDates = [...newDates, ...generatedDates];
    }

    setGeneratedDateMap(newGeneratedDateMap);
    setSelectedDates(newDates);
    onDateChange && onDateChange(newDates, sourceDates);
  };

  // Function to remove a date and its generated sequence
  const removeDate = (formattedDate) => {
    // Get the generated dates for this source date
    const generatedDates = generatedDateMap[formattedDate] || [];

    // Remove the source date and its generated dates
    const newDates = selectedDates.filter((d) => {
      const currentFormatted = formatDate(d);
      return (
        currentFormatted !== formattedDate &&
        !generatedDates.some((gd) => formatDate(gd) === currentFormatted)
      );
    });

    // Update the source dates
    const newSourceDates = sourceDates.filter(
      (d) => formatDate(d) !== formattedDate
    );
    setSourceDates(newSourceDates);

    // Update the generated date map
    const newGeneratedDateMap = { ...generatedDateMap };
    delete newGeneratedDateMap[formattedDate];

    setGeneratedDateMap(newGeneratedDateMap);
    setSelectedDates(newDates);
    onDateChange && onDateChange(newDates, sourceDates);
  };

  // Function to clear all selected dates
  const handleClearDates = () => {
    setSelectedDates([]);
    setGeneratedDateMap({});
    setSourceDates([]);
    onDateChange && onDateChange([]);
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

  const getHighlightedDates = () => {
    return selectedDates.map((dateStr) => new Date(dateStr));
  };

  // Get only manually selected dates for display
  const getDisplayDates = () => {
    return sourceDates
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

    // Check if this date is in our selected dates
    if (selectedDates.some((d) => formatDate(d) === formattedDate)) {
      // Check if it's a generated date
      if (isGeneratedDate(normalizedDate)) {
        return "generated-date"; // Style for auto-generated dates
      }
      return "selected-date"; // Style for manually selected dates
    }

    return undefined;
  };

  // Get number of source dates only (excluding generated dates)
  const sourceCount = sourceDates.length;

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
        filterDate={isDateSelectable}
      />
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700">
          {selectedDates.length > 0
            ? `Selected Dates (${sourceCount}): ${getDisplayDates()}`
            : "No dates selected"}
        </p>
        {selectedDates.length > 0 && (
          <button
            onClick={handleClearDates}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Clear All
          </button>
        )}
      </div>
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
