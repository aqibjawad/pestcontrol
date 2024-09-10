import React from "react";
import { Modal, Button, Box, Typography } from "@mui/material";

import styles from "../styles/serviceReport.module.css";

import InputWithTitle from "./generic/InputWithTitle";

import GreenButton from "../components/generic/GreenButton";

const AddChemicals = ({ openChemicals, handleCloseChemicals }) => {
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
        <div className={styles.serviceHead}> Chemicals and material </div>

        <div className={styles.serviceDescrp}>
          Thank you for choosing us to meet your needs. We look forward to serving you with excellenc
        </div>

        <div className="mt-5">
          <InputWithTitle title={"Chemicals and material"} />
        </div>

        <div className="mt-5">
          <InputWithTitle title={"Dose"} />
        </div>

        <div className="mt-5">
          <InputWithTitle title={"Quantity"} />
        </div>

        <div className="mt-5">
          <InputWithTitle title={"Price"} />
        </div>

        <div className="mt-5">
          <GreenButton title={"Submit"} />
        </div>
      </Box>
    </Modal>
  );
};

export default AddChemicals;
