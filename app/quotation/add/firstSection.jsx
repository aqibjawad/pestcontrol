"use client";

import React, { useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";

const FirstSection = () => {
  const [name, setName] = useState("");
  const [firmName, setFirmName] = useState("");

  const [contractedList, setContractedList] = useState([]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFirmNameChange = (e) => {
    setFirmName(e.target.value);
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="mt-10" style={{ width: "50%" }}>
          <InputWithTitle
            title={"Contact Person"}
            type={"text"}
            name="name"
            placeholder={"Contact Person"}
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="mt-10" style={{ width: "50%" }}>
          <InputWithTitle
            title={"Contract Reference"}
            type={"text"}
            name="firmName"
            placeholder={"Contract Reference"}
            value={firmName}
            onChange={handleFirmNameChange}
          />
        </div>
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Firm"}
          type={"text"}
          name="name"
          placeholder={"Firm"}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Quotes title"}
          type={"text"}
          name="name"
          placeholder={"Quotes title"}
        />
      </div>

      <div className="mt-10">
        <Dropdown
          title={"Contracted by"}
          options={contractedList && contractedList}
        />
      </div>

      <div className="mt-10">
        <Dropdown
          title={"Select address"}
          options={contractedList && contractedList}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Subject"}
          type={"text"}
          name="name"
          placeholder={"Subject"}
        />
      </div>
    </div>
  );
};

export default FirstSection;
