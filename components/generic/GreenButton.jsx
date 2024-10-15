"use client";
import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";
import { CircularProgress } from "@mui/material";
const GreenButton = ({ title, onClick, sendingData }) => {
  return (
    <div onClick={onClick} className={styles.buttonContainer}>
      {sendingData ? <CircularProgress size={20} color="inherit" /> : title}
    </div>
  );
};

export default GreenButton;
