import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { expense_category } from "@/networkUtil/Constants";
import { AppAlerts } from "../../../Helper/AppAlerts";

export const useExpenseCategory = () => {
  const api = new APICall();
  const alerts = new AppAlerts();

  const [fetchingData, setFetchingData] = useState(false);
  const [expenseList, setVehiclesList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [editingExpenseId, setEditingVehiclesId] = useState(null);

  const [expenseCategory, setExpenseCategory] = useState("");

  useEffect(() => {
    getAllVehicles();
  }, []);

  const getAllVehicles = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${expense_category}`);
      setVehiclesList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const addExpense = async () => {
    if (sendingData || expenseCategory === "") return;

    setSendingData(true);
    try {
      const obj = { expense_category: expenseCategory };
      const response = await api.postFormDataWithToken(
        `${expense_category}/create`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Expense Category has been updated");
        setExpenseCategory("");
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

  const updateExpense = async (id, expenseCategory) => {
    if (sendingData || expenseCategory === "") return;

    setSendingData(true);
    try {
      const obj = { expense_category: expenseCategory };

      const response = await api.updateFormDataWithToken(
        `${expense_category}/update/${id}`,
        obj
      );
      if (response.status === "success") {
        alerts.errorAlert("The Expense Category has updated!");
        setEditingVehiclesId(null);
        setExpenseCategory("");
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
    setExpenseCategory(currentName);
  };

  const cancelEditing = () => {
    setEditingVehiclesId(null);
    setExpenseCategory("");
  };

  return {
    fetchingData,
    expenseList,
    expenseCategory,
    setExpenseCategory,
    sendingData,
    addExpense,
    updateExpense,
    editingExpenseId,
    startEditing,
    cancelEditing,
  };
};
