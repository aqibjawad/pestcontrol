"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import styles from "../../styles/loginStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { clients } from "@/networkUtil/Constants";
import Dropdown from "../../components/generic/Dropdown";

import { AppHelpers } from "../../Helper/AppHelpers";

const rows = Array.from({ length: 10 }, (_, index) => ({
  clientName: "Olivia Rhye",
  clientContact: "10",
  quoteSend: "10",
  quoteApproved: "50",
  cashAdvance: "$50,000",
}));

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState([]);

  const [clientsList, setClientsList] = useState([]);

  const [brandName, setBrandName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [open, setOpen] = useState(false);

  // For dropdown
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [myClients, setMyClients] = useState();

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    firm_name: "",
    email: "",
    phone_number: "",
    mobile_number: "",
    industry_name: "",
    referencable_id: "",
    referencable_type: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getAllRef();
    getAllClients();
  }, []);

  const listServiceTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Customer
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Phone Number
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Firm
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {clientsList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{row.name}</td>
                <td className="py-2 px-4">{row.phone}</td>
                <td className="py-2 px-4">{row.firm_name}</td>
                <td className="py-2 px-4">
                  {AppHelpers.convertDate(row.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getAllRef = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${clients}/references/get`);
      setBrandsList(response);

      // Ensure response.data contains the type field
      const options = response.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type, // Ensure this field is included
      }));
      setDropdownOptions(options);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllClients = async () => {
    try {
      const response = await api.getDataWithToken(clients);
      var clientsList = [];
      response.data.map((item) => {
        let client = {
          name: item.name,
          email: item.email,
          phone: item.client[0].phone_number,
          firm_name: item.client[0].firm_name,
          date: item.created_at,
        };
        clientsList.push(client);
      });
      console.log(clientsList);

      setClientsList(clientsList);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDropdownChange = (value) => {
    const selected = dropdownOptions.find((option) => option.name === value);
    console.log(selected);

    setSelectedOption(selected);
    setFormData({
      ...formData,
      referencable_id: selected?.id || "",
      referencable_type: selected?.type || "", // Ensure the type is available in your options
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setSendingData(true);
    try {
      await api.postFormDataWithToken(`${clients}/create`, formData);
      // Handle success (e.g., show a success message, close the dialog, etc.)
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    } finally {
      setSendingData(false);
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
          Clients
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
              + Clients
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
              Add Clients
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
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Full name
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
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Firm Name
                  </label>
                  <input
                    type="text"
                    name="firm_name"
                    value={formData.firm_name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Firm Name"
                  />
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
                  Email
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Email"
                  />
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
                  Phone Number
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Phone Number"
                  />
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
                  Mobile Number
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Mobile Number"
                  />
                </div>
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
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Industry Name
                  </label>
                  <input
                    type="text"
                    name="industry_name"
                    value={formData.industry_name}
                    onChange={handleInputChange}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Industry Name"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Dropdown
                    title="Select Option"
                    options={dropdownOptions.map((option) => option.name)}
                    onChange={handleDropdownChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <div
            onClick={handleSubmit}
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
              cursor: "pointer",
            }}
          >
            {sendingData ? "Adding..." : "Add Client"}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
