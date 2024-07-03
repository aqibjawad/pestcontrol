"use client";

import React, { useState } from "react";

import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";

const ServiceProduct = () => {
  const [name, setName] = useState("");

  const [firmName, setFirmName] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const [contractedList, setContractedList] = useState([]);

  const handleFirmNameChange = (e) => {
    setFirmName(e.target.value);
  };

  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      <div className="mt-10" style={{ width: "25%" }}>
        <Dropdown
          title={"Service Product"}
          options={contractedList && contractedList}
        />
      </div>

      <div className="mt-10" style={{ width: "25%" }}>
        <InputWithTitle
          title={"Contact Person"}
          type={"text"}
          name="name"
          placeholder={"Contact Person"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10" style={{ width: "25%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <InputWithTitle
            title={"No of Month"}
            type={"text"}
            name="firmName"
            placeholder={"No of Month"}
            value={firmName}
            onChange={handleFirmNameChange}
          />
          <Dropdown
            title={"Service"}
            options={contractedList && contractedList}
          />
        </div>
      </div>

      <div className="mt-10" style={{ width: "25%" }}>
        <InputWithTitle
          title={"Sub Total"}
          type={"text"}
          name="firmName"
          placeholder={"Sub Total"}
          value={firmName}
          onChange={handleFirmNameChange}
        />
      </div>
    </div>
  );
};

const FourthSection = () => {
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
      style={{ fontSize: "16px", margin: "auto", border: "1px solid #EAECF0", padding: "20px", marginTop:"2rem"}}
    >
      {ServiceProduct()}

      <div style={{ display: "flex", gap: "10rem", marginTop: "1rem" }}>
        <div className="mt-10">
          <div
            style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
          >
            October 30, 2017
          </div>
        </div>

        <div
          className="mt-10"
          style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
        >
          <div>October 30, 2017</div>
        </div>

        <div
          className="mt-10"
          style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
        >
          <div>October 30, 2017</div>
        </div>

        <div
          className="mt-10"
          style={{ color: "#667085", fontWeight: "500", fontSize: "14px" }}
        >
          <div>October 30, 2017</div>
        </div>

        <div
          className="mt-10"
          style={{ color: "#38A73B", fontWeight: "500", fontSize: "14px" }}
        >
          <div>Edit</div>
        </div>
      </div>

      <div
        className="mt-5"
        style={{ border: "1px solid #D0D5DD", width: "100%", padding: "30px" }}
      >
        <div style={{ color: "#344054" }}>. Flies</div>

        <div className="mt-5" style={{ color: "#344054" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, se met,
          consectetur adipiscing elit, se met, consectetur adipiscing elit,
          semet, consectetur adipiscing elit, semet, consectetur adipiscing
          elit, semet, consectetur adipiscing elit, semet, consectetur
          adipiscing elit, semet, consectetur adipiscing elit, se
        </div>
      </div>
      {ServiceProduct()}
    </div>
  );
};

export default FourthSection;
