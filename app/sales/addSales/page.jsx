"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";

import { CircularProgress, Grid } from "@mui/material";

import { product, customers, saleOrder } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import { AppAlerts } from "../../../Helper/AppAlerts";

import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("cash");

  const [vat_per, setVat] = useState();
  const [price, setPrice] = useState();
  const [dis_per, setDiscount] = useState();
  const [quantity, setQuantity] = useState();

  const [amount, setAmount] = useState();

  const [cheque_no, setChequeNumber] = useState();
  const [cheque_date, setChequeDate] = useState();
  const [transection_id, setTransactionId] = useState();

  const [fetchingData, setFetchingData] = useState(false);

  // All Expenses States
  const [allSupplierList, setAllSuppliersList] = useState([]);
  const [allSupplierNameList, setSupplierNameList] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  // All Banks States
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);

  const [selectedBankId, setSelectedBankId] = useState("");

  const [loading, setLoading] = useState(true);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllCustomers();
    getAllProducts();
  }, []);

  const getAllCustomers = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${customers}`);
      setAllSuppliersList(response.data);
      const expenseNames = response.data.map((item) => item.person_name);
      setSupplierNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllProducts = async () => {
    true;
    try {
      const response = await api.getDataWithToken(`${product}`);
      setAllBankList(response.data);

      const expenseNames = response.data.map((item) => item.product_name);
      setBankNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleBankChange = (name, index) => {
    const idAtIndex = allBanksList[index].id;
    setSelectedBankId(idAtIndex);
  };

  const handleExpenseChange = (name, index) => {
    const idAtIndex = allSupplierList[index].id;
    setSelectedSupplierId(idAtIndex);
  };

  const createExpenseObject = () => {
    let expenseObj = {
      customer_id: selectedSupplierId,
      product_id: selectedBankId,
      vat_per,
      price,
      quantity,
      dis_per,
    };

    return expenseObj;
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const expenseData = createExpenseObject();
    try {
      const response = await api.postFormDataWithToken(
        `${saleOrder}/create`,
        expenseData
      );

      if (response.status === "success") {
        alerts.successAlert("Sale order has been updated");
        // router.push(`/account/supplier_ledger/?id=${selectedSupplierId}`);
      } else {
        alerts.errorAlert(response.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const expenseForm = () => {
    return (
      <Grid container spacing={3} className="mt-5">
        {/* Dropdown Section */}
        <Grid item xs={12} sm={6}>
          <Dropdown
            onChange={(name, index) => handleExpenseChange(name, index)}
            title={"Customers List"}
            options={allSupplierNameList}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Dropdown
            onChange={handleBankChange}
            title={"Product List"}
            options={allBankNameList}
          />
        </Grid>

        {/* Multiline Input Section */}
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title={"Discount"}
            type={"text"}
            placeholder={"Enter Discount"}
            onChange={setDiscount}
          />
        </Grid>

        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title={"Quantity"}
            type={"text"}
            placeholder={"Enter Quantity"}
            onChange={setQuantity}
          />
        </Grid>

        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title={"Vat"}
            type={"text"}
            placeholder={"Enter Vat"}
            onChange={setVat}
          />
        </Grid>

        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title={"Price"}
            type={"text"}
            placeholder={"Enter Price"}
            onChange={setPrice}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Supplier Payments</div>
      <div className="mt-10"></div>
      <div className="p-4">{expenseForm()}</div>
      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loadingSubmit ? "Saving..." : "Save"}
          disabled={loadingSubmit}
          startIcon={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        />
      </div>
      {/* <div>
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          <GreenButton onClick={handleSubmit} title={"Save"} />
        )}
      </div> */}
      {/* <GreenButton
        sendingData={sendingData}
        onClick={handleSubmit}
        title={"Add Expense"}
      /> */}
    </div>
  );
};

export default Page;
