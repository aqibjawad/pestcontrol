import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { product, getAllEmpoyesUrl } from "@/networkUtil/Constants";

import { useSearchParams } from "next/navigation";

export const useBrands = () => {

  const api = new APICall();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState();
  const [brandName, setBrandName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);

  const [employeesList, setEmployeesList] = useState([]);
  const [employeesName, setEmployeesName] = useState("");
  const [AllEmployeesList, setAllEmployeesList] = useState("");
  const [SelectEmployeesId, setSelectedEmployeedId] = useState("");

  useEffect(() => {
    getAllBrands();
    getAllEmployees();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}/${id}`);
      setBrandsList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllEmpoyesUrl}`);
      setEmployeesList(response.data);
    } catch (error) {
      console.error("Error fetching Employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleEmployeedChange = (name, index) => {
    const idAtIndex = AllEmployeesList[index].id;
    setSelectedEmployeedId(idAtIndex);
  };

  const addBrand = async () => {
    if (sendingData || brandName === "") return;

    setSendingData(true);
    try {
      const obj = { name: brandName };
      const response = await api.postFormDataWithToken(`${brand}/create`, obj);
      if (response.status === "success") {
        alert("Brand has been added");
        setBrandName("");
        await getAllBrands();
      } else {
        alert("Could not add the brand, please try again");
      }
    } catch (error) {
      console.error("Error adding brand:", error);
      alert("An error occurred while adding the brand");
    } finally {
      setSendingData(false);
    }
  };

  const updateBrand = async (id, newName) => {
    if (sendingData || newName === "") return;

    setSendingData(true);
    try {
      const obj = { name: newName };
      const response = await api.updateFormDataWithToken(`${brand}/${id}`, obj);
      if (response.status === "success") {
        alert("Brand has been updated");
        setEditingBrandId(null);
        setBrandName("");
        await getAllBrands();
      } else {
        alert("Could not update the brand, please try again");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      alert("An error occurred while updating the brand");
    } finally {
      setSendingData(false);
    }
  };

  const startEditing = (id, currentName) => {
    setEditingBrandId(id);
    setBrandName(currentName);
  };

  const cancelEditing = () => {
    setEditingBrandId(null);
    setBrandName("");
  };

  return {
    fetchingData,
    brandsList,
    employeesList,
    brandName,
    setBrandName,
    sendingData,
    addBrand,
    updateBrand,
    editingBrandId,
    startEditing,
    cancelEditing,
    setSelectedEmployeedId,
    handleEmployeedChange,
  };
};
