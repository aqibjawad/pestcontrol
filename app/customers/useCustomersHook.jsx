"use client";

import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { customers } from "@/networkUtil/Constants";

export const useCustomersHook = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState(null);
  const [sendingData, setSendingData] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [person_name, setPersonName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [opening_balance, setOpeningBalance] = useState("");
  const [description, setDescrp] = useState("");

  useEffect(() => {
    getAllCustomers();
  }, []);

  const getAllCustomers = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${customers}`);
      setBrandsList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const addCustomer = async () => {
    if (sendingData || !person_name) return;

    const customerData = {
      person_name,
      contact,
      address,
      opening_balance,
      description,
    };

    setSendingData(true);
    try {
      const response = await api.postFormDataWithToken(
        `${customers}/create`,
        customerData
      );
      if (response.status === "success") {
        alerts.successAlert("Customer has been added successfully");
        setPersonName("");
        setContact("");
        setAddress("");
        setOpeningBalance("");
        setDescrp("");
      } else {
        alerts.errorAlert("Failed to add customer. Please try again.");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      alerts.errorAlert("An error occurred while adding the customer.");
    } finally {
      setSendingData(false);
    }
  };

  return {
    fetchingData,
    brandsList,

    person_name,
    setPersonName,
    contact,
    setContact,
    address,
    setAddress,
    opening_balance,
    setOpeningBalance,
    description,
    setDescrp,

    sendingData,
    addCustomer,
    setSelectedEmployeeId,
  };
};

export default useCustomersHook;
