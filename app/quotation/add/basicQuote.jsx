import React, { useEffect, useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid } from "@mui/material";
import MultilineInput from "@/components/generic/MultilineInput";

const BasicQuote = ({ setFormData, formData }) => {
  const api = new APICall();

  const [allBrandsList, setAllBrandsList] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [selectedBrand, setSelectedClientId] = useState(null);
  const [contractReference, setContractReference] = useState("");
  const [firmName, setFirmName] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [referenceName, setReferenceName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    getAllClients();
  }, []);

  const getAllClients = async () => {
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
    }
  };

  const handleClientChange = (value) => {
    const selectedClient = allClients.find((client) => client.id === value);
    console.log(selectedClient);
    
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
    <div
      className={styles.userFormContainer}
      style={{ fontSize: "16px", margin: "auto" }}
    >
      <Grid container spacing={2}>
        <Grid className="mt-5" item lg={6} xs={12} md={6} mt={2}>
          <Dropdown
            options={allBrandsList}
            onChange={handleClientChange}
            value={allBrandsList.find(
              (option) => option.value === selectedBrand
            )}
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Contract Reference"}
            type={"text"}
            placeholder={"Contract Reference"}
            value={contractReference} // Use contract reference here
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
            value={firmName} // Use the firm name from the selected client
            onChange={(value) => {
              setFirmName(value);
              setFormData((prev) => ({ ...prev, firmName: value }));
            }}
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <Dropdown
            title={"Select address"}
            options={addresses}
            onChange={handleAddressChange}
            value={selectedAddress} // Bind the selected address
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Quotes title"}
            type={"text"}
            placeholder={"Quotes title"}
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
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, duration_in_months: value }));
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
