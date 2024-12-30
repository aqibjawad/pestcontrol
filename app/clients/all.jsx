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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { clients } from "@/networkUtil/Constants";
import Dropdown from "../../components/generic/Dropdown";
import InputWithTitle from "../../components/generic/InputWithTitle";
import { AppHelpers } from "../../Helper/AppHelpers";
import Link from "next/link";

import Swal from "sweetalert2";

import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { MoreVerticalIcon } from "lucide-react";
import InputWithTitleWithClearButton from "../../components/generic/InputWithTitleWithClearButton";

const AllClients = () => {
  const api = new APICall();
  const router = useRouter();
  const [fetchingData, setFetchingData] = useState(false);

  const [brandsList, setBrandsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [allClientsList, setAllClientsList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [name, setName] = useState("");
  const [firm_name, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [mobile_number, setMobNumber] = useState("");
  const [industry_name, setIndustryName] = useState("");
  const [opening_balance, setOpeningBalance] = useState(0);
  const [filterClientName, setFilterClientName] = useState();
  const [allClients, setAllClients] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  // State for form inputs
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
                    <Skeleton width={500} />
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

          {/* Skeleton for Pagination */}
          <div className="flex justify-center py-4">
            <Skeleton variant="rectangular" width={40} height={40} />
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              style={{ marginLeft: "8px" }}
            />
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              style={{ marginLeft: "8px" }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Client Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Sales Man
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Phone Number
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Email
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Firm
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Date
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Balance
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allClientsList?.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-5 px-4">{row.name}</td>
                <td className="py-5 px-4">{row?.client.referencable?.name}</td>
                <td className="py-2 px-4">{row?.client?.phone_number}</td>
                <td className="py-5 px-4">{row.email}</td>
                <td className="py-2 px-4">{row?.client?.firm_name}</td>
                <td className="py-2 px-4">
                  {AppHelpers.convertDate(row.created_at)}
                </td>
                <td className="py-5 px-4">{row.current_balance}</td>
                <td className="py-2 px-4">
                  <IconButton
                    aria-label="more"
                    aria-controls={`action-menu-${index}`}
                    aria-haspopup="true"
                    onClick={(e) => handleClick(e, index)}
                  >
                    <MoreVerticalIcon />
                  </IconButton>
                  <Menu
                    id={`action-menu-${index}`}
                    anchorEl={anchorEl}
                    keepMounted
                    open={activeRow === index && Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={handleCloseMenu}>
                      <Link
                        href={`/client/clientsJobs/?id=${
                          row.id
                        }&name=${encodeURIComponent(
                          row.name
                        )}&phone_number=${encodeURIComponent(
                          row?.client?.phone_number
                        )}`}
                        className="text-gray-700 w-full"
                      >
                        View Jobs
                      </Link>
                    </MenuItem>

                    <MenuItem onClick={handleCloseMenu}>
                      <Link
                        href={`/client/clientLedger/?id=${
                          row.id
                        }&name=${encodeURIComponent(
                          row.name
                        )}&phone_number=${encodeURIComponent(
                          row?.client?.phone_number
                        )}`}
                        className="text-gray-700 w-full"
                      >
                        View Ledger
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                      <Link
                        href={`/serviceInvoices/add?id=${
                          row.id
                        }&name=${encodeURIComponent(row.name)}`}
                        className="text-gray-700 w-full"
                      >
                        Add Payment
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>
                      <Link
                        href={`/address?id=${row.id}&name=${encodeURIComponent(
                          row.name
                        )}&phone_number=${encodeURIComponent(
                          row?.client?.phone_number
                        )}`}
                        className="text-gray-700 w-full"
                      >
                        Add Address
                      </Link>
                    </MenuItem>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Component */}
        {/* <div className="flex justify-center py-4">
          <button className="px-3 py-1 bg-gray-200 rounded-full">1</button>
          <button className="px-3 py-1 bg-gray-200 rounded-full ml-2">2</button>
          <button className="px-3 py-1 bg-gray-200 rounded-full ml-2">3</button>
        </div> */}
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
      setAllClients(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const [formData, setFormData] = useState({
    referencable_id: "",
    referencable_type: "",
    // other fields...
  });

  const handleDropdownChange = (value) => {
    const selected = dropdownOptions.find((option) => option.name === value);
    setSelectedOption(selected);
    setFormData({
      ...formData,
      referencable_id: selected?.id || "",
      referencable_type: selected?.type || "",
    });
  };

  const handleSubmit = async () => {
    setSendingData(true);

    const obj = {
      name,
      firm_name,
      email,
      phone_number,
      mobile_number,
      industry_name,
      referencable_id: formData.referencable_id,
      referencable_type: formData.referencable_type,
      opening_balance: 0,
    };
    const response = await api.postFormDataWithToken(`${clients}/create`, obj);

    if (response.status === "success") {
      const clientId = response.data.id;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      });
      // await getAllClients();
      handleClose();
      router.push(`/address?id=${clientId}`);
    } else {
      handleClose();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${response.error.message}`,
      });
    }
  };

  const handleFilterByName = (value) => {
    setFilterClientName(value);
  };

  useEffect(() => {
    if (filterClientName) {
      if (filterClientName.length > 0) {
        const searchTerm = filterClientName.toLowerCase();
        const filtered = allClients.filter(
          (client) =>
            client?.name?.toLowerCase().includes(searchTerm) ||
            client?.email?.toLowerCase().includes(searchTerm) ||
            client?.client.phone_number?.toLowerCase().includes(searchTerm) ||
            client?.client.mobile_number?.toLowerCase().includes(searchTerm) ||
            client?.client.referencable.name
              ?.toLowerCase()
              .includes(searchTerm) ||
            client?.client?.firm_name?.toLowerCase().includes(searchTerm)
        );
        setAllClientsList(filtered);
      } else {
        setAllClientsList(allClients);
      }
    } else {
      setAllClientsList(allClients);
    }
  }, [filterClientName]);

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
            <InputWithTitleWithClearButton
              title={"Search Clients"}
              onChange={handleFilterByName}
              value={filterClientName}
              placeholder="Search Clients"
            />
            <div
              className="ml-5 mt-7"
              onClick={handleClickOpen}
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
                borderRadius: "10px",
              }}
            >
              + Clients
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></div>
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
                  title={"Name"}
                  label="Full name"
                  name="name"
                  value={name}
                  onChange={setName}
                  variant="outlined"
                  fullWidth
                  placeholder="Manager name"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  title={"Firm Name"}
                  label="Firm Name"
                  name="firm_name"
                  value={firm_name}
                  onChange={setFirmName}
                  variant="outlined"
                  fullWidth
                  placeholder="Firm Name"
                />
              </Grid>

              <Grid item lg={6}>
                <InputWithTitle
                  title={"Email"}
                  label="Email"
                  name="email"
                  value={email}
                  onChange={setEmail}
                  variant="outlined"
                  fullWidth
                  placeholder="Please enter Email"
                />
              </Grid>
              <Grid item lg={6}>
                <InputWithTitle
                  title={"Phone Number"}
                  label="Phone Number"
                  name="phone_number"
                  value={phone_number}
                  onChange={setPhoneNumber}
                  variant="outlined"
                  fullWidth
                  placeholder="Please enter Phone Number"
                />
              </Grid>
              <Grid item lg={6}>
                <InputWithTitle
                  title={"Mobile Number"}
                  label="Mobile Number"
                  name="mobile_number"
                  value={mobile_number}
                  onChange={setMobNumber}
                  variant="outlined"
                  fullWidth
                  placeholder="Please enter Mobile Number"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  title={"Industry Name"}
                  label="Industry Name"
                  name="industry_name"
                  value={industry_name}
                  onChange={setIndustryName}
                  variant="outlined"
                  fullWidth
                  placeholder="Industry Name"
                />
              </Grid>
            </Grid>

            <Grid item container spacing={2}>
              <Grid item lg={12} xs={12} sm={6}>
                <Dropdown
                  title="Select Reference"
                  options={dropdownOptions.map((option) => option.name)}
                  onChange={handleDropdownChange}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={2}></Grid>
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

export default AllClients;
