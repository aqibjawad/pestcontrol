"use client";

import React, { useState } from "react";
import styles from "../../../styles/tabs.module.css";
import AllEmployees from "@/app/operations/viewEmployees/allEmployees";
import SalarCal from "../salaryCal/page";
import CommissionCal from "../comCal/page";
import SalaryTotal from "../salaryTotal/page";
import Ledger from "../employeeLedger/ledger";
import withAuth from "@/utils/withAuth";
import EmpLeaves from "../empLeaves/empLeaves";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <div className="py-3">{children}</div>}
    </div>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div>
      <div className="mt-5">
        <div className={styles.tabContainer}>
          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 0 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(0)}
          >
            All Employees
          </div>
          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 1 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(1)}
          >
            Salary Calculation
          </div>
          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 2 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(2)}
          >
            Commission Calculation
          </div>
          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 3 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(3)}
          >
            Total Salary
          </div>
          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 4 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(4)}
          >
            Employee Ledger
          </div>

          <div
            className={`${styles.tabPaymentButton} ${
              activeTab === 5 ? styles.active : ""
            }`}
            onClick={() => handleTabClick(5)}
          >
            Employee Leaves
          </div>
        </div>
      </div>

      <TabPanel value={activeTab} index={0}>
        <AllEmployees />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <SalarCal />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <CommissionCal />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <SalaryTotal />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Ledger />
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <EmpLeaves />
      </TabPanel>
    </div>
  );
};

export default withAuth(Page);
