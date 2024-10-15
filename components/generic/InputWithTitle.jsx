"use client";
import React from "react";
import styles from "../../styles/generics/inputStyles.module.css";

const InputWithTitle = ({ title, onChange, ...rest }) => {
  return (
    <div className="w-full">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        <input
          onChange={(e) => onChange(e.target.value)} // Pass the value directly
          className={`w-full ${styles.inputField}`}
          {...rest}
        />
      </div>
    </div>
  );
};

export default InputWithTitle;
