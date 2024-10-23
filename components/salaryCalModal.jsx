import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "./generic/GreenButton";
import Dropdown from "../components/generic/Dropdown";

import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const SalaryCalculation = ({
  openUseChemicals,
  handleCloseUseChemicals,
  onAddChemical,
}) => {
  const api = new APICall();

  const [chemicalData, setChemicalData] = useState({
    product_id: "",
    name: "",
    dose: "",
    qty: "",
  });


  const handleInputChange = (field, value) => {
    setChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onAddChemical(chemicalData);
    setChemicalData({
      product_id: "",
      name: "",
      dose: "",
      qty: "",
      price:0,
    });
    handleCloseUseChemicals();
  };

  return (
    <Modal
      open={openUseChemicals}
      onClose={handleCloseUseChemicals}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <div className={styles.serviceHead}> Salary Calculations </div>
        <div className="mt-5">
          <InputWithTitle
            title="Dose"
            type="text"
            placeholder="Dose"
            value={chemicalData.dose}
            onChange={(value) => handleInputChange("dose", value)}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title="qty"
            type="text"
            placeholder="qty"
            value={chemicalData.qty}
            onChange={(value) => handleInputChange("qty", value)}
          />
        </div>
        <div className="mt-5">
          <GreenButton title="Submit" onClick={handleSubmit} />
        </div>
      </Box>
    </Modal>
  );
};

export default SalaryCalculation;
