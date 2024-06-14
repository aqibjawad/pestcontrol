import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";
const GreenButton = ({ title }) => {
  return <div className={styles.buttonContainer}>{title}</div>;
};

export default GreenButton;
