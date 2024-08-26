"use client";

import React, { useState, useEffect, useRef } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import styles from "../../../styles/loginStyles.module.css";

const Address = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components;
        const geometry = place.geometry;

        if (addressComponents) {
          const address = addressComponents
            .map((component) => component.long_name)
            .join(" ");
          const city =
            addressComponents.find((component) =>
              component.types.includes("locality")
            )?.long_name || "";
          const latitude = geometry.location.lat();
          const longitude = geometry.location.lng();

          setAddress(address);
          setCity(city);
          setLatitude(latitude);
          setLongitude(longitude);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "600",
                marginTop: "2.6rem",
              }}
            >
              Add Addresses
            </div>

            <div
              style={{
                color: "#667085",
                fontSize: "16px",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Thank you for choosing us to meet your needs. We look forward to
              serving you with excellence
            </div>

            {/* Here I'm applying Grid */}

            <div className="grid grid-cols-12 gap-4 mt-10">
              {/* Left Grid */}
              <div className="col-span-8 md:col-span-9">
                <div className={styles.userFormContainer}>
                  <div style={{ position: "relative", width: "489px" }}>
                    <input
                      ref={inputRef}
                      type="search"
                      style={{
                        border: "1px solid #38A73B",
                        borderRadius: "8px",
                        padding: "12px 16px 12px 40px",
                        width: "100%",
                        height: "49px",
                        boxSizing: "border-box",
                      }}
                      placeholder="Search"
                    />
                  </div>
                </div>

                <div className={styles.userFormContainer}>
                  <div
                    style={{
                      color: "#344054",
                      fontSize: "16px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Address
                  </div>
                  <div style={{ position: "relative", width: "489px" }}>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        border: "1px solid #38A73B",
                        borderRadius: "8px",
                        padding: "12px 16px 12px 40px",
                        width: "100%",
                        height: "49px",
                        boxSizing: "border-box",
                      }}
                      placeholder="Please enter Address"
                    />
                  </div>
                </div>

                <div className={styles.userFormContainer}>
                  <div
                    style={{
                      color: "#344054",
                      fontSize: "16px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    City
                  </div>
                  <div style={{ position: "relative", width: "489px" }}>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        border: "1px solid #38A73B",
                        borderRadius: "8px",
                        padding: "12px 16px 12px 40px",
                        width: "100%",
                        height: "49px",
                        boxSizing: "border-box",
                      }}
                      placeholder="Please enter City"
                    />
                  </div>
                </div>

                <div
                  className={styles.userFormContainer}
                  style={{ fontSize: "16px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        style={{ marginBottom: "0.5rem", color: "#344054" }}
                      >
                        {" "}
                        Latitude{" "}
                      </label>
                      <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        style={{
                          border: "1px solid #38A73B",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          width: "100%",
                          height: "49px",
                          boxSizing: "border-box",
                        }}
                        placeholder="Latitude"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        style={{ marginBottom: "0.5rem", color: "#344054" }}
                      >
                        {" "}
                        Longitude{" "}
                      </label>
                      <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        style={{
                          border: "1px solid #38A73B",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          width: "100%",
                          height: "49px",
                          boxSizing: "border-box",
                        }}
                        placeholder="Longitude"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Grid */}
              <div className="col-span-4 md:col-span-3 flex justify-center items-center">
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    border: "2px dotted #344054",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="/path/to/your/plus-icon.png"
                    alt="Add"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.btnCont}>
            <div className={styles.addBtn}>Add Addresses</div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Address;
