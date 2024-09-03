"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "@/components/generic/MultilineInput";

const PriorityJob = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  return (
    <div>
      <div
        className={styles.userFormContainer}
        style={{ fontSize: "16px", margin: "auto" }}
      >
        <div className="mt-10" style={{ width: "100%" }}>
          <Dropdown
            onChange={handleBrandChange}
            title={"Priority"}
            options={brands}
          />
        </div>

        <div className="mt-10" style={{ width: "100%" }}>
          <InputWithTitle
            title={"Subject"}
            type={"text"}
            name="firmName"
            placeholder={"Subject"}
          />
        </div>

        <div className="mt-5" style={{ width: "100%" }}>
          <MultilineInput
            title={"Description"}
            type={"text"}
            placeholder={"Enter description"}
            onChange={handleBrandChange}

          />
        </div>

        <div className="mt-10" style={{ width: "100%" }}>
          <Dropdown
            onChange={handleBrandChange}
            title={"Duration"}
            options={brands}
          />
        </div>

        <div className="mt-10" style={{ width: "100%" }}>
          <InputWithTitle
            title={"TAG"}
            type={"text"}
            name="firmName"
            placeholder={"TAG"}
          />
        </div>

      </div>
    </div>
  );
};

export default PriorityJob;
