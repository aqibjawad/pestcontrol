"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "../../../components/generic/InputWithTitle3";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";
import { CircularProgress } from "@mui/material";
import Tabs from "./tabs";

import { expense_category, bank, expense } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import { AppAlerts } from "../../../Helper/AppAlerts";

import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("cash");

  const [expense_name, setExpName] = useState();
  const [expense_date, setExpDate] = useState();
  const [vat, setVat] = useState();
  const [total, setTotal] = useState();
  const [description, setDesc] = useState();
  const [expense_file, setExpenseFile] = useState();

  const [amount, setAmount] = useState();

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

  const [sendingData, setSendingData] = useState(false);

  const [loading, setLoading] = useState(false);

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
    const idAtIndex = allBanksList[index].id; // Changed from allBankNameList to allBanksList
    setSelectedBankId(idAtIndex);
  };

  const createExpenseObject = () => {
    let expenseObj = {
      expense_name,
      expense_date,
      expense_category_id: selectedExpenseId,
      vat,
      total,
      description,
      payment_type: activeTab,
    };
    if (expense_file) {
      expenseObj.expense_file = expense_file;
    }

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
    setLoading(true); // Start loading
    try {
      const expenseData = createExpenseObject();
      const response = await api.postFormDataWithToken(
        `${expense}/create`,
        expenseData
      );
      if (response.status === "success") {
        alerts.successAlert("Expense has been updated");
        router.push("/operations/viewAllExpenses");
      } else {
        alerts.errorAlert(response.error.message);
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      alerts.errorAlert("An error occurred while submitting the expense");
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const imageContainer = () => {
    return (
      <div>
        <div className={styles.expenseTitle}>Expense</div>
        <div style={{ cursor: "pointer" }} className={styles.imageContainer}>
          <UploadImagePlaceholder onFileSelect={handleFileSelect} />
        </div>
      </div>
    );
  };

  const calculateTotal = (amount, vat) => {
    const amountValue = parseFloat(amount) || 0;
    const vatPercentage = parseFloat(vat) || 0;
    const vatAmount = (amountValue * vatPercentage) / 100;
    return (amountValue + vatAmount).toFixed(2);
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    setTotal(calculateTotal(value, vat));
  };

  const handleVatChange = (value) => {
    setVat(value);
    setTotal(calculateTotal(amount, value));
  };

  const handleDateChange = (name, value) => {
    setExpDate(value);
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
          <InputWithTitle3
            title={"Expense Date"}
            type={"date"}
            placeholder={"Please enter expense Date"}
            onChange={handleDateChange}
            value={expense_date}
          />
        </div>
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
                onChange={handleAmountChange}
                value={amount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                value={total}
                readOnly
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
              <InputWithTitle3
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
                onChange={handleAmountChange}
                value={amount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                value={total}
                readOnly
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
                onChange={handleAmountChange}
                value={amount}
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
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total "}
                type={"text"}
                placeholder={"Total"}
                value={total}
                readOnly
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
      {/* <div>
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          <GreenButton onClick={handleSubmit} title={"Save"} />
        )}
      </div> */}
      <GreenButton
        onClick={handleSubmit}
        title={
          loading ? <CircularProgress size={20} color="inherit" /> : "Submit"
        }
        disabled={loading}
      />
      {/* <GreenButton
        sendingData={sendingData}
        onClick={handleSubmit}
        title={"Add Expense"}
      /> */}
    </div>
  );
};

export default withAuth(Page);
