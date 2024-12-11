"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import "./index.css";
import PersonalInformation from "./personalInformation";
import Insurance from "./insurance";
import OtherInfo from "./otherInformation.jsx";
import APICall from "@/networkUtil/APICall";
import { addEmployee } from "@/networkUtil/Constants";
import { AppAlerts } from "@/Helper/AppAlerts";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const alert = new AppAlerts();
  const router = useRouter();
  const [sendingData, setSendingData] = useState(false);
  const [tabNames] = useState([
    "Personal Information",
    "Other Information",
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [formData, setFormData] = useState({
    profile_image: "",
    name: "",
    email: "",
    role_id: "1",
    phone_number: "",
    eid_no: "",
    target: "",
    eid_start: "",
    eid_expiry: "",
    profession: "",
    passport_no: "",
    passport_start: "",
    passport_expiry: "",
    relative_name: "",
    relation: "",
    emergency_contact: "",
    basic_salary: "",
    allowance: "",
    other: "",
    total_salary: "",
    commission_per: "",
    labour_card_expiry: ""
  });

  const [errors, setErrors] = useState({
    personalInfo: {},
    otherInfo: {},
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const validateForm = () => {
    const isValidNumberString = (str) => /^[0-9+\-]+$/.test(str);
    const isValidNumber = (str) => /^\d+$/.test(str);
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (formData.phone_number && !isValidNumberString(formData.phone_number)) {
      return "Phone number can only contain numbers, +, and -";
    }
    if (formData.passport_no && !isValidNumberString(formData.passport_no)) {
      return "Passport number can only contain numbers, +, and -";
    }
    if (formData.eid_no && !isValidNumberString(formData.eid_no)) {
      return "EID number can only contain numbers, +, and -";
    }
    for (const field of [
      "total_salary",
      "other",
      "allowance",
      "basic_salary",
    ]) {
      if (formData[field] && !isValidNumber(formData[field])) {
        return `${field.replace("_", " ")} must be a number`;
      }
    }
    if (formData.email && !isValidEmail(formData.email)) {
      return "Invalid email address";
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!sendingData) {
      const validationError = validateForm();
      if (validationError) {
        alert.errorAlert(validationError);
      } else {
        setSendingData(true);
        const response = await api.postFormDataWithToken(addEmployee, formData);
        console.log(response);
        if (response.status === "success") {
          alert.successAlert(response.message);
          router.replace("/hr/hr");
        } else {
          alert.errorAlert(response.error.message);
        }
        setSendingData(false);
      }
    }
  };

  return (
    <div>
      <div className={styles.topTabConainer}>
        <div className={`flex gap-4 ${styles.tabsContainer}`}>
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
              data={formData}
              errors={errors.personalInfo}
              onChange={(field, value) => handleInputChange(field, value)}
            />
          </div>

          {/* <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <Insurance
              data={formData}
              errors={errors.insurance}
              onChange={(field, value) => handleInputChange(field, value)}
            />
          </div> */}

          <div className={selectedIndex === 1 ? `block` : "hidden"}>
            <OtherInfo
              data={formData}
              errors={errors.otherInfo}
              onChange={(field, value) => handleInputChange(field, value)}
              handleSubmit={handleSubmit}
              sendingData={sendingData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
