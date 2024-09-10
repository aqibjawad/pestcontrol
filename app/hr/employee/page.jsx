"use client";

import React, { useState } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import "./index.css";
import PersonalInformation from "./personalInformation";
import Insurance from "./insurance";
import OtherInfo from "./otherInformation.jsx";

import APICall from "@/networkUtil/APICall";

const Page = () => {

  const api = new APICall(); 

  const [tabNames] = useState([
    "Personal Information",
    "Insurance",
    "Other Information",
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [formData, setFormData] = useState({
    personalInfo: {
      role: "7",
      name: "",
      phone_number: "",
      email: "",
      eid_no: "",
      eid_start: "",
      eid_expiry: "",
      target: "",
      profession: "",
      passport_no: "",
      passport_start: "",
      passport_expiry: "",
    },
    insurance: {
      hi_status: "",
      hi_start: "",
      hi_expiry: "",
      ui_status: "",
      ui_start: "",
      ui_expiry: "",
      dm_card: "",
      dm_start: "",
      dm_expiry: "",
    },
    otherInfo: {
      relative_name: "",
      emergency_contact: "",
      relation: "",
      basic_Salary: "",
      allowance: "",
      other: "",
      total_salary: "",
    },
  });

  const handlePrevious = () => {
    setSelectedIndex(
      selectedIndex === 0 ? tabNames.length - 1 : selectedIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex(
      selectedIndex === tabNames.length - 1 ? 0 : selectedIndex + 1
    );
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    try {
      const response = await api.postDataWithTokn("addClient", formData); // Replace "addClient" with the actual endpoint
      if (response.error) {
        alert(response.error.error);
        console.log(response.error.error);
      } else {
        alert("Employee added successfully!");
        // Optionally, clear form fields or reset state
      }
    } catch (error) {
      console.error("Error adding Employee:", error);
      alert("An error occurred while adding the Employee.");
    }
  };
  return (
    <div>
      <div className={styles.topTabConainer}>
        <div className={`flex ${styles.tabsContainer}`}>
          {tabNames.map((item, index) => (
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
          ))}
        </div>
      </div>

      <div className="employ-head">Employee</div>

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <div className={selectedIndex === 0 ? `block` : "hidden"}>
            <PersonalInformation
              data={formData.personalInfo}
              onChange={(field, value) =>
                handleInputChange("personalInfo", field, value)
              }
            />
          </div>

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <Insurance
              data={formData.insurance}
              onChange={(field, value) =>
                handleInputChange("insurance", field, value)
              }
            />
          </div>

          <div className={selectedIndex === 2 ? `block` : "hidden"}>
            <OtherInfo
              data={formData.otherInfo}
              onChange={(field, value) =>
                handleInputChange("otherInfo", field, value)
              }
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-3">
        <div className="flex justify-between mt-4">
          <button className="previous-button" onClick={handlePrevious}>
            <img src="/Icon.png" alt="Previous" /> Previous
          </button>

          <button className="next-button" onClick={handleNext}>
            Next <img src="/arrow-right.png" alt="Next" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
