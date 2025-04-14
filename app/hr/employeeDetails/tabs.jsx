"use client";

import React from "react";
import styles from "../../../styles/tabs.module.css";

const Tabs = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const currentTab = activeTab || "documents";

  return (
    <div className="mt-5">
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "documents" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("documents")}
        >
          Documents
        </div>
        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "financial" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("financial")}
        >
          Financial Information
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "stock" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("stock")}
        >
          Stock
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "jobs" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("jobs")}
        >
          Jobs
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "devices" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("devices")}
        >
          Devices
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "leaves" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("leaves")}
        >
          Leaves
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "attendence" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("attendence")}
        >
          Attendence
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "advance" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("advance")}
        >
          Advance
        </div>

        <div
          className={`${styles.tabPaymentButton} ${
            currentTab === "fine" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("fine")}
        >
          Fine
        </div>
      </div>
    </div>
  );
};

export default Tabs;
