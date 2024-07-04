"use client";

import React, { useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

import styles from "../../styles/schedules.module.css";

import InputWithTitle from "@/components/generic/InputWithTitle";

import GreenButton from "@/components/generic/GreenButton";

import Dropdown from "@/components/generic/Dropdown";

const Schedules = () => {
  const [name, setFullName] = useState("");
  const [brands, setBrands] = useState(["Brand A", "Brand B", "Brand C"]);

  const handleBrandChange = (name, index) => {
    console.log("test");
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h1>Schedules</h1>
      <Button onClick={handleOpen}>Open Modal</Button>
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
            height: 500, // Set a fixed height
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflow: "auto" // Make content scrollable
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            <div className={styles.scheduleTitle}>Schedules</div>
            <div className={styles.scheduleDescrp}>
              Thank you for choosing us to meet your needs. We look forward to serving you with excellence.
            </div>
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <div>
              <div className={styles.userFormContainer} style={{ fontSize: "16px", margin: "auto" }}>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"Customer Name"}
                      type={"text"}
                      name="firmName"
                      placeholder={"Customer Name"}
                    />
                  </div>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"Jobsite"}
                      type={"text"}
                      name="firmName"
                      placeholder={"Jobsite"}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"Start Date"}
                      type={"text"}
                      name="firmName"
                      placeholder={"Start Date"}
                      className={styles.fontName}
                    />
                  </div>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"Start Time"}
                      type={"text"}
                      name="firmName"
                      placeholder={"Start Time"}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"End Date"}
                      type={"text"}
                      name="firmName"
                      placeholder={"End Date"}
                      className={styles.fontName}
                    />
                  </div>
                  <div className="mt-10" style={{ width: "100%" }}>
                    <InputWithTitle
                      title={"End Time"}
                      type={"text"}
                      name="firmName"
                      placeholder={"End Time"}
                    />
                  </div>
                </div>

                <div className="mt-10" style={{ width: "100%", display: "flex", alignItems: "center" }}>
                  <InputWithTitle
                    title={"Remarks"}
                    type={"text"}
                    name="firmName"
                    placeholder={"Remarks"}
                  />
                  <div className={styles.dayBtn} style={{ marginLeft: "0" }}>
                    Day
                  </div>
                </div>

                <div className="mt-10" style={{ width: "100%" }}>
                  <InputWithTitle
                    title={"Remarks"}
                    type={"text"}
                    name="firmName"
                    placeholder={"Remarks"}
                  />
                </div>
              </div>

              <div className="mt-3 ml-20 mr-20">
                <GreenButton title={"Update"} />
              </div>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Schedules;
