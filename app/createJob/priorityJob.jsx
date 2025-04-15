"use client";

import React, { useState } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/dropDown";
import MultilineInput from "@/components/generic/MultilineInput";
import Grid from "@mui/material/Grid"; // Import Grid from Material-UI

const PriorityJob = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        className={styles.userFormContainer}
        style={{ fontSize: "16px", margin: "auto" }}
      >

      </Grid>
    </div>
  );
};

export default PriorityJob;
