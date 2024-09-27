"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import Grid from "@mui/material/Grid"; // Import Grid from Material-UI
import MultilineInput from "@/components/generic/MultilineInput";

import { clients } from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";
import { Skeleton } from "@mui/material";

const CustomerDetails = ({ setFormData, formData }) => {
  const [name, setFullName] = useState("");
  const api = new APICall();

  const [allBrandsList, setAllBrandsList] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [selectedBrand, setSelectedClientId] = useState(null);
  const [contractReference, setContractReference] = useState("");
  const [firmName, setFirmName] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [referenceName, setReferenceName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loadingClients, setLoadingClients] = useState(true); // Add loading state

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
    setLoadingClients(true); // Set loading to true before fetching
    try {
      const response = await api.getDataWithToken(clients);
      setAllClients(response.data);
      const transformedClients = response.data.map((client) => ({
        value: client.id,
        label: client.name || client.client?.firm_name || "Unknown Client",
        data: client, // Save the entire client object for later use
      }));
      setAllBrandsList(transformedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoadingClients(false); // Stop loading after fetching
    }
  };

  const handleClientChange = (value) => {
    const selectedClient = allClients.find((client) => client.id === value);

    if (selectedClient) {
      setSelectedClientId(value);
      setFormData((prev) => ({
        ...prev,
        user_id: selectedClient.id,
      })); // Set user ID

      // Update fields
      const clientData = selectedClient.client;
      if (clientData && clientData.referencable) {
        const referenceData = clientData.referencable;
        setReferenceName(referenceData.name);
      } else {
        setReferenceName(""); // Clear if not available
      }

      setFirmName(clientData.firm_name || "");

      setAddresses(
        clientData.addresses.map((address) => ({
          value: address.id,
          label: address.address,
        }))
      );
    }
  };

  const [priority, setPriority] = useState([
    { label: "High", value: "high" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
  ]);

  const handleAddressChange = (value) => {
    const selectedAddressObj = addresses.find(
      (address) => address.value === value
    );
    setSelectedAddress(value); // Update the selected address state
    setFormData((prev) => ({
      ...prev,
      client_address_id: selectedAddressObj ? selectedAddressObj.value : "", // Set client address ID
      selectedAddress: selectedAddressObj ? selectedAddressObj.label : "", // Update formData with address
    }));
  };
  return (
    <div>
      <Grid container spacing={2} style={{ fontSize: "16px" }}>
        <Grid className="" item lg={4} xs={12} md={6}>
          {loadingClients ? (
            <Skeleton variant="rectangular" width="100%" height={50} />
          ) : (
            <Dropdown
              title={"select Client"}
              options={allBrandsList}
              onChange={handleClientChange}
              value={allBrandsList.find(
                (option) => option.value === selectedBrand
              )}
            />
          )}
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"Reference"}
            type={"text"}
            name="firmName"
            placeholder={"Reference"}
            value={referenceName}
            disable
          />
        </Grid>

        <Grid item lg={4} xs={12} md={6}>
          <Dropdown
            title={"Select address"}
            options={addresses}
            onChange={handleAddressChange}
            value={selectedAddress} // Bind the selected address
          />
        </Grid>

        <Grid lg={4} item xs={12}>
          <InputWithTitle
            title={"Job Title"}
            type={"text"}
            name="firmName"
            placeholder={"Job Title"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, job_title: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"Select Date"}
            type={"date"}
            name="date"
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, job_date: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <Dropdown
            title={"Priority"}
            options={priority}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, priority: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"Subject"}
            type={"text"}
            name="firmName"
            placeholder={"Subject"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, subject: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"TAG"}
            type={"text"}
            name="firmName"
            placeholder={"TAG"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, tag: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"trn"}
            type={"text"}
            name="TRN"
            placeholder={"TRN"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, trn: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"Vat"}
            type={"text"}
            name="vat"
            placeholder={"Vat"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, vat_per: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12}>
          <InputWithTitle
            title={"Discount"}
            type={"text"}
            name="vat"
            placeholder={"Discount"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, dis_per: value }));
            }}
          />
        </Grid>

        <Grid item lg={4} xs={12} md={6} mt={2}>
          <div>
            <label className="block font-bold mb-2">Food Watch Account</label>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, is_food_watch_account: "yes" }));
              }}
              className={`px-4 py-2 rounded ${
                formData.is_food_watch_account === "yes"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Link
            </button>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, is_food_watch_account: "no" }));
              }}
              className={`px-4 py-2 rounded ml-2 ${
                formData.is_food_watch_account === "no"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Unlink
            </button>
          </div>
        </Grid>

        <Grid item lg={12} xs={12}>
          <MultilineInput
            title={"Description"}
            type={"text"}
            placeholder={"Enter description"}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, description: value }));
            }}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Day"}
                options={brands}
              />
            </Grid>
            <Grid item xs={4}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Month"}
                options={brands}
              />
            </Grid>
            <Grid item xs={4}>
              <Dropdown
                onChange={handleBrandChange}
                title={"Year"}
                options={brands}
              />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default CustomerDetails;
