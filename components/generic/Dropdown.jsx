"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import styles from "../../styles/generics/inputStyles.module.css";

export default function Dropdown({ title, options, onChange }) {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    const index = options.indexOf(value);
    setSelectedValue(value);
    onChange(value, index);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <div className={styles.title}>{title}</div>
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
