"use client";

import React, { useState, useEffect } from "react";

import { Grid } from "@mui/material";

import InputWithTitle from "../../../components/generic/InputWithTitle";

import styles from "../../../styles/stock.module.css";

import GreenButton from "@/components/generic/GreenButton";

import Tabs from "./tabs";

import Dropdown from "@/components/generic/Dropdown";

import { useRouter } from "next/navigation";

import { vehciles, bank, vehicleExpense, expense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const Page = () => {
  const api = new APICall();

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("cash");

  const [fuel_amount, setFuelAmount] = useState();
  const [expense_date, setExpDate] = useState();
  const [maintenance_amount, setMainAmount] = useState();
  const [oil_amount, setOilAmount] = useState();

  const [vat_per, setVat] = useState();
  const [total, setTotal] = useState();
  const [amount, setAmount] = useState();

  const [bank_id, setBankId] = useState();
  const [cheque_amount, setChequeAmount] = useState();
  const [cheque_no, setChequeNo] = useState();
  const [cheque_date, setChequeDate] = useState();
  const [transection_id, setTransactionId] = useState();

  // All Banks States
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  // All Banks States
  const [allVehiclesList, setAllVehicleList] = useState([]);
  
  const [allVehicleNameList, setVehicleNameList] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  

  const [fetchingData, setFetchingData] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState({ id: "", name: "" });
  const [selectedBank, setSelectedBank] = useState({ id: "", name: "" });

  useEffect(() => {
    getAllBanks();
    getAllVehicles();
  }, []);

  const getAllBanks = async () => {
    true;
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setAllBankList(response.data);

      const expenseNames = response.data.map((item) => item.bank_name);
      setBankNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllVehicles = async () => {
    true;
    try {
      const response = await api.getDataWithToken(`${vehciles}`);
      setAllVehicleList(response.data);

      const vehicleNames = response.data.map((item) => item.vehicle_number);
      setVehicleNameList(vehicleNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleBankChange = (selectedValue, selectedLabel) => {
    setSelectedBank({ id: selectedValue, name: selectedLabel });
    setSelectedBankId(selectedValue);
  };

  // const handleVehicleChange = (selectedValue) => {
  //   setSelectedVehicleId(selectedValue);
  // };

  const handleVehicleChange = (value) => {
    const selectedClient = allVehicleNameList.find((vehcile) => vehcile.id === value);
    
    if (selectedClient) {
      setSelectedVehicleId(selectedClient);
      // setFormData((prev) => ({
      //   ...prev,
      //   vehicle_id: selectedClient.id,
      // })); // Set user ID

    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const createVehicleObject = () => {
    let vehicleObj = {
      fuel_amount,
      expense_date,
      vehicle_id: selectedVehicleId,
      vat_per,
      total,
      oil_amount,
      maintenance_amount,
      payment_type: activeTab,
    };

    // Add fields based on the active payment type
    if (activeTab === "cash") {
      vehicleObj = {
        ...vehicleObj,
        amount,
      };
    } else if (activeTab === "cheque") {
      vehicleObj = {
        ...vehicleObj,
        bank_id: selectedBankId,
        cheque_amount,
        cheque_no,
        cheque_date,
      };
    } else if (activeTab === "online") {
      vehicleObj = {
        ...vehicleObj,
        bank_id: selectedBankId,
        amount,
        transection_id,
      };
    }

    return vehicleObj;
  };

  const handleSubmit = async () => {
    const vehicleData = createVehicleObject();
    try {
      const response = await api.postFormDataWithToken(
        `${vehicleExpense}/create`,
        vehicleData
      );
      if (response.status === 200) {
        alert("Vehicle Expense Added Successfully");
        router.push("/account/viewVehicles");
      }
      // Handle successful response
      console.log("Expense created successfully:", response);
    } catch (error) {
      // Handle error
      console.error("Error creating vehciles:", error);
    }
  };

  const parseValue = (value) =>
    isNaN(parseFloat(value)) ? 0 : parseFloat(value);

  useEffect(() => {
    // Convert values to floats, defaulting to 0 if the value is not a valid number
    const parseValue = (value) =>
      isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    // Calculate the subtotal
    const subtotal =
      parseValue(fuel_amount) +
      parseValue(oil_amount) +
      parseValue(maintenance_amount);

    // Calculate VAT amount
    const vatAmount = (parseValue(vat_per) / 100) * subtotal;

    // Calculate the final total
    const finalTotal = subtotal + vatAmount;

    // Update the total state
    setTotal(finalTotal);
  }, [fuel_amount, oil_amount, maintenance_amount, vat_per]);

  return (
    <div>
      <div className={styles.stockHead}>vehicles</div>

      <div className={styles.stockDescrp}>
        Thank you for choosing us to meet your needs. We look forward to serving
        you with excellenc
      </div>

      {/* Form section */}
      <Grid className={styles.fromGrid} container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Dropdown
            title={"select Vehcile"}
            options={allVehiclesList}
            onChange={handleVehicleChange}
            value={allVehiclesList.find(
              (option) => option.value === selectedVehicleId
            )}
          />
        </Grid>
        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={expense_date}
            onChange={setExpDate}
            title={"date"}
            type={"date"}
          />
        </Grid>
        

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={fuel_amount}
            onChange={setFuelAmount}
            title={"Fuel"}
          />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={oil_amount}
            onChange={setOilAmount}
            title={"Oil expense"}
          />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={maintenance_amount}
            onChange={setMainAmount}
            title={"Maintenance"}
          />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={maintenance_amount}
            onChange={setMainAmount}
            title={"Next Oil Change Limit"}
          />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={6}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        <Grid item lg={12} xs={12} sm={6} md={6}>
          {activeTab === "cash" && (
            <Grid className={styles.fromGrid} container spacing={3}>
              <Grid item lg={4} xs={12} sm={6} md={4}>
                <InputWithTitle
                  title={"VAT"}
                  type={"text"}
                  placeholder={"VAT"}
                  onChange={setVat}
                />
              </Grid>

              <Grid item lg={4} xs={12} sm={6} md={4}>
                <InputWithTitle
                  value={total}
                  title={"Total"}
                  type="text"
                  placeholder={"Total"}
                  readOnly
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        {activeTab === "cheque" && (
          <Grid className={styles.fromGrid} container spacing={3}>
            <Grid item lg={6} xs={12}>
              <Dropdown
                onChange={handleBankChange}
                title={"Banks"}
                options={allBankNameList}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Cheque Date"}
                type={"date"}
                placeholder={"Cheque Date"}
                onChange={setChequeDate}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Cheque Numner"}
                type={"text"}
                placeholder={"Cheque Numner"}
                onChange={setChequeNo}
              />
            </Grid>

            <Grid item lg={4} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </Grid>

            <Grid item lg={4} xs={12} sm={6} md={4}>
              <InputWithTitle
                value={total}
                title={"Total"}
                type="text"
                placeholder={"Total"}
                readOnly
              />
            </Grid>
          </Grid>
        )}

        {activeTab === "online" && (
          <Grid className={styles.fromGrid} container spacing={3}>
            <Grid item xs={12}>
              <Dropdown
                onChange={handleBankChange}
                title={"Banks"}
                options={allBankNameList}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputWithTitle
                title={"Transaction Id"}
                type={"text"}
                placeholder={"Transaction Id"}
                onChange={setTransactionId}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                onChange={setTotal}
              />
            </Grid>
          </Grid>
        )}
      </Grid>

      <div className={styles.btnSubmitt}>
        <GreenButton onClick={handleSubmit} title={"Submit"} />
      </div>
    </div>
  );
};

export default Page;
