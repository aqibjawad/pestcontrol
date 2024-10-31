"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import styles from "../../styles/generics/inputStyles.module.css";

export default function Dropdown2({ title, options, onChange, value }) {
  return (
    <Box sx={{ minWidth: 250 }}>
      <div className={styles.title}>{title}</div>
      <div className="mb-2"></div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value || ""}
          label={title}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
