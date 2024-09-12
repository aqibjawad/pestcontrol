"use client";

import React from "react";
import styles from "../../../styles/tabs.module.css";

const Tabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const currentTab = activeTab || "cash";

  return (
    <div className="mt-5">
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "cash" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("cash")}
        >
          Cash
        </div>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "cheque" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("cheque")}
        >
          Cheque
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "online" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("online")}
        >
          Online
        </div>
      </div>
    </div>
  );
};

export default Tabs;
