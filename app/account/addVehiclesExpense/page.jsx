"use client";

import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import InputWithTitle3 from "../../../components/generic/InputWithTitle3";
import styles from "../../../styles/stock.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Dropdown2 from "@/components/generic/DropDown2";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import { vehciles, bank, vehicleExpense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Tabs from "./tabs";

const Page = () => {
  const api = new APICall();
  const router = useRouter();
  
  // Core states
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [fetchingData, setFetchingData] = useState(false);

  // Expense details
  const [fuel_amount, setFuelAmount] = useState("");
  const [expense_date, setExpDate] = useState("");
  const [maintenance_amount, setMainAmount] = useState("");
  const [oil_amount, setOilAmount] = useState("");
  const [oil_change_limit, setOilChangeLimit] = useState("");
  const [meter_reading, setMeterRead] = useState("");
  const [vat_per, setVat] = useState("");
  const [total, setTotal] = useState("");

  // Bank related states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [cheque_no, setChequeNo] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Vehicle states
  const [allVehiclesList, setAllVehicleList] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  useEffect(() => {
    getAllBanks();
    getAllVehciles();
  }, []);

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      const banks = response.data;
      setAllBankList(banks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllVehciles = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${vehciles}`);
      setAllVehicleList(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setFetchingData(false);
    }
  };

  // Modified bank change handler to work with Dropdown2
  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
  };

  const handleVehcileChange = (selectedValue) => {
    setSelectedVehicleId(selectedValue);
    const selectedVehicle = allVehiclesList.find(
      (vehicle) => vehicle.id === selectedValue
    );
    if (selectedVehicle) {
      setOilChangeLimit(selectedVehicle.oil_change_limit);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Format bank options for Dropdown2
  const bankOptions = allBanksList?.map((bank) => ({
    value: bank.id,
    label: bank.bank_name
  }));

  // Format vehicle options
  const vehicleOptions = allVehiclesList?.map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.vehicle_number} - ${vehicle.modal_name}- ${vehicle?.user?.name}`
  }));

  useEffect(() => {
    const parseValue = (value) =>
      isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    const subtotal =
      parseValue(fuel_amount) +
      parseValue(oil_amount) +
      parseValue(maintenance_amount);

    const vatAmount = (parseValue(vat_per) / 100) * subtotal;
    const finalTotal = subtotal + vatAmount;

    setTotal(finalTotal);
  }, [fuel_amount, oil_amount, maintenance_amount, vat_per]);

  const createVehicleObject = () => {
    const baseObj = {
      fuel_amount,
      expense_date,
      vehicle_id: selectedVehicleId,
      vat_per,
      total,
      oil_amount,
      maintenance_amount,
      oil_change_limit,
      meter_reading,
      payment_type: activeTab
    };

    if (activeTab === "cheque") {
      return {
        ...baseObj,
        bank_id: selectedBankId,
        cheque_date,
        cheque_no
      };
    } else if (activeTab === "online") {
      return {
        ...baseObj,
        bank_id: selectedBankId,
        transection_id: transactionId
      };
    }

    return baseObj;
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      const vehicleData = createVehicleObject();
      const response = await api.postFormDataWithToken(
        `${vehicleExpense}/create`,
        vehicleData
      );
      
      if (response.status === "success") {
        alert("Vehicle Expense Added Successfully");
        router.push("/account/viewVehicles");
      } else {
        alert("Vehicle Expense Not Added Successfully");
      }
    } catch (error) {
      console.error("Error submitting vehicle expense:", error);
      alert("Error submitting vehicle expense");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDateChange = (name, value) => {
    setExpDate(value);
  };

  return (
    <div>
      <div className={styles.stockHead}>Vehicles</div>
      <div className={styles.stockDescrp}>
        Thank you for choosing us to meet your needs. We look forward to serving
        you with excellence
      </div>

      <Grid className={styles.fromGrid} container spacing={3}>
        <Grid item lg={4} xs={12}>
          <Dropdown2
            onChange={handleVehcileChange}
            title="Select Vehicles"
            options={vehicleOptions}
            value={selectedVehicleId}
          />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle3
            value={expense_date}
            onChange={handleDateChange}
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
            value={oil_change_limit}
            onChange={setOilChangeLimit}
            title={"Next Oil Change Limit"}
          />
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle
            value={meter_reading}
            title={"Meter Reading"}
            type="text"
            placeholder={"Meter Reading"}
            onChange={setMeterRead}
          />
        </Grid>

        <Grid item lg={12} xs={12} sm={6} md={6}>
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
          <Grid
            style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
            container
            spacing={3}
          >
            <Grid item lg={6} xs={12}>
              <Dropdown2
                onChange={handleBankChange}
                title="Select Bank"
                options={bankOptions}
                value={selectedBankId}
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
          <Grid
            style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
            container
            spacing={3}
          >
            <Grid item xs={6}>
              <Dropdown2
                onChange={handleBankChange}
                title="Select Bank"
                options={bankOptions}
                value={selectedBankId}
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

      <div className={styles.btnSubmitt}>
        <GreenButton
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);