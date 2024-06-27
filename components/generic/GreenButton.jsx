import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";
const GreenButton = ({ title, onClick }) => {
  return (
    <div onClick={onClick} className={styles.buttonContainer}>
      {title}
    </div>
  );
};

export default GreenButton;
