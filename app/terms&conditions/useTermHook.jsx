"use client";

import { useState, useEffect } from "react";
import APICall from "@/networkUtil/APICall";
import {
  termsCond,
} from "@/networkUtil/Constants";

export const useTermHook = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);
  const [brandsList, setBrandsList] = useState(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sendingData, setSendingData] = useState(false);

  const [employeesList, setEmployeesList] = useState([]);
  const [employees, setEmployessList] = useState([]);
 

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${termsCond}`);
      setBrandsList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const assignStock = async () => {

    setSendingData(true);
    try {
      const obj = {
        name: name,
        text: text,
      };
      const response = await api.postFormDataWithToken(
        `${termsCond}/create`,
        obj
      );
      if (response.status === "success") {
        alert("Terms and Conditions has been assigned");
        setName("");
        setText("");
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
    employees,
    setName,
    setText,
    sendingData,
    assignStock,
  };
};

export default useTermHook;