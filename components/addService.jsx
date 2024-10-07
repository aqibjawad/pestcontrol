import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "../components/generic/GreenButton";

const AddService = ({ open, handleClose, onAddService, fromData, setFormData }) => {
  const [serviceData, setServiceData] = useState({
    inspected_areas: "",
    pestFound: "",
    infestation_level: "",
    manifested_areas: "",
    report_and_follow_up_detail: "",
  });

  const handleInputChange = (field, value) => {
    setServiceData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onAddService(serviceData);
    setServiceData({
      inspected_areas: "",
      pestFound: "",
      infestation_level: "",
      manifested_areas: "",
      report_and_follow_up_detail: "",
    });
    handleClose();
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
              title={"Inspected areas"}
              value={serviceData.inspected_areas}
              onChange={(value) => handleInputChange("inspected_areas", value)}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Pest found"}
              value={serviceData.pestFound}
              onChange={(value) => handleInputChange("pestFound", value)}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Infestation level"}
              value={serviceData.infestation_level}
              onChange={(value) => handleInputChange("infestation_level", value)}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Manifested areas"}
              value={serviceData.manifested_areas}
              onChange={(value) => handleInputChange("manifested_areas", value)}
            />
          </div>

          <div className="mt-5">
            <InputWithTitle
              title={"Report and follow up detail"}
              value={serviceData.report_and_follow_up_detail}
              onChange={(value) => handleInputChange("report_and_follow_up_detail", value)}
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
