import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "../components/generic/GreenButton";
import Dropdown from "./generic/dropDown";

const AddService = ({ open, handleClose, onAddService, pestList = [] }) => {
  const [serviceData, setServiceData] = useState({
    inspected_areas: "",
    pest_found: "",
    pest_id: null, // Store the pest ID here
    infestation_level: "",
    manifested_areas: "",
    report_and_follow_up_detail: "",
  });
  // Add error state for validation feedback
  const [validationError, setValidationError] = useState("");

  const pestOptions = pestList.map((pest) => pest.pest_name);

  const handleInputChange = (field, value) => {
    setServiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when the infestation level is selected
    if (field === "infestation_level" && value) {
      setValidationError("");
    }
  };

  const handleSubmit = () => {
    // Validate required field before submission
    if (!serviceData.infestation_level) {
      setValidationError("Please select an infestation level");
      return;
    }

    // If validation passes, submit the form
    onAddService(serviceData);
    setServiceData({
      inspected_areas: "",
      pest_found: "",
      infestation_level: "",
      manifested_areas: "",
      report_and_follow_up_detail: "",
    });
    setValidationError("");
    handleClose();
  };

  const handlePestChange = (value) => {
    const selectedPest = pestList.find((pest) => pest.pest_name === value);

    setServiceData((prev) => ({
      ...prev,
      pest_found: value,
      pest_id: selectedPest ? selectedPest.id : null,
    }));
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
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
          <div className={styles.serviceHead}>Services</div>

          <div className={styles.serviceDescrp}>
            Thank you for choosing us to meet your needs. We look forward to
            serving you with excellence
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Treatment Area"}
              value={serviceData.inspected_areas}
              onChange={(value) => handleInputChange("inspected_areas", value)}
            />
          </div>

          <div className="mt-5">
            {/* Changed from InputWithTitle to Dropdown for pest selection */}
            <Dropdown
              title={"Pest Found"}
              value={serviceData.pest_found}
              options={pestOptions}
              onChange={handlePestChange}
            />
          </div>

          <div className="mt-5">
            <Dropdown
              title={"Infestation Level"}
              value={serviceData.infestation_level}
              options={["High", "Medium", "Low"]}
              onChange={(value) =>
                handleInputChange("infestation_level", value)
              }
              required={true}
            />
            {validationError && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {validationError}
              </div>
            )}
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Main Infected Areas"}
              value={serviceData.manifested_areas}
              onChange={(value) => handleInputChange("manifested_areas", value)}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Report and Follow up Detail"}
              value={serviceData.report_and_follow_up_detail}
              onChange={(value) =>
                handleInputChange("report_and_follow_up_detail", value)
              }
            />
          </div>

          <div className="mt-5">
            <GreenButton title={"Submit"} onClick={handleSubmit} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddService;
