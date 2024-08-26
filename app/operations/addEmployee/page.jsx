"use client";

import React, { useState } from "react";

import styles from "../../../styles/employess.module.css";

import Personal from "./personal";
import Insurance from "./insurance";
import OtherInfo from "./other";

import GreenButton from "@/components/generic/GreenButton";

const Page = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className={styles.tabHeaderStyle}>
        <div
          onClick={() => handleTabClick("tab1")}
          className={
            activeTab === "tab1" ? styles.activeTabStyle : styles.tabStyle
          }
        >
          Personal Information
        </div>
        <div
          onClick={() => handleTabClick("tab2")}
          className={
            activeTab === "tab2" ? styles.activeTabStyle : styles.tabStyle
          }
        >
          Insurance
        </div>
        <div
          onClick={() => handleTabClick("tab3")}
          className={
            activeTab === "tab3" ? styles.activeTabStyle : styles.tabStyle
          }
        >
          Other Information
        </div>
      </div>

      <div className={styles.tabContentStyle}>
        {activeTab === "tab1" && (
          <div>
            <Personal />
          </div>
        )}
        {activeTab === "tab2" && (
          <div>
            <Insurance />
          </div>
        )}
        {activeTab === "tab3" && (
          <div>
            <OtherInfo />
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <GreenButton title={"Save"} />
      </div>
    </div>
  );
};

export default Page;
