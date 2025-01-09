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
        label: client.name || client.client?.firm_name || "Unknown Client",
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

  const handleJobsPerMonthChange = (index, value) => {
    const jobsPerMonth = parseFloat(value) || 0;
    const totalServices = jobsPerMonth * (formData.duration_in_months || 1);

    setFormData((prev) => {
      const updatedServices = [...(prev.quote_services || [])];
      if (updatedServices[index]) {
        updatedServices[index] = {
          ...updatedServices[index],
          no_of_services: totalServices,
          no_of_jobs: jobsPerMonth,
        };
      }

      const updatedMainServices = [...(prev.services || [])];
      if (updatedMainServices[index]) {
        updatedMainServices[index] = {
          ...updatedMainServices[index],
          no_of_jobs: jobsPerMonth,
          total_services: totalServices,
        };
      }

      return {
        ...prev,
        quote_services: updatedServices,
        services: updatedMainServices,
      };
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
            onChange={handleDurationChange}
          />
        </Grid>

        {formData.quote_services && formData.quote_services.length > 0 && (
          <Grid item lg={12} xs={12} mt={2}>
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-4">Service Jobs per Month</h3>
              {formData.quote_services.map((service, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium">
                        {service.service?.pest_name || "Service"}
                      </p>
                    </div>
                    <div className="w-32">
                      <InputWithTitle
                        title="Jobs/Month"
                        type="number"
                        value={
                          service.no_of_services /
                          (formData.duration_in_months || 1)
                        }
                        onChange={(value) =>
                          handleJobsPerMonthChange(index, value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        )}

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
