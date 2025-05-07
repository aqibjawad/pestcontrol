"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import MultilineInput from "../../../components/generic/MultilineInput";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid, Skeleton } from "@mui/material";

import Select from "react-select";

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

  useEffect(() => {
    if (formData?.user) {
      const user = formData.user;
      setSelectedClientId(user.id.toString());

      if (user.client) {
        setFirmName(user.client.firm_name || "");

        if (user.client.referencable?.name) {
          setReferenceName(user.client.referencable.name);
        }
      }

      if (formData.client_address_id) {
        setSelectedAddress(formData.client_address_id.toString());
      }

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
      const transformedClients = response.data.map((client) => ({
        value: client.id,
        label: `${(
          client.client?.firm_name || "Unknown Firm"
        ).toLowerCase()} (${client.name || "Unknown Name"})`,
        data: client,
      }));
      setAllBrandsList(transformedClients);

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

  const handleClientChange = (selectedOption) => {
    // If no option is selected
    if (!selectedOption) {
      setSelectedClientId("");
      setFormData((prev) => ({
        ...prev,
        user_id: "",
      }));
      setFirmName("");
      setReferenceName("");
      setAddresses([]);
      return;
    }

    // Get selected client
    const selectedClient = allClients.find(
      (client) => client.id === Number(selectedOption.value)
    );

    if (selectedClient) {
      setSelectedClientId(selectedOption.value);
      setFormData((prev) => ({
        ...prev,
        user_id: selectedClient.id,
      }));

      // Handle client data
      if (selectedClient.client) {
        // Set firm name
        setFirmName(selectedClient.client.firm_name || "");

        // Set reference name if exists
        if (selectedClient.client.referencable?.name) {
          setReferenceName(selectedClient.client.referencable.name);
        } else {
          setReferenceName("");
        }

        // Set addresses if exist
        if (selectedClient.client.addresses?.length) {
          const clientAddresses = selectedClient.client.addresses.map(
            (address) => ({
              value: address.id,
              label: address.address,
            })
          );
          setAddresses(clientAddresses);
        } else {
          setAddresses([]);
        }
      } else {
        // Reset values if no client data
        setFirmName("");
        setReferenceName("");
        setAddresses([]);
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

  const handleDurationChange = (value) => {
    const duration = parseInt(value) || 0;

    setFormData((prev) => {
      const updatedData = { ...prev, duration_in_months: duration };

      if (prev.quote_services && Array.isArray(prev.quote_services)) {
        const updatedServices = prev.quote_services.map((service) => {
          const monthlyJobs = service.no_of_services / duration;
          return {
            ...service,
            no_of_jobs: monthlyJobs,
          };
        });
        updatedData.quote_services = updatedServices;
      }

      if (prev.services && Array.isArray(prev.services)) {
        const updatedServices = prev.services.map((service) => ({
          ...service,
          no_of_jobs: service.total_services / duration,
        }));
        updatedData.services = updatedServices;
      }

      return updatedData;
    });
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
              {!formData?.user?.id ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Firm Name
                  </label>
                  <Select
                    className="mt-1"
                    options={allBrandsList}
                    value={
                      allBrandsList.find(
                        (option) => option.value === selectedBrand
                      ) || null
                    }
                    onChange={handleClientChange}
                    placeholder="Select a client"
                    isSearchable
                  />
                </>
              ) : (
                <InputWithTitle
                  title={"Firm Name"}
                  type={"text"}
                  placeholder={"Firm Name"}
                  value={formData?.user?.client?.firm_name}
                  defaultValue={formData?.user?.client?.firm_name}
                  disable
                  onChange={(value) => {}}
                />
              )}
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
            type={"text"}
            placeholder={"Duration in Month"}
            value={formData.duration_in_months}
            onChange={handleDurationChange}
          />
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
