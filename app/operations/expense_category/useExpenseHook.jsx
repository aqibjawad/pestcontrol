import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { expense_category } from "@/networkUtil/Constants";

export const useExpenseCategory = () => {
  const api = new APICall();
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
        alert("Expense Category has been added");
        setExpenseCategory("");
        await getAllVehicles();
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
        alert("Vehicle has been updated");
        setEditingVehiclesId(null);
        setExpenseCategory("");
        await getAllVehicles();
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
