"use client";

import React, { useState } from "react";
import styles from "../../styles/serviceReport.module.css";
import MultilineInput from "@/components/generic/MultilineInput";

const Remarks = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  return (
    <div className="mt-10" style={{ width: "100%" }}>
      <MultilineInput
        title={"Recommendations and remarks"}
        type={"text"}
        placeholder={"Enter description"}
        onChange={handleBrandChange}
      />
    </div>
  );
};

export default Remarks;
