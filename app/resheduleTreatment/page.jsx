"use client";

import React, { useState } from "react";
import styles from "../../styles/schedules.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import Dropdown from "@/components/generic/Dropdown";

const Page = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  return (
    <div>
      <h1>Reschedule Treatment</h1>
      <div>
        <div className="mt-10" style={{ width: "100%" }}>
          <InputWithTitle
            title={"Date"}
            type={"date"}
            name="firmName"
            placeholder={"Date"}
          />
        </div>
        <div className="mt-10" style={{ width: "100%" }}>
          <InputWithTitle
            title={"Time"}
            type={"time"}
            name="firmName"
            placeholder={"Time"}
          />
        </div>
        <div className="mt-10" style={{ width: "100%" }}>
          <Dropdown
            onChange={handleBrandChange}
            title={"Captian"}
            options={brands}
          />
        </div>
        <div className="mt-10" style={{ width: "100%" }}>
          <Dropdown
            onChange={handleBrandChange}
            title={"Team Member"}
            options={brands}
          />
        </div>
        <div className="mt-10" style={{ width: "100%" }}>
          <Dropdown
            onChange={handleBrandChange}
            title={"Reason"}
            options={brands}
          />
        </div>
        <div className="mt-3 ml-20 mr-20">
          <GreenButton title={"Reschedule"} />
        </div>
      </div>
    </div>
  );
};

export default Page;
