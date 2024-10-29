import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthPicker = ({ onMonthChanged }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date();

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDate = (date) => {
    return date.toISOString().slice(0, 7); // Returns YYYY-MM format
  };

  const previousMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      onMonthChanged(formatDate(newDate));
      return newDate;
    });
  };

  const nextMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      onMonthChanged(formatDate(newDate));
      return newDate;
    });
  };

  const canGoNext = selectedDate.getFullYear() < currentDate.getFullYear() ||
    (selectedDate.getFullYear() === currentDate.getFullYear() &&
     selectedDate.getMonth() < currentDate.getMonth());

  return (
    <div className="h-[50px] bg-white rounded-lg shadow-sm flex items-center justify-between px-4">
      <button 
        onClick={previousMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="font-bold text-green-600 text-base">
        {formatDisplayDate(selectedDate)}
      </span>
      
      <button 
        onClick={nextMonth}
        disabled={!canGoNext}
        className={`p-2 rounded-full ${
          canGoNext 
            ? 'hover:bg-gray-100' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MonthPicker;