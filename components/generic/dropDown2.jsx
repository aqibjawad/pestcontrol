import React, { useState, useEffect } from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

export default function Dropdown2({ title, options, onChange, preSelected }) {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (preSelected) {
      setSelectedValue(preSelected);
    }
  }, [preSelected]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <Box sx={{ minWidth: 250 }}>
      <div className="title">{title}</div>
      <div className="mb-2"></div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedValue}
          label={title}
          onChange={handleChange}
        >
          {options.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
