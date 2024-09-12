"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import InputWithTitle from "@/components/generic/InputWithTitle";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";

import { Skeleton } from "@mui/material";
import Tabs from "./tabs";

import { expense_category, bank, expense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const Page = () => {
  const api = new APICall();

  const [activeTab, setActiveTab] = useState("cash");

  const [expense_name, setExpName] = useState();
  const [expense_category_id, setExpenseId] = useState();
  const [vat, setVat] = useState();
  const [total, setTotal] = useState();
  const [description, setDesc] = useState();
  const [expense_file, setExpenseFile] = useState();

  const [amount, setAmount] = useState();

  const [bank_id, setBankId] = useState();
  const [cheque_amount, setChequeAmount] = useState();
  const [cheque_date, setChequeDate] = useState();
  const [transection_id, setTransactionId] = useState();

  const [fetchingData, setFetchingData] = useState(false);

  // All Expenses States
  const [allExpensesList, setAllEpensesList] = useState([]);
  const [allExpenseNameList, setExpenseNameList] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");

  // All Banks States
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  const [loading, setLoading] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // setFormData((prevState) => ({
    //   ...prevState,
    //   payment_type: tab,
    // }));
  };

  useEffect(() => {
    getAllExpenses();
    getAllBanks();
  }, []);

  const getAllExpenses = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${expense_category}`);
      setAllEpensesList(response.data);
      const expenseNames = response.data.map((item) => item.expense_category);
      setExpenseNameList(expenseNames);
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

  const handleFileSelect = (file) => {
    setExpenseFile(file);
  };

  const handleExpenseChange = (name, index) => {
    const idAtIndex = allExpensesList[index].id;
    setSelectedExpenseId(idAtIndex);
  };

  const handleBankChange = (name, index) => {
    const idAtIndex = allBankNameList[index].id;
    setSelectedBankId(idAtIndex);
  };

  const createExpenseObject = () => {
    let expenseObj = {
      expense_name,
      expense_category_id: selectedExpenseId,
      vat,
      total,
      description,
      expense_file,
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
        cheque_amount,
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
    const expenseData = createExpenseObject();
    try {
      const response = await api.postFormDataWithToken(
        `${expense}/create`,
        expenseData
      );
      // Handle successful response
      console.log("Expense created successfully:", response);
    } catch (error) {
      // Handle error
      console.error("Error creating expense:", error);
    }
  };

  const imageContainer = () => {
    return (
      <div>
        <div className={styles.expenseTitle}>Expense</div>
        <div className={styles.imageContainer}>
          <UploadImagePlaceholder onFileSelect={handleFileSelect} />
        </div>
      </div>
    );
  };

  const expenseForm = () => {
    return (
      <div>
        <InputWithTitle
          title={"Expense Name"}
          type={"text"}
          placeholder={"Please enter expense name"}
          onChange={setExpName}
        />
        <div className="mt-5">
          <Dropdown
            onChange={(name, index) => handleExpenseChange(name, index)}
            title={"Category"}
            options={allExpenseNameList}
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
                type={"text"}
                placeholder={"Cheque Date"}
                onChange={setChequeDate}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Amount"}
                type={"text"}
                placeholder={"Cheque Amount"}
                onChange={setChequeAmount}
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
      <div className="pageTitle">Add Expenses</div>
      <div className="mt-10"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4">{imageContainer()}</div>
        <div className="p-4">{expenseForm()}</div>
      </div>
      <div>
        {loading ? (
          <Skeleton variant="rectangular" width={100} height={40} />
        ) : (
          <GreenButton onClick={handleSubmit} title={"Save"} />
        )}
      </div>
    </div>
  );
};

export default Page;
