"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";

const CustomerDetails = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  return (
    <div>
      <div>
        <div
          className={styles.userFormContainer}
          style={{ fontSize: "16px", margin: "auto" }}
        >
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div className="mt-10" style={{ width: "100%" }}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Select Customer"}
                options={brands}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Job Title"}
                type={"text"}
                name="firmName"
                placeholder={"Job Title"}
              />
            </div>
          </div>
        </div>

        <div
          className={styles.userFormContainer}
          style={{ fontSize: "16px", margin: "auto" }}
        >
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Contact Person"}
                type={"text"}
                name="name"
                placeholder={"Contact Person"}
                value={name}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Contact Name"}
                options={brands}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Reference"}
                type={"text"}
                name="firmName"
                placeholder={"Reference"}
              />
            </div>
          </div>
        </div>

        <div
          className={styles.userFormContainer}
          style={{ fontSize: "16px", margin: "auto" }}
        >
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div className="mt-10" style={{ width: "100%" }}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Day"}
                options={brands}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Month"}
                options={brands}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Year"}
                options={brands}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
