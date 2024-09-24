"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid } from "@mui/material";
import MultilineInput from "@/components/generic/MultilineInput";

const BasicQuote = ({ setFormData }) => {
  const api = new APICall();

  const [allBrandsList, setAllBrandsList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [contractReference, setContractReference] = useState("");
  const [firmName, setFirmName] = useState("");
  const [contractedBy, setContractedBy] = useState("");
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    try {
      const response = await api.getDataWithToken(clients);
      const transformedClients = response.data.map((client) => ({
        value: client.id, // use client ID as the value
        label: client.name || client.client?.firm_name || "Unknown Client", // use client name or firm name
      }));
      setAllBrandsList(transformedClients);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleDropdownChange = (name, index) => {
    const selectedClient = allBrandsList[index];
    if (selectedClient) {
      const clientData = selectedClient.client || {};

      // Update states
      setSelectedBrand(selectedClient);
      setContractReference(clientData.referencable?.name || "");
      setFirmName(clientData.firm_name || "");
      setContractedBy(clientData.referencable?.name || "");

      // Update addresses
      const addressList = clientData.addresses
        ? clientData.addresses.map((address) => address.address)
        : [];
      setAddresses(addressList);

      // Update formData
      setFormData((prev) => ({
        ...prev,
        clientAddressId: null, // Reset to ensure a new selection
        quoteTitle: "", // Clear quote title or set appropriately
        description: "", // Clear description or set appropriately
      }));
    }
  };

  const handleAddressChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      clientAddressId: value, // Assuming value is the selected address ID
    }));
  };

  const handleFirmNameChange = (value) => {
    setFirmName(value);
    setFormData((prev) => ({ ...prev, firmName: value }));
  };

  const handleTrnChange = (value) => {
    setFormData((prev) => ({ ...prev, trn: value }));
  };

  const handleTagChange = (value) => {
    setFormData((prev) => ({ ...prev, tag: value }));
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <Grid container spacing={2}>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <Dropdown
            title={"Client"}
            options={allBrandsList}
            onChange={handleDropdownChange}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Contract Reference"}
            type={"text"}
            placeholder={"Contract Reference"}
            value={contractReference}
            onChange={(value) => {
              setContractReference(value);
              setFormData((prev) => ({ ...prev, contractReference: value }));
            }}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Firm"}
            type={"text"}
            placeholder={"Firm"}
            value={firmName}
            onChange={handleFirmNameChange}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Quotes title"}
            type={"text"}
            placeholder={"Quotes title"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, quoteTitle: value }));
            }}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <Dropdown
            title={"Contracted by"}
            options={contractedBy ? [contractedBy] : []}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <Dropdown
            title={"Select address"}
            options={addresses.map((address, index) => ({
              value: index,
              label: address,
            }))}
            onChange={handleAddressChange} // Add onChange to update formData
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Subject"}
            type={"text"}
            placeholder={"Subject"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, subject: value }));
            }}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"TRN"}
            type={"text"}
            placeholder={"TRN"}
            onChange={handleTrnChange}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Tag"}
            type={"text"}
            placeholder={"Tag"}
            onChange={handleTagChange}
          />
        </Grid>
        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Duration in Month"}
            type={"text"}
            placeholder={"Duration in Month"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, durationInMonths: value }));
            }}
          />
        </Grid>
        <Grid className="mt-10" item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Food Watch Account"}
            type={"text"}
            placeholder={"Food Watch Account"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, isFoodWatchAccount: value }));
            }}
          />
        </Grid>
        <Grid item lg={6} xs={12} mt={5}>
          <MultilineInput
            title={"Description"}
            placeholder={"Enter description"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, description: value }));
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BasicQuote;
