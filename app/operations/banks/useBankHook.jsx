import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { bank } from "@/networkUtil/Constants";

export const useBanks = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vehiclesList, setBanksList] = useState([]);
  const [bank_name, setBankNumber] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [editingBanksId, setEditingBanksId] = useState(null);

  useEffect(() => {
    getAllBanks();
  }, []);

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setBanksList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const addBank = async () => {
    if (sendingData || bank_name === "") return;

    setSendingData(true);
    try {
      const obj = { bank_name };
      const response = await api.postFormDataWithToken(
        `${bank}/create`,
        obj
      );
      if (response.status === "success") {
        alert("Bank has been added");
        setBankNumber("");
        await getAllBanks();
      } else {
        alert("Could not add the vehicle, please try again");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("An error occurred while adding the vehicle");
    } finally {
      setSendingData(false);
    }
  };

  const updateBank = async (id, bank_name) => {
    if (sendingData || bank_name === "") return;

    setSendingData(true);
    try {
      const obj = { bank_name };
      const response = await api.updateFormDataWithToken(
        `${bank}/update/${id}`,
        obj
      );
      if (response.status === "success") {
        alert("Bank has been updated");
        setEditingBanksId(null);
        setBankNumber("");
        await getAllBanks();
      } else {
        alert("Could not update the vehicle, please try again");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alert("An error occurred while updating the vehicle");
    } finally {
      setSendingData(false);
    }
  };

  const startEditing = (id, currentName) => {
    setEditingBanksId(id);
    setBankNumber(currentName);
  };

  const cancelEditing = () => {
    setEditingBanksId(null);
    setBankNumber("");
  };

  return {
    fetchingData,
    vehiclesList,
    bank_name,
    setBankNumber,
    sendingData,
    addBank,
    updateBank,
    editingBanksId,
    startEditing,
    cancelEditing,
  };
};
