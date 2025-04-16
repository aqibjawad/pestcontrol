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
import Swal from "sweetalert2";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  // Core states
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Expense details
  const [fuel_amount, setFuelAmount] = useState("");
  const [expense_date, setExpDate] = useState("");
  const [maintenance_amount, setMainAmount] = useState("");
  const [oil_amount, setOilAmount] = useState("");
  const [oil_change_limit, setOilChangeLimit] = useState("");
  const [meter_reading, setMeterRead] = useState("");
  const [registration_renewal, setRegRenew] = useState("");
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch banks data",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch vehicles data",
      });
    } finally {
      setFetchingData(false);
    }
  };

  // Modified bank change handler to work with Dropdown2
  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
    if (selectedValue) {
      setErrors((prev) => ({ ...prev, bank_id: null }));
    }
  };

  const handleVehcileChange = (selectedValue) => {
    setSelectedVehicleId(selectedValue);
    if (selectedValue) {
      setErrors((prev) => ({ ...prev, vehicle_id: null }));
    }

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
    label: bank.bank_name,
  }));

  // Format vehicle options
  const vehicleOptions = allVehiclesList?.map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.vehicle_number} - ${vehicle.modal_name}- ${vehicle?.user?.name}`,
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

  const validateForm = () => {
    const newErrors = {};

    // Common validations for all tabs
    if (!selectedVehicleId) newErrors.vehicle_id = "Please select a vehicle";
    if (!expense_date) newErrors.expense_date = "Please enter expense date";
    if (!fuel_amount) newErrors.fuel_amount = "Please enter fuel amount";
    if (!maintenance_amount)
      newErrors.maintenance_amount = "Please enter maintenance amount";
    if (!oil_amount) newErrors.oil_amount = "Please enter oil amount";
    if (!oil_change_limit)
      newErrors.oil_change_limit = "Please enter oil change limit";
    if (!meter_reading) newErrors.meter_reading = "Please enter meter reading";
    if (!vat_per) newErrors.vat_per = "Please enter VAT percentage";

    // Tab specific validations
    if (activeTab === "cheque") {
      if (!selectedBankId) newErrors.bank_id = "Please select a bank";
      if (!cheque_date) newErrors.cheque_date = "Please enter cheque date";
      if (!cheque_no) newErrors.cheque_no = "Please enter cheque number";
    } else if (activeTab === "online") {
      if (!selectedBankId) newErrors.bank_id = "Please select a bank";
      if (!transactionId)
        newErrors.transection_id = "Please enter transaction ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      registration_renewal,
      payment_type: activeTab,
    };

    if (activeTab === "cheque") {
      return {
        ...baseObj,
        bank_id: selectedBankId,
        cheque_date,
        cheque_no,
      };
    } else if (activeTab === "online") {
      return {
        ...baseObj,
        bank_id: selectedBankId,
        transection_id: transactionId,
      };
    }

    return baseObj;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
      });
      return;
    }

    setLoadingSubmit(true);
    try {
      const vehicleData = createVehicleObject();
      const response = await api.postFormDataWithToken(
        `${vehicleExpense}/create`,
        vehicleData
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vehicle Expense Added Successfully",
        }).then(() => {
          router.push("/account/viewVehicles");
        });
      } else {
        const errorMessage =
          response.message || "Vehicle Expense Not Added Successfully";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error submitting vehicle expense:", error);
      let errorMessage = "Error submitting vehicle expense";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDateChange = (name, value) => {
    setExpDate(value);
    if (value) {
      setErrors((prev) => ({ ...prev, expense_date: null }));
    }
  };

  const handleInputChange = (setter, field) => (value) => {
    setter(value);
    if (value) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
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
            error={errors.vehicle_id}
          />
          {errors.vehicle_id && (
            <div className={styles.errorText}>{errors.vehicle_id}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle3
            value={expense_date}
            onChange={handleDateChange}
            title={"Date"}
            type={"date"}
            error={errors.expense_date}
          />
          {errors.expense_date && (
            <div className={styles.errorText}>{errors.expense_date}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={fuel_amount}
            onChange={handleInputChange(setFuelAmount, "fuel_amount")}
            title={"Fuel"}
            error={errors.fuel_amount}
          />
          {errors.fuel_amount && (
            <div className={styles.errorText}>{errors.fuel_amount}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={oil_amount}
            onChange={handleInputChange(setOilAmount, "oil_amount")}
            title={"Oil expense"}
            error={errors.oil_amount}
          />
          {errors.oil_amount && (
            <div className={styles.errorText}>{errors.oil_amount}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={maintenance_amount}
            onChange={handleInputChange(setMainAmount, "maintenance_amount")}
            title={"Maintenance"}
            error={errors.maintenance_amount}
          />
          {errors.maintenance_amount && (
            <div className={styles.errorText}>{errors.maintenance_amount}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle
            value={meter_reading}
            title={"Meter Reading"}
            type="text"
            placeholder={"Meter Reading"}
            onChange={handleInputChange(setMeterRead, "meter_reading")}
            error={errors.meter_reading}
          />
          {errors.meter_reading && (
            <div className={styles.errorText}>{errors.meter_reading}</div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle
            value={registration_renewal}
            title={"Registration Renewal"}
            type="text"
            placeholder={"Registration Renewal"}
            onChange={handleInputChange(setRegRenew, "registration_renewal")}
            error={errors.registration_renewal}
          />
          {errors.registration_renewal && (
            <div className={styles.errorText}>
              {errors.registration_renewal}
            </div>
          )}
        </Grid>

        <Grid item lg={4} xs={12} sm={6} md={6}>
          <InputWithTitle
            value={oil_change_limit}
            onChange={handleInputChange(setOilChangeLimit, "oil_change_limit")}
            title={"Next Oil Change Limit"}
            error={errors.oil_change_limit}
          />
          {errors.oil_change_limit && (
            <div className={styles.errorText}>{errors.oil_change_limit}</div>
          )}
        </Grid>

        <Grid item lg={12} xs={12} sm={6} md={6}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        <Grid item lg={12} xs={12} sm={6} md={6}>
          {activeTab === "cash" && (
            <Grid className={styles.fromGrid} container spacing={3}>
              <Grid item lg={4} xs={12} sm={6} md={4}>
                <InputWithTitle
                  title={"VAT *"}
                  type={"text"}
                  placeholder={"VAT"}
                  onChange={handleInputChange(setVat, "vat_per")}
                  error={errors.vat_per}
                />
                {errors.vat_per && (
                  <div className={styles.errorText}>{errors.vat_per}</div>
                )}
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
                title="Select Bank *"
                options={bankOptions}
                value={selectedBankId}
                error={errors.bank_id}
              />
              {errors.bank_id && (
                <div className={styles.errorText}>{errors.bank_id}</div>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Cheque Date *"}
                type={"date"}
                placeholder={"Cheque Date"}
                onChange={handleInputChange(setChequeDate, "cheque_date")}
                error={errors.cheque_date}
              />
              {errors.cheque_date && (
                <div className={styles.errorText}>{errors.cheque_date}</div>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Cheque Number *"}
                type={"text"}
                placeholder={"Cheque Number"}
                onChange={handleInputChange(setChequeNo, "cheque_no")}
                error={errors.cheque_no}
              />
              {errors.cheque_no && (
                <div className={styles.errorText}>{errors.cheque_no}</div>
              )}
            </Grid>

            <Grid item lg={4} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"VAT *"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleInputChange(setVat, "vat_per")}
                error={errors.vat_per}
              />
              {errors.vat_per && (
                <div className={styles.errorText}>{errors.vat_per}</div>
              )}
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
                title="Select Bank *"
                options={bankOptions}
                value={selectedBankId}
                error={errors.bank_id}
              />
              {errors.bank_id && (
                <div className={styles.errorText}>{errors.bank_id}</div>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputWithTitle
                title={"Transaction Id *"}
                type={"text"}
                placeholder={"Transaction Id"}
                onChange={handleInputChange(setTransactionId, "transection_id")}
                error={errors.transection_id}
              />
              {errors.transection_id && (
                <div className={styles.errorText}>{errors.transection_id}</div>
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"VAT *"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleInputChange(setVat, "vat_per")}
                error={errors.vat_per}
              />
              {errors.vat_per && (
                <div className={styles.errorText}>{errors.vat_per}</div>
              )}
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

      <style jsx>{`
        .errorText {
          color: red;
          font-size: 12px;
          margin-top: 5px;
          margin-left: 15px;
        }
      `}</style>
    </div>
  );
};

export default withAuth(Page);
