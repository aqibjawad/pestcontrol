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
  const [employee, setEmployee] = useState("");
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
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setEmployeesList(response.data); // Make sure we're setting the data correctly
      console.log("Employees fetched:", response.data); // Add this to debug
    } catch (error) {
      console.error("Error fetching employees:", error);
      alerts.errorAlert("Failed to fetch employees. Please try again.");
    } finally {
      setFetchingData(false);
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
        user_id: selectedEmployee, // Add employee_id to the payload
      };
      const response = await api.postFormDataWithToken(
        `${vehciles}/create`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Vehicle has been added");
        setVehicleNumber("");
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

  const updateVehicle = async (id, vehicle_number) => {
    if (sendingData || vehicle_number === "") return;

    setSendingData(true);
    try {
      const obj = { vehicle_number };
      const response = await api.updateFormDataWithToken(
        `${vehciles}/update/${id}`,
        obj
      );
      if (response.status === "success") {
        alerts.successAlert("Vehicle has been updated");
        setEditingVehiclesId(null);
        setVehicleNumber("");
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

  const startEditing = (id, currentName) => {
    setEditingVehiclesId(id);
    setVehicleNumber(currentName);
  };

  const cancelEditing = () => {
    setEditingVehiclesId(null);
    setVehicleNumber("");
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
    employeesList, // Add employees list to return object
    modal_number,
    condition,
    expiry_date,
    oil_change_limit,

    setModalNumber,
    selectedEmployee, // Add selected employee to return object
    setSelectedEmployee, // Add setter for selected employee
    setCondition,
    setExpiryDate,
    setOilChange,
    setVehicleNumber,

    sendingData,
    addVehicle,
    updateVehicle,
    editingVehiclesId,
    startEditing,
    cancelEditing,
  };
};
