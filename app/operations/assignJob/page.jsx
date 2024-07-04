"use client";
import React, { useState } from "react";
import styles from "../../../styles/operations/assignJobStyles.module.css";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
const Page = () => {
  const [memberName, setMemberNames] = useState([
    "Umair",
    "Akbar",
    "Aslam",
    "Sajid",
    "Aqib",
  ]);

  const userInforItem = (title, value) => {
    return (
      <div className="mt-10">
        <div className="flex mr-20 ml-20">
          <div className="flex-grow">
            <div className={styles.itemTitle}>{title}</div>
          </div>
          <div className={styles.itemValue}>{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Assign Job</div>
      <div className="mt-20">
        {userInforItem("Job Title", "Pest Control Item")}
        {userInforItem("Region", "Duabi")}
        {userInforItem("Address", "JLT Marina Near Jumera Lake")}
        {userInforItem("Date", "5 May 2024")}
        {userInforItem("Client Contact", "090078601")}
      </div>

      <div className="flex justify-center align-center mt-20">
        <div className="pageTitle">Assign Crew Members</div>
      </div>
      <div className="mt-5">
        <Dropdown title={"Select Captain"} options={memberName} />
      </div>

      <div className="mt-5">
        <Dropdown title={"Add Crew Members"} options={memberName} />
      </div>

      <div className="mt-5">
        <MultilineInput placeholder={"Job Details"} title={"Job Details"} />
      </div>
      <div className="mt-10">
        <GreenButton title={"Submit"} />
      </div>
    </div>
  );
};

export default Page;
