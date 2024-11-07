"use client";
import React, { useState, useEffect } from "react";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
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
  const [vat, setVat] = useState("");
  const [total, setTotal] = useState("");
  const [description, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [cheque_no, setChequeNumber] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [allSupplierList, setAllSuppliersList] = useState([]);
  const [allSupplierNameList, setSupplierNameList] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Calculate total whenever amount or VAT changes
  useEffect(() => {
    calculateTotal();
  }, [amount, vat]);

  const calculateTotal = () => {
    const amountValue = parseFloat(amount) || 0;
    const vatValue = parseFloat(vat) || 0;
    const calculatedTotal = amountValue + vatValue;
    setTotal(calculatedTotal.toFixed(2));
  };

  const handleAmountChange = (value) => {
    setAmount(value);
  };

  const handleVatChange = (value) => {
    setVat(value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset values when changing tabs
    setAmount("");
    setVat("");
    setTotal("");
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
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setAllBankList(response.data);
      const expenseNames = response.data.map((item) => item.bank_name);
      setBankNameList(expenseNames);
    } catch (error) {
      console.error("Error fetching banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleExpenseChange = (name, index) => {
    const selectedSupplier = allSupplierList[index];
    setSelectedSupplier(selectedSupplier);
  };

  const supplierOptions = allSupplierList.map(
    (supplier) =>
      `${supplier.supplier_name} - ${supplier.company_name} (${supplier.number})`
  );

  const handleBankChange = (name, index) => {
    const idAtIndex = allBanksList[index].id;
    setSelectedBankId(idAtIndex);
  };

  const createExpenseObject = () => {
    let expenseObj = {
      supplier_id: selectedSupplier.id,
      vat,
      total,
      description,
      payment_type: activeTab,
    };

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
        router.push(
          `/account/supplier_ledger/?id=${selectedSupplier.id}&supplier_name=${
            selectedSupplier.supplier_name
          }&company_name=${encodeURIComponent(
            selectedSupplier.company_name
          )}&number=${selectedSupplier.number}`
        );
      } else {
        alerts.errorAlert(response.error.message);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChequeDate = (name, value) => {
    setChequeDate(value);
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
                type={"number"}
                placeholder={"Cash Amount"}
                onChange={handleAmountChange}
                value={amount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
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
                value={cheque_date}
                onChange={handleChequeDate}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle
                title={"Cheque Amount"}
                type={"number"}
                placeholder={"Cheque Amount"}
                onChange={handleAmountChange}
                value={amount}
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
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
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
                type={"number"}
                placeholder={"Transaction Amount"}
                onChange={handleAmountChange}
                value={amount}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Transaction Id"}
                type={"text"}
                placeholder={"Transaction Id"}
                onChange={setTransactionId}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"VAT %"}
                type={"text"}
                placeholder={"VAT"}
                onChange={handleVatChange}
                value={vat}
              />
            </div>

            <div className="mt-5">
              <InputWithTitle
                title={"Total"}
                type={"text"}
                placeholder={"Total"}
                value={total}
                disabled={true}
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
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit}
        />
      </div>
    </div>
  );
};

export default Page;
