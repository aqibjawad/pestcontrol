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

  const [errors, setErrors] = useState({
    personalInfo: {},
    insurance: {},
    otherInfo: {},
  });

  const validateForm = (section) => {
    const newErrors = {};
    if (formData[section] && typeof formData[section] === "object") {
      Object.keys(formData[section]).forEach((field) => {
        if (!formData[section][field]) {
          newErrors[field] = "This field is required";
        }
      });
    } else {
      console.error(`Invalid section: ${section}`);
    }
    return newErrors;
  };

  const handlePrevious = () => {
    setSelectedIndex(
      selectedIndex === 0 ? tabNames.length - 1 : selectedIndex - 1
    );
  };

  const getSectionName = (index) => {
    switch (index) {
      case 0:
        return "personalInfo";
      case 1:
        return "insurance";
      case 2:
        return "otherInfo";
      default:
        return "";
    }
  };

  const handleNext = () => {
    const currentSection = getSectionName(selectedIndex);
    if (!currentSection) {
      console.error(`Invalid section index: ${selectedIndex}`);
      return;
    }

    const currentErrors = validateForm(currentSection);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [currentSection]: currentErrors,
    }));

    if (Object.keys(currentErrors).length === 0) {
      setSelectedIndex((prevIndex) =>
        prevIndex === tabNames.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      // Create an error message string
      const errorMessages = Object.entries(currentErrors)
        .map(([field, error]) => `${field}: ${error}`)
        .join("\n");

      // Show the errors in an alert
      alert(`Please correct the following errors:\n\n${errorMessages}`);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [section]: {
        ...prevErrors[section],
        [field]: undefined,
      },
    }));
  };

  const handleSubmit = async () => {
    const allErrors = {
      personalInfo: validateForm("personalInfo"),
      insurance: validateForm("insurance"),
      otherInfo: validateForm("otherInfo"),
    };

    setErrors(allErrors);

    if (
      Object.values(allErrors).every(
        (section) => Object.keys(section).length === 0
      )
    ) {
      try {
        const response = await api.postDataWithTokn("addClient", formData);
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
    } else {
      alert("Please fill in all required fields before submitting.");
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
              errors={errors.personalInfo}
              onChange={(field, value) =>
                handleInputChange("personalInfo", field, value)
              }
            />
          </div>

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <Insurance
              data={formData.insurance}
              errors={errors.insurance}
              onChange={(field, value) =>
                handleInputChange("insurance", field, value)
              }
            />
          </div>

          <div className={selectedIndex === 2 ? `block` : "hidden"}>
            <OtherInfo
              data={formData.otherInfo}
              errors={errors.otherInfo}
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
        <div className="flex justify-end mt-4">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
