"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import MultilineInput from "../../../components/generic/MultilineInput";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid, Skeleton } from "@mui/material";

const BasicQuote = ({ setFormData, formData }) => {
  const api = new APICall();

  const [allBrandsList, setAllBrandsList] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [selectedBrand, setSelectedClientId] = useState("");
  const [firmName, setFirmName] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [referenceName, setReferenceName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    getAllClients();
  }, []);

  // Handle pre-selected client data
  useEffect(() => {
    if (formData?.user) {
      const user = formData.user;
      setSelectedClientId(user.id.toString());

      if (user.client) {
        setFirmName(user.client.firm_name || "");

        // Set reference name from the nested referencable
        if (user.client.referencable?.name) {
          setReferenceName(user.client.referencable.name);
        }
      }

      // Pre-select the address if client_address_id is provided
      if (formData.client_address_id) {
        setSelectedAddress(formData.client_address_id.toString());
      }

      // Update form data with the pre-selected user
      setFormData((prev) => ({
        ...prev,
        user_id: user.id,
      }));
    }
  }, [formData?.user]);

  const getAllClients = async () => {
    setLoadingClients(true);
    try {
      const response = await api.getDataWithToken(clients);
      setAllClients(response.data);

      // Transform clients data
      const transformedClients = response.data.map((client) => ({
        value: client.id,
        label: client.name || client.client?.firm_name || "Unknown Client",
        data: client,
      }));
      setAllBrandsList(transformedClients);

      // If we have a pre-selected client, set their addresses
      if (formData?.user?.id) {
        const selectedClient = response.data.find(
          (client) => client.id === formData.user.id
        );
        if (selectedClient?.client?.addresses) {
          const clientAddresses = selectedClient.client.addresses.map(
            (address) => ({
              value: address.id,
              label: address.address,
            })
          );
          setAddresses(clientAddresses);
        }
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleClientChange = (e) => {
    const value = e.target.value;
    const selectedClient = allClients.find(
      (client) => client.id === Number(value)
    );

    if (selectedClient) {
      setSelectedClientId(value);
      setFormData((prev) => ({
        ...prev,
        user_id: selectedClient.id,
      }));

      if (selectedClient.client) {
        setFirmName(selectedClient.client.firm_name || "");

        if (selectedClient.client.referencable?.name) {
          setReferenceName(selectedClient.client.referencable.name);
        }

        if (selectedClient.client.addresses) {
          const clientAddresses = selectedClient.client.addresses.map(
            (address) => ({
              value: address.id,
              label: address.address,
            })
          );
          setAddresses(clientAddresses);
        }
      }
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    const selectedAddressObj = addresses.find(
      (address) => address.value === Number(value)
    );
    setSelectedAddress(value);
    setFormData((prev) => ({
      ...prev,
      client_address_id: selectedAddressObj ? selectedAddressObj.value : "",
      selectedAddress: selectedAddressObj ? selectedAddressObj.label : "",
    }));
  };

  return (
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <Grid container spacing={2}>
        <Grid className="" item lg={6} xs={12} md={6} mt={2}>
          {loadingClients ? (
            <Skeleton variant="rectangular" width="100%" height={50} />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Client
              </label>
              <select
                className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleClientChange}
                value={selectedBrand || ""}
              >
                <option value="">Select a client</option>
                {allBrandsList.map((client) => (
                  <option key={client.value} value={client.value}>
                    {client.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Contract Reference"}
            type={"text"}
            placeholder={"Contract Reference"}
            value={referenceName}
            defaultValue={referenceName}
            disable
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Firm"}
            type={"text"}
            placeholder={"Firm"}
            value={firmName}
            defaultValue={firmName}
            disable
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Address
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleAddressChange}
              value={selectedAddress || ""}
            >
              <option value="">Select an address</option>
              {addresses.map((address) => (
                <option key={address.value} value={address.value}>
                  {address.label}
                </option>
              ))}
            </select>
          </div>
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Quotes title"}
            type={"text"}
            placeholder={"Quotes title"}
            value={formData.quote_title}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, quote_title: value }));
            }}
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Subject"}
            type={"text"}
            placeholder={"Subject"}
            value={formData.subject}
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
            value={formData.trn}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, trn: value }));
            }}
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Tag"}
            type={"text"}
            placeholder={"Tag"}
            value={formData.tag}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, tag: value }));
            }}
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Duration in Month"}
            type={"number"}
            placeholder={"Duration in Month"}
            value={formData.duration_in_months}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, duration_in_months: value }));
            }}
          />
        </Grid>

        <Grid className="mt-5" item lg={6} xs={12} md={6} mt={2}>
          <div>
            <label className="block font-bold mb-2">Food Watch Account</label>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, isFoodWatchAccount: "yes" }));
              }}
              className={`px-4 py-2 rounded ${
                formData.isFoodWatchAccount === "yes"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Link
            </button>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, isFoodWatchAccount: "no" }));
              }}
              className={`px-4 py-2 rounded ml-2 ${
                formData.isFoodWatchAccount === "no"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              Unlink
            </button>
          </div>
        </Grid>

        <Grid item lg={12} xs={12} mt={5}>
          <MultilineInput
            title={"Description"}
            placeholder={"Enter description"}
            value={formData.description}
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
