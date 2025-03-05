"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../styles/superAdmin/dashboard.module.css";
import "./index.css";
import PersonalInformation from "./personalInformation";
import Insurance from "./insurance";
import OtherInfo from "./otherInformation.jsx";
import APICall from "@/networkUtil/APICall";
import { addEmployee, branches } from "@/networkUtil/Constants";
import { AppAlerts } from "@/Helper/AppAlerts";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const alert = new AppAlerts();
  const router = useRouter();
  const [sendingData, setSendingData] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rows, setRows] = useState([]);

  const [formData, setFormData] = useState({
    profile_image: "",
    name: "",
    email: "",
    role_id: "1",
    phone_number: "",
    eid_no: "1234",
    target: "0",
    eid_start: "temp",
    eid_expiry: "temp",
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
    commission_per: "0",
    labour_card_expiry: "abc",
    country: "",
    branch_id: "",
    joining_date:"",
    remaining_off_days: "",
    base_target:"",
    contract_target: "",
    achieved_target: ""

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
  }, [formData]);

  const validateForm = () => {
    const normalizeInput = (str) => (str ? str.trim() : "");

    // Clean phone number of all non-digit characters including +, -, and any invisible unicode
    const cleanPhoneNumber = (phone) => {
      return phone ? phone.replace(/[^\d]/g, "") : "";
    };

    const isValidPhoneNumber = (str) => {
      const cleanedNumber = cleanPhoneNumber(str);
      return cleanedNumber.length >= 9 && cleanedNumber.length <= 15; // standard phone number length
    };

    const isValidNumber = (str) => /^\d+$/.test(normalizeInput(str));
    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeInput(email));
    const isValidString = (str) =>
      typeof str === "string" && normalizeInput(str).length > 1;

    // Name validation
    if (!isValidString(formData.name)) {
      return "Please enter a valid name";
    }

    // Phone number validation
    if (!isValidPhoneNumber(formData.phone_number)) {
      return "Please enter a valid phone number (9-15 digits)";
    }

    // Email validation
    if (!formData.email || !isValidEmail(formData.email)) {
      return "Please enter a valid email address";
    }

    // Target validation
    if (!isValidNumber(formData.target)) {
      return "Please enter a valid target number";
    }

    // Profession validation
    if (!isValidString(formData.profession)) {
      return "Please enter a valid profession";
    }

    // Emergency contact validation
    if (!isValidPhoneNumber(formData.emergency_contact)) {
      return "Please enter a valid emergency contact number (9-15 digits)";
    }

    if (!formData.basic_salary || formData.basic_salary.trim() === "") {
      return "Basic salary is required";
    }

    if (!isValidNumber(formData.basic_salary)) {
      return "Basic salary must be a valid number";
    }

    if (!formData.other || formData.other.trim() === "") {
      return "Please enter a valid other number or 0";
    }

    if (!isValidNumber(formData.other)) {
      return "Please enter a valid other number";
    }

    if (!formData.other || formData.other.trim() === "") {
      return "Please enter a valid amount in Other or 0";
    }

    if (!isValidNumber(formData.other)) {
      return "Please enter a valid amount in Other or 0";
    }

    if (!formData.allowance || formData.allowance.trim() === "") {
      return "Please enter a valid amount in Allowance or 0";
    }

    if (!isValidNumber(formData.allowance)) {
      return "Please enter a valid amount in Allowance or 0";
    }

    const other = parseInt(normalizeInput(formData.other) || 0, 0);
    const allowance = parseInt(normalizeInput(formData.allowance) || 0, 0);
    const basicSalary = parseInt(
      normalizeInput(formData.basic_salary) || 0,
      10
    );

    if (
      !isValidNumber(other.toString()) ||
      !isValidNumber(allowance.toString()) ||
      !isValidNumber(basicSalary.toString())
    ) {
      return "Other, allowance, and basic salary must be valid numbers";
    }

    formData.total_salary = other + allowance + basicSalary;

    if (normalizeInput(formData.relative_name) === "") {
      return "Please enter a relative name";
    }
    if (normalizeInput(formData.relation) === "") {
      return "Please enter a relation";
    }
    if (normalizeInput(formData.emergency_contact) === "") {
      return "Please enter an emergency contact";
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

  const fetchData = async () => {
    try {
      const response = await api.getDataWithToken(`${branches}`);
      const data = response.data;
      setRows(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="employ-head">Employee</div>

      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-12 md:col-span-9">
          <div className={selectedIndex === 0 ? `block` : "hidden"}>
            <PersonalInformation
              data={formData}
              errors={errors.personalInfo}
              onChange={(field, value) => handleInputChange(field, value)}
              handleSubmit={handleSubmit}
              sendingData={sendingData}
              branches={rows}
            />
          </div>

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
