"use client";

import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { termsCond } from "@/networkUtil/Constants";

export const useTermHook = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState(null);
  const [name, setName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${termsCond}`);
      setBrandsList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const assignStock = async (data) => {
    if (!data || !data.name || !data.text) {
      throw new Error("Name and text are required");
    }

    setSendingData(true);
    try {
      let endpoint = `${termsCond}/create`;
      let successMessage = "Terms and Conditions has been assigned";

      // If we're in edit mode, use the update endpoint
      if (isEditing && currentItemId) {
        endpoint = `${termsCond}/update/${currentItemId}`;
        successMessage = "Terms and Conditions has been updated";
      }

      const obj = {
        name: data.name,
        text: data.text,
      };

      const response = await api.postFormDataWithToken(endpoint, obj);

      if (response.status === "success") {
        alert(successMessage);
        setName("");
        setIsEditing(false);
        setCurrentItemId(null);
        await getAllBrands();
        return response;
      } else {
        throw new Error("Operation failed, please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setSendingData(false);
    }
  };

  const handleEditItem = (item) => {
    setName(item.name);
    setIsEditing(true);
    setCurrentItemId(item.id);
    return item.text; // Return text to be set in the component
  };

  return {
    fetchingData,
    brandsList,
    name,
    setName,
    sendingData,
    assignStock,
    getAllBrands,
    isEditing,
    setIsEditing,
    handleEditItem,
    currentItemId,
  };
};

export default useTermHook;
