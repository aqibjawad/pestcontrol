// useTreatMethodHook.js
import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { treatmentMethod } from "@/networkUtil/Constants";
import { AppAlerts } from "../../../Helper/AppAlerts";

export const useExpenseCategory = () => {
  const api = new APICall();
  const alerts = new AppAlerts();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [methodName, setMethodName] = useState("");

  useEffect(() => {
    getAllMethods();
  }, []);

  const getAllMethods = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${treatmentMethod}`);
      setExpenseList(response.data);
    } catch (error) {
      console.error("Error fetching treatment methods:", error);
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
        alerts.successAlert("Treatment Method has been added");
        setMethodName("");
        await getAllMethods();
      } else {
        alerts.errorAlert("The Treatment Method has already been taken.");
      }
    } catch (error) {
      console.error("Error adding treatment method:", error);
      alerts.errorAlert("An error occurred while adding the Treatment Method.");
    } finally {
      setSendingData(false);
    }
  };

  const updateExpense = async () => {
    if (sendingData || methodName === "" || !editingExpenseId) return;

    setSendingData(true);
    try {
      const obj = { name: methodName };
      const response = await api.updateFormDataWithToken(
        `${treatmentMethod}/update/${editingExpenseId}`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("The Treatment Method has been updated!");
        setEditingExpenseId(null);
        setMethodName("");
        await getAllMethods();
      } else {
        alerts.errorAlert("The Treatment Method has already been taken.");
      }
    } catch (error) {
      console.error("Error updating Treatment Method:", error);
      alerts.errorAlert(
        "An error occurred while updating the Treatment Method."
      );
    } finally {
      setSendingData(false);
    }
  };

  const startEditing = (id, currentName) => {
    setEditingExpenseId(id);
    setMethodName(currentName);
  };

  const cancelEditing = () => {
    setEditingExpenseId(null);
    setMethodName("");
  };

  return {
    fetchingData,
    expenseList,
    methodName,
    setMethodName,
    sendingData,
    addExpense,
    updateExpense,
    editingExpenseId,
    startEditing,
    cancelEditing,
  };
};
