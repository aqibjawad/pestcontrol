import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "./generic/GreenButton";

const AddExtraChemicals = ({
  openChemicals,
  handleCloseChemicals,
  onAddExtraChemical,
}) => {
  const [extraChemicalData, setExtraChemicalData] = useState({
    name: "",
    dose: "",
    quantity: "",
    price: "",
  });

  const handleInputChange = (field, value) => {
    setExtraChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onAddExtraChemical(extraChemicalData);
    setExtraChemicalData({
      name: "",
      dose: "",
      quantity: "",
      price: "",
    });
    handleCloseChemicals();
  };

  return (
    <Modal
      open={openChemicals}
      onClose={handleCloseChemicals}
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
        <div className={styles.serviceHead}>Extra Chemicals and material</div>
        <div className={styles.serviceDescrp}>
          Thank you for choosing us to meet your needs. We look forward to
          serving you with excellence
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Chemicals and material"}
            value={extraChemicalData.name}
            onChange={(value) => handleInputChange("name", value)}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Dose"}
            value={extraChemicalData.dose}
            onChange={(value) => handleInputChange("dose", value)}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Quantity"}
            value={extraChemicalData.quantity}
            onChange={(value) => handleInputChange("quantity", value)}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Price"}
            value={extraChemicalData.price}
            onChange={(value) => handleInputChange("price", value)}
          />
        </div>

        <div className="mt-5">
          <GreenButton title={"Submit"} onClick={handleSubmit} />
        </div>
      </Box>
    </Modal>
  );
};

export default AddExtraChemicals;
