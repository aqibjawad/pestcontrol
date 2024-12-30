import React from "react";
import { X } from "lucide-react";

const InputWithTitleWithClearButton = ({
  title,
  onChange,
  onClear,
  value,
  ...rest
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    onChange("");
  };

  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-1">{title}</div>
      <div className="relative flex items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...rest}
        />
        {value && value.length > 0 && (
          <button
            onClick={handleClear}
            className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            type="button"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputWithTitleWithClearButton;
