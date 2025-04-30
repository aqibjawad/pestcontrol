import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomTimePicker = ({ initialTime = '02:30 PM', onChange, serviceIndex }) => {
  // Parse initial time
  const parseTime = (timeString) => {
    const match = timeString.match(/(\d+):(\d+)\s?(AM|PM)?/i);
    if (match) {
      let [_, hours, minutes, period] = match;
      return {
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        period: period ? period.toUpperCase() : 'PM'
      };
    }
    return { hours: 2, minutes: 30, period: 'PM' };
  };

  const { hours, minutes, period } = parseTime(initialTime);

  // State for time values
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  
  // State for dropdown visibility
  const [hoursOpen, setHoursOpen] = useState(false);
  const [minutesOpen, setMinutesOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);

  // Generate hours options (1-12)
  const hoursOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString().padStart(2, '0')
  }));

  // Generate minutes options (00-59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0')
  }));

  // AM/PM options
  const periodOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
  ];

  // Format the time for display and callback
  const formatTime = () => {
    const formattedHours = selectedHours.toString().padStart(2, '0');
    const formattedMinutes = selectedMinutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`; // Format as HH:MM for compatibility with original code
  };

  // Call onChange when time changes
  useEffect(() => {
    if (onChange) {
      // Create a synthetic event object to match the expected signature
      const syntheticEvent = {
        target: {
          value: formatTime()
        }
      };
      onChange(syntheticEvent, serviceIndex);
    }
  }, [selectedHours, selectedMinutes, selectedPeriod, serviceIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setHoursOpen(false);
      setMinutesOpen(false);
      setPeriodOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Dropdown component
  const Dropdown = ({ options, value, onChange, open, setOpen, width }) => {
    return (
      <div className="relative" style={{ width }}>
        {/* Dropdown button */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700"
        >
          <span>{typeof value === 'number' ? value.toString().padStart(2, '0') : value}</span>
          <ChevronDown size={16} />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Hours dropdown */}
      <Dropdown
        options={hoursOptions}
        value={selectedHours}
        onChange={setSelectedHours}
        open={hoursOpen}
        setOpen={setHoursOpen}
        width="60px"
      />
      
      {/* Separator */}
      <span className="text-gray-500 text-xl">:</span>
      
      {/* Minutes dropdown */}
      <Dropdown
        options={minutesOptions}
        value={selectedMinutes}
        onChange={setSelectedMinutes}
        open={minutesOpen}
        setOpen={setMinutesOpen}
        width="60px"
      />
      
      {/* AM/PM dropdown */}
      <Dropdown
        options={periodOptions}
        value={selectedPeriod}
        onChange={setSelectedPeriod}
        open={periodOpen}
        setOpen={setPeriodOpen}
        width="70px"
      />
      
      {/* Display formatted time */}
      <div className="text-gray-500 ml-2">
        ({selectedHours.toString().padStart(2, '0')}:{selectedMinutes.toString().padStart(2, '0')} {selectedPeriod})
      </div>
    </div>
  );
};

export default CustomTimePicker;