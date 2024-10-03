"use client";

import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import { product, getAllEmpoyesUrl, addStock } from "@/networkUtil/Constants";
import { useSearchParams } from "next/navigation";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

export const useAssignStockHook = () => {
  const api = new APICall();

  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [sendingData, setSendingData] = useState(false);

  const [employeesList, setEmployeesList] = useState([]);
  const [employees, setEmployessList] = useState([]);
  const [allEmployeesList, setAllEmployeesList] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;

    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllBrands(urlId);
    }
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
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_manager/get`
      );
      setEmployeesList(response.data);
      setAllEmployeesList(response.data);
      const employeeNames = response.data.map((item) => item.name);
      setEmployessList(employeeNames);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleEmployeeChange = (name, index) => {
    if (allEmployeesList[index] && allEmployeesList[index].id) {
      const idAtIndex = allEmployeesList[index].id;
      setSelectedEmployeeId(idAtIndex);
    } else {
      console.error("Invalid employee selection");
      setSelectedEmployeeId("");
    }
  };

  const assignStock = async () => {
    if (sendingData || quantity === "" || selectedEmployeeId === "") return;

    setSendingData(true);
    try {
      const obj = {
        product_id: id,
        sales_manager_id: selectedEmployeeId,
        quantity: quantity,
      };
      const response = await api.postFormDataWithToken(
        `${addStock}/stock/assign`,
        obj
      );
      if (response.status === "success") {
        alert("Stock has been assigned");
        setQuantity("");
        setSelectedEmployeeId("");
        await getAllBrands();
      } else {
        alert("Could not assign the stock, please try again");
      }
    } catch (error) {
      console.error("Error assigning stock:", error);
      alert("An error occurred while assigning the stock");
    } finally {
      setSendingData(false);
    }
  };

  return {
    fetchingData,
    brandsList,
    employeesList,
    quantity,
    employees,
    setQuantity,
    sendingData,
    assignStock,
    setSelectedEmployeeId,
    handleEmployeeChange,
  };
};

export default useAssignStockHook;
