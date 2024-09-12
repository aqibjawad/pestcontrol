import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { vehciles } from "@/networkUtil/Constants";

export const useVehicles = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [vehicle_number, setVehicleNumber] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [editingVehiclesId, setEditingVehiclesId] = useState(null);

  useEffect(() => {
    getAllVehicles();
  }, []);

  const getAllVehicles = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${vehciles}`);
      setVehiclesList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const addVehicle = async () => {
    if (sendingData || vehicle_number === "") return;

    setSendingData(true);
    try {
      const obj = { vehicle_number };
      const response = await api.postFormDataWithToken(
        `${vehciles}/create`,
        obj
      );
      if (response.status === "success") {
        alert("Vehicle has been added");
        setVehicleNumber("");
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
        alert("Vehicle has been updated");
        setEditingVehiclesId(null);
        setVehicleNumber("");
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
    setVehicleNumber(currentName);
  };

  const cancelEditing = () => {
    setEditingVehiclesId(null);
    setVehicleNumber("");
  };

  return {
    fetchingData,
    vehiclesList,
    vehicle_number,
    setVehicleNumber,
    sendingData,
    addVehicle,
    updateVehicle,
    editingVehiclesId,
    startEditing,
    cancelEditing,
  };
};
