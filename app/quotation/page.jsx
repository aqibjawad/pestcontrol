"use client";

import React, { useState, useEffect } from "react";
import BasicQuote from "./add/basicQuote";
import ServiceAgreement from "./add/serviceagreement";
import Method from "./add/method";
import Invoice from "./add/invoice";
import TermConditions from "./add/terms";
import APICall from "@/networkUtil/APICall";
import { quotation, clients } from "../../networkUtil/Constants";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import GreenButton from "@/components/generic/GreenButton";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
} from "@mui/material";

import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/DropDown";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();
  const router = useRouter();
  const [id, setId] = useState(null);

  // Initial form state
  const [formData, setFormData] = useState({
    manage_type: id ? "update" : "create",
    quote_id: id || null,
    quote_title: "",
    user_id: "",
    client_address_id: null,
    subject: "",
    tm_ids: [],
    description: "",
    trn: "",
    tag: "",
    duration_in_months: "",
    is_food_watch_account: false,
    billing_method: "service",
    services: [],
    processedQuoteServices: false,
    branch_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const safeSetFormData = (updates) => {
    setFormData((prev) => {
      if (typeof updates === "function") {
        const newState = updates(prev);
        return newState;
      }

      const newState = {
        ...prev,
        ...updates,
        services: Array.isArray(updates.services)
          ? [...(prev.services || []), ...updates.services]
          : prev.services,
      };

      return newState;
    });
  };

  const handleSubmit = async () => {
    const hasInstallments = formData.services.some((service) =>
      service.detail.some((detail) => detail.job_type === "installments")
    );

    if (hasInstallments && formData.duration_in_months % 3 !== 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Duration in months must be Quarterly",
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = `${quotation}/manage`;
      const submissionData = {
        ...formData,
        manage_type: id ? "update" : "create",
        quote_id: id || null,
      };

      const response = await api.postDataWithTokn(endpoint, submissionData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Data has been ${id ? "updated" : "added"} successfully!`,
        });
        router.push("/viewQuote");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.error.message}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred.",
      });
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllQuotes = async () => {
    setFetchingData(true);
    try {
      if (id !== null) {
        const response = await api.getDataWithToken(`${quotation}/${id}`);
        safeSetFormData({
          ...response.data,
          manage_type: "update",
          quote_id: id,
        });
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllQuotes(urlId);
    }
  }, [id]);

  if (fetchingData) return <div>Loading...</div>;

  const [name, setName] = useState("");
  const [firm_name, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [mobile_number, setMobNumber] = useState("");
  const [industry_name, setIndustryName] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [open, setOpen] = useState(false); 

  const handleDropdownChange = (value) => {
    const selected = dropdownOptions.find((option) => option.name === value);
    setSelectedOption(selected);
    setFormData({
      ...formData,
      referencable_id: selected?.id || "",
      referencable_type: selected?.type || "",
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitClient = async () => {
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="quote-main-head pageTitle">Create Quote</div>
        <div
          className="ml-5"
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
            cursor: "pointer",
          }}
        >
          + Clients
        </div>
      </div>

      <BasicQuote setFormData={safeSetFormData} formData={formData} />
      <ServiceAgreement
        duration_in_months={formData.duration_in_months}
        setFormData={safeSetFormData}
        formData={formData}
      />
      <Method setFormData={safeSetFormData} formData={formData} />
      <TermConditions setFormData={safeSetFormData} formData={formData} />

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : id ? (
              "Update"
            ) : (
              "Submit"
            )
          }
          disabled={loading}
        />
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
            onClick={handleSubmitClient}
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

export default withAuth(Page);
