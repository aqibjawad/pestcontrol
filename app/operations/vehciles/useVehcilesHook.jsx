// useVehicles.js
import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { vehciles, getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { AppAlerts } from "../../../Helper/AppAlerts";

export const useVehicles = () => {
  const api = new APICall();
  const alerts = new AppAlerts();

  const [fetchingData, setFetchingData] = useState(false);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [sendingData, setSendingData] = useState(false);
  const [editingVehiclesId, setEditingVehiclesId] = useState(null);

  const [vehicle_number, setVehicleNumber] = useState("");
  const [modal_number, setModalNumber] = useState("");
  const [condition, setCondition] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [oil_change_limit, setOilChange] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    getAllVehicles();
    getAllEmployees();
  }, []);

  const getAllVehicles = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${vehciles}`);
      setVehiclesList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      alerts.errorAlert("Failed to fetch vehicles. Please try again.");
    } finally {
      setFetchingData(false);
    }
  };

  const getAllEmployees = async () => {
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alerts.errorAlert("Failed to fetch employees. Please try again.");
    }
  };

  const addVehicle = async () => {
    if (sendingData || vehicle_number === "") return;

    setSendingData(true);
    try {
      const obj = {
        vehicle_number,
        modal_number,
        condition,
        expiry_date,
        oil_change_limit,
        user_id: selectedEmployee,
      };
      const response = await api.postFormDataWithToken(
        `${vehciles}/create`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Vehicle has been added");
        resetForm();
        await getAllVehicles();
      } else {
        alerts.errorAlert("The vehicle number has already been taken");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alerts.errorAlert("An error occurred while adding the vehicle");
    } finally {
      setSendingData(false);
    }
  };

  const updateVehicle = async (id) => {
    if (sendingData || vehicle_number === "") return;

    setSendingData(true);
    try {
      const obj = {
        vehicle_number,
        modal_number,
        condition,
        expiry_date,
        oil_change_limit,
        user_id: selectedEmployee,
      };
      const response = await api.updateFormDataWithToken(
        `${vehciles}/update/${id}`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Vehicle has been updated");
        setEditingVehiclesId(null);
        resetForm();
        await getAllVehicles();
      } else {
        alerts.errorAlert("The vehicle number has already been taken.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      alerts.errorAlert("The vehicle number has already been taken.");
    } finally {
      setSendingData(false);
    }
  };

  const startEditing = (id) => {
    const vehicleToEdit = vehiclesList.find((vehicle) => vehicle.id === id);
    if (vehicleToEdit) {
      setEditingVehiclesId(id);
      setVehicleNumber(vehicleToEdit.vehicle_number);
      setModalNumber(vehicleToEdit.modal_number);
      setCondition(vehicleToEdit.condition);
      setExpiryDate(vehicleToEdit.expiry_date);
      setOilChange(vehicleToEdit.oil_change_limit);
      setSelectedEmployee(vehicleToEdit.user_id);
    }
  };

  const cancelEditing = () => {
    setEditingVehiclesId(null);
    resetForm();
  };

  const resetForm = () => {
    setVehicleNumber("");
    setModalNumber("");
    setCondition("");
    setExpiryDate("");
    setOilChange("");
    setSelectedEmployee("");
  };

  return {
    fetchingData,
    vehiclesList,
    vehicle_number,
    modal_number,
    condition,
    expiry_date,
    oil_change_limit,
    employeesList,
    selectedEmployee,
    setSelectedEmployee,
    setVehicleNumber,
    setModalNumber,
    setCondition,
    setExpiryDate,
    setOilChange,
    sendingData,
    addVehicle,
    updateVehicle,
    editingVehiclesId,
    startEditing,
    cancelEditing,
  };
};
