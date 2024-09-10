import React, { useState } from "react";
import { Modal, Box } from "@mui/material";

import styles from "../styles/serviceReport.module.css";

import InputWithTitle from "./generic/InputWithTitle";

import GreenButton from "../components/generic/GreenButton"

const AddService = ({ open, handleClose }) => {
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
            serving you with excellenc
          </div>

          <div className="mt-5">
            <InputWithTitle title={"Inspected areas"} />
          </div>

          <div className="mt-5">
            <InputWithTitle title={"Pest found"} />
          </div>

          <div className="mt-5">
            <InputWithTitle title={"Infestation level"} />
          </div>

          <div className="mt-5">
            <InputWithTitle title={"Manifested areas"} />
          </div>

          <div className="mt-5">
            <InputWithTitle title={"Report and follow up detail"} />
          </div>

          <div className="mt-5">
            <GreenButton title={"Submit"} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddService;
