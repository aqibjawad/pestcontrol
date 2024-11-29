"use client";

import React, { useState } from "react";
// import tableStyles from "../../../../../styles/upcomingJobsStyles.module.css";

import tableStyles from "../../../styles/upcomingJobsStyles.module.css";

import SearchInput from "@/components/generic/SearchInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress
} from "@mui/material";

import styles from "../../../styles/loginStyles.module.css";

import { addVendors } from "@/networkUtil/Constants";

import APICall from "@/networkUtil/APICall";
import withAuth from "@/utils/withAuth";

const rows = Array.from({ length: 10 }, (_, index) => ({
  clientName: "Olivia Rhye",
  clientContact: "10",
  quoteSend: "10",
  quoteApproved: "50",
  cashAdvance: "$50,000",
}));

const listServiceTable = () => {
  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Firm Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Manager Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Contact Number
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Number
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Email
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{row.clientName}</td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Vendor = () => {


  const api = new APICall();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",

    firm_name: "",

    mng_name: "",
    mng_contact: "",
    mng_email: "",

    acc_name: "",
    acc_contact: "",
    acc_email: "",

    percentage: "",
  });
  const [errors, setErrors] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: "",
      mng_name: "",
      mng_contact: "",
      mng_email: "",
      acc_name: "",
      acc_contact: "",
      acc_email: "",
      percentage: "",
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Firm name is required";
      isValid = false;
    }

    if (!formData.mng_name.trim()) {
      newErrors.mng_name = "Manager name is required";
      isValid = false;
    }

    if (!formData.mng_contact.trim()) {
      newErrors.mng_contact = "Manager contact is required";
      isValid = false;
    }

    if (!formData.mng_email.trim()) {
      newErrors.mng_email = "Manager email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.mng_email)) {
      newErrors.mng_email = "Invalid email format";
      isValid = false;
    }

    // Similar validations for accountant fields...

    if (!formData.percentage.trim()) {
      newErrors.percentage = "Percentage is required";
      isValid = false;
    } else if (
      isNaN(formData.percentage) ||
      parseFloat(formData.percentage) < 0 ||
      parseFloat(formData.percentage) > 100
    ) {
      newErrors.percentage = "Percentage must be between 0 and 100";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await api.postFormDataWithToken(addVendors, formData);
        console.log("Vendor added successfully:", response.data);
        handleClose();
        // You might want to refresh the vendor list here
      } catch (error) {
        console.error("Error adding vendor:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Vendors
        </div>
        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
              <SearchInput />
            </div>
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "100px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              Filters
            </div>
            <div
              onClick={handleClickOpen}
              style={{
                marginTop: "2rem",
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              + Vendors
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "44px",
              width: "202px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1rem",
              padding: "12px, 16px, 12px, 16px",
              borderRadius: "10px",
            }}
          >
            Download all
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ backgroundColor: "white" }}>
          <div>
            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "600",
                marginTop: "2.6rem",
              }}
            >
              Add Vendor
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

            {/* Vendor Area */}
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div style={{ color: "#344054", marginBottom: "0.5rem" }}>
                Vendor
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Vendor name{" "}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Manager name"
                  />
                  {errors.name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Vendor number{" "}
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact number"
                  />
                  {errors.phone_number && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.phone_number}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Vendor Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Firm name
                </div>
                <div>
                  <input
                    type="email"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "489px",
                      height: "49px",
                    }}
                    placeholder="Please enter email"
                  />
                </div>
              </div>
            </div>

            {/* Manager Area */}
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div style={{ color: "#344054", marginBottom: "0.5rem" }}>
                Manager
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Manager name{" "}
                  </label>
                  <input
                    type="text"
                    name="mng_name"
                    value={formData.mng_name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Manager name"
                  />
                  {errors.mng_name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.mng_name}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Contact number{" "}
                  </label>
                  <input
                    type="text"
                    name="mng_contact"
                    value={formData.mng_contact}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact number"
                  />
                  {errors.mng_contact && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.mng_contact}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="mng_email"
                    value={formData.mng_email}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Email"
                  />
                  {errors.mng_email && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.mng_email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Accountant Area */}
            {/* Accountant Area */}
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div style={{ color: "#344054", marginBottom: "0.5rem" }}>
                Accountant
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="acc_name"
                    value={formData.acc_name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Accountant name"
                  />
                  {errors.acc_name && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.acc_name}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Contact number
                  </label>
                  <input
                    type="text"
                    name="acc_contact"
                    value={formData.acc_contact}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact number"
                  />
                  {errors.acc_contact && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.acc_contact}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="acc_email"
                    value={formData.acc_email}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Email"
                  />
                  {errors.acc_email && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {errors.acc_email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Percentage
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px", // Adjust padding for the image
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Percentage"
                  />
                  <img
                    src="/Vector.png"
                    alt="icon"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "48px",
              width: "325px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: "10px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Vendor"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withAuth(Vendor);
