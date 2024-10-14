"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";

import { CircularProgress } from "@mui/material";
import Tabs from "./tabs";

import { getAllSuppliers, bank, expense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import { AppAlerts } from "../../../Helper/AppAlerts";

import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("cash");

  const [vat, setVat] = useState();
  const [total, setTotal] = useState();
  const [description, setDesc] = useState();

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // setFormData((prevState) => ({
    //   ...prevState,
    //   payment_type: tab,
    // }));
  };

  useEffect(() => {
    getAllSupplier();
    getAllBanks();
  }, []);

  const getAllSupplier = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllSuppliers}`);
      setAllSuppliersList(response.data);
      const expenseNames = response.data.map((item) => item.supplier_name);
      setSupplierNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setFetchingData(false);
    }
  };

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

  const handleExpenseChange = (name, index) => {
    const idAtIndex = allSupplierList[index].id;
    setSelectedSupplierId(idAtIndex);
  };

  const handleBankChange = (name, index) => {
    const idAtIndex = allBanksList[index].id;
    setSelectedBankId(idAtIndex);
  };

  const createExpenseObject = () => {
    let expenseObj = {
      supplier_id: selectedSupplierId,
      vat,
      total,
      description,
      payment_type: activeTab,
    };

    // Add fields based on the active payment type
    if (activeTab === "cash") {
      expenseObj = {
        ...expenseObj,
        amount,
      };
    } else if (activeTab === "cheque") {
      expenseObj = {
        ...expenseObj,
        bank_id: selectedBankId,
        amount,
        cheque_no,
        cheque_date,
      };
    } else if (activeTab === "online") {
      expenseObj = {
        ...expenseObj,
        bank_id: selectedBankId,
        amount,
        transection_id,
      };
    }

    return expenseObj;
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);

    const expenseData = createExpenseObject();
    try {
      const response = await api.postFormDataWithToken(
        `${getAllSuppliers}/add_payment`,
        expenseData
      );

      if (response.status === "success") {
        alerts.successAlert("Expense has been updated");
        router.push(`/account/supplier_ledger/?id=${selectedSupplierId}`);
      } else {
        alerts.errorAlert(response.error.message);
      }

      // if (response.status === "success") {
      //   alerts.successAlert("Expense has been updated");
      // } else {
      //   alerts.errorAlert(response.message);
      // }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const expenseForm = () => {
    return (
      <div>
        <div className="mt-5">
          <Dropdown
            onChange={(name, index) => handleExpenseChange(name, index)}
            title={"Suppliers List"}
            options={allSupplierNameList}
          />
        </div>

        <div className="mt-5">
          <MultilineInput
            title={"Description"}
            type={"text"}
            placeholder={"Enter description"}
            onChange={setDesc}
          />
        </div>

        <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {activeTab === "cash" && (
          <div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cash Amount"}
                type={"text"}
                placeholder={"Cash Amount"}
                onChange={setAmount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                onChange={setTotal}
              />
            </div>
          </div>
        )}

        {activeTab === "cheque" && (
          <div>
            <div className="mt-5">
              <Dropdown
                onChange={handleBankChange}
                title={"Banks"}
                options={allBankNameList}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Date"}
                type={"date"}
                placeholder={"Cheque Date"}
                onChange={setChequeDate}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Amount"}
                type={"text"}
                placeholder={"Cheque Amount"}
                onChange={setAmount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Number"}
                type={"text"}
                placeholder={"Cheque Number"}
                onChange={setChequeNumber}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                onChange={setTotal}
              />
            </div>
          </div>
        )}

        {activeTab === "online" && (
          <div>
            <div className="mt-5">
              <Dropdown
                onChange={handleBankChange}
                title={"Banks"}
                options={allBankNameList}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Transaction Amount"}
                type={"text"}
                placeholder={"Transaction Amount"}
                onChange={setAmount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Transactoin Id"}
                type={"text"}
                placeholder={"Transactoin Id"}
                onChange={setTransactionId}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                onChange={setTotal}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Supplier Payments</div>
      <div className="mt-10"></div>
      <div className="p-4">{expenseForm()}</div>
      <div className="mt-10">
        {/* <GreenButton
          onClick={handleSubmit}
          title={"Save"}
          disabled={loadingSubmit}
          startIcon={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        /> */}
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? <CircularProgress size={20} color="inherit" /> : "Submit"
          }
          disabled={loadingSubmit}
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
