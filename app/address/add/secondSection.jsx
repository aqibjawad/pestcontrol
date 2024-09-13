import React from "react";
import styles from "../../../styles/addresses.module.css";

const SecondSection = ({ onClick }) => {
  return (
    <div className={styles.userFormContainer} onClick={onClick}>
      <div className={styles.plusborder}>+</div>
    </div>
  );
};

export default SecondSection;
