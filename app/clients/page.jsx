"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { clients } from "@/networkUtil/Constants";
import Dropdown from "../../components/generic/Dropdown";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { AppHelpers } from "../../Helper/AppHelpers";
import Link from "next/link";

const Page = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [allClientsList, setAllClientsList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

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
    opening_balance: "",
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
    if (fetchingData) {
      return (
        <div className={tableStyles.tableContainer}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {[
                  "Customer",
                  "Phone Number",
                  "Firm",
                  "Date",
                  "Add Address",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-5 px-4 border-b border-gray-200 text-left"
                  >
                    <Skeleton width="80%" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-5 px-4">
                    <Skeleton />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton />
                  </td>
                  <td className="py-2 px-4">
                    <Skeleton />
                  </td>
                  <td>
                    <Skeleton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

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
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Add Address
              </th>
            </tr>
          </thead>
          <tbody>
            {allClientsList.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{row.name}</td>
                <td className="py-2 px-4">{row?.client?.phone_number}</td>
                <td className="py-2 px-4">{row?.client?.firm_name}</td>
                <td className="py-2 px-4">
                  {AppHelpers.convertDate(row.created_at)}
                </td>
                <td>
                  <Link
                    href={`/address?id=${row.id}&name=${encodeURIComponent(
                      row.name
                    )}&phone_number=${encodeURIComponent(
                      row?.client?.phone_number
                    )}`}
                  >
                    <span className="text-blue-600 hover:text-blue-800">
                      Add Address
                    </span>
                  </Link>
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
      const options = response.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
      }));
      setDropdownOptions(options);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllClients = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(clients);
      setAllClientsList(response.data);
      const clientsList = response.data.map((item) => ({
        name: item.name,
        email: item.email,
        phone: item.client[0].phone_number,
        firm_name: item.client[0].firm_name,
        date: item.created_at,
      }));
      setClientsList(clientsList);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDropdownChange = (value) => {
    const selected = dropdownOptions.find((option) => option.name === value);
    setSelectedOption(selected);
    setFormData({
      ...formData,
      referencable_id: selected?.id || "",
      referencable_type: selected?.type || "",
    });
  };

  const handleInputChange = (name) => (value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setSendingData(true);
    try {
      await api.postFormDataWithToken(`${clients}/create`, formData);
      // Optionally, refresh the client list after submission
      await getAllClients();
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
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
                marginLeft: "1rem",
                cursor: "pointer",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h5" align="center" fontWeight="600">
                Add Clients
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" color="textSecondary" align="center">
                Thank you for choosing us to meet your needs. We look forward to
                serving you with excellence
              </Typography>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  label="Full name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Manager name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  label="Firm Name"
                  name="firm_name"
                  value={formData.firm_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Firm Name"
                />
              </Grid>
            </Grid>
            <Grid item>
              <InputWithTitle
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                placeholder="Please enter Email"
              />
            </Grid>
            <Grid item>
              <InputWithTitle
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                placeholder="Please enter Phone Number"
              />
            </Grid>
            <Grid item>
              <InputWithTitle
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                placeholder="Please enter Mobile Number"
              />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  label="Opening Balance"
                  name="opening_balance"
                  value={formData.opening_balance}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Opening Balance"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Dropdown
                  title="Select Option"
                  options={dropdownOptions.map((option) => option.name)}
                  onChange={handleDropdownChange}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  label="Industry Name"
                  name="industry_name"
                  value={formData.industry_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Industry Name"
                />
              </Grid>
            </Grid>
          </Grid>
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
