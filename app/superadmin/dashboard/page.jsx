"use client";
import React, { useState } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import Operations from "../dashboard/components/Operations";
const Index = () => {
  const [tabNames, setTabNames] = useState([
    "Work management",
    "Finance Management",
    "Scheduler",
    "Reports",
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = () => {
    return (
      <div className={styles.topTabConainer}>
        <div className="flex gap-4">
          {tabNames.map((item, index) => {
            return (
              <div
                onClick={() => setSelectedIndex(index)}
                className={`flex-grow ${
                  index === selectedIndex
                    ? styles.tabContainerSelected
                    : styles.tabContainer
                }`}
                key={index}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className=" w-full">
      {tabs()}

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <Operations />
        </div>
        <div className="col-span-12 md:col-span-3"></div>
      </div>
    </div>
  );
};

export default Index;
