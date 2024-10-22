import React, { useEffect, useState } from "react";
import styles from "../../../styles/loginStyles.module.css";
import InputWithTitle from "../../..//components/generic/InputWithTitle";
import Dropdown2 from "../../../components/generic/DropDown2";
import { clients } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { Grid, Skeleton } from "@mui/material";
import MultilineInput from "../../../components/generic/MultilineInput";

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
        <Grid className="" item lg={6} xs={12} md={6} mt={2}>
          {loadingClients ? (
            <Skeleton variant="rectangular" width="100%" height={50} />
          ) : (
            <Dropdown2
              title={"select Client"}
              options={allBrandsList}
              onChange={handleClientChange}
              // value={allBrandsList.find(
              //   (option) => option.value === selectedBrand
              // )}
              value={
                selectedBrand ||
                allBrandsList.find(
                  (option) => option.value === formData?.user?.name
                )
              }
              defaultValue={formData?.user?.name}
            />
          )}
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Contract Reference"}
            type={"text"}
            placeholder={"Contract Reference"}
            value={referenceName} // Use contract reference here
            disable
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <InputWithTitle
            title={"Firm"}
            type={"text"}
            placeholder={"Firm"}
            value={firmName} // Use the firm name from the selected client
            defaultValue={formData?.user?.client?.firm_name}
            disable
          />
        </Grid>

        <Grid item lg={6} xs={12} md={6} mt={2}>
          <Dropdown2
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
            type={"text"} // Use "number" to restrict non-numeric input
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
