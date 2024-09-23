import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { treatmentMethod } from "@/networkUtil/Constants";
import { AppAlerts } from "../../../Helper/AppAlerts";

export const useExpenseCategory = () => {
  const api = new APICall();
  const alerts = new AppAlerts();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setVehiclesList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [editingExpenseId, setEditingVehiclesId] = useState(null);

  const [methodName, setTreatMethod] = useState("");

  useEffect(() => {
    getAllVehicles();
  }, []);

  const getAllVehicles = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${treatmentMethod}`);
      setVehiclesList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const addExpense = async () => {
    if (sendingData || methodName === "") return;

    setSendingData(true);
    try {
      const obj = { name: methodName };
      const response = await api.postFormDataWithToken(
        `${treatmentMethod}/create`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Expense Category has been updated");
        setTreatMethod("");
        await getAllVehicles();
      } else {
        alerts.errorAlert("The Expense Category has already been taken.");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alerts.errorAlert(
        "An error occurred while updating the Expense Category."
      );
    } finally {
      setSendingData(false);
    }
  };

  const updateExpense = async (id, methodName) => {
    if (sendingData || methodName === "") return;

    setSendingData(true);
    try {
      const obj = { name: methodName };

      const response = await api.updateFormDataWithToken(
        `${treatmentMethod}/update/${id}`,
        obj
      );
      if (response.status === "success") {
        alerts.errorAlert("The Expense Category has updated!");
        setEditingVehiclesId(null);
        setTreatMethod("");
        await getAllVehicles();
      } else {
        alerts.errorAlert("The Expense Category has already been taken.");
      }
    } catch (error) {
      console.error("Error updating Expense Category:", error);
      alerts.errorAlert(
        "An error occurred while updating the Expense Category."
      );
    } finally {
      setSendingData(false);
    }
  };

  const startEditing = (id, currentName) => {
    setEditingVehiclesId(id);
    setTreatMethod(currentName);
  };

  const cancelEditing = () => {
    setEditingVehiclesId(null);
    setTreatMethod("");
  };

  return {
    fetchingData,
    expenseList,
    methodName,
    setTreatMethod,
    sendingData,
    addExpense,
    updateExpense,
    editingExpenseId,
    startEditing,
    cancelEditing,
  };
};
