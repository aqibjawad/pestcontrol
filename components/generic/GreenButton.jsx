import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";
import { CircularProgress } from "@mui/material";
const GreenButton = ({ title, onClick, sendingData }) => {
  return (
    <>
      {sendingData ? (
        <div className={styles.buttonContainer}>
          <CircularProgress size={20} color="inherit" />
        </div>
      ) : (
        <div onClick={onClick} className={styles.buttonContainer}>
          {title}
        </div>
      )}
    </>
  );
};

export default GreenButton;
