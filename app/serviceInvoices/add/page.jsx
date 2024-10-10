"use client";

import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { serviceInvoice, bank } from "@/networkUtil/Constants";
import GreenButton from "@/components/generic/GreenButton";
import APICall from "@/networkUtil/APICall";
import Tabs from "./tabs";
import styles from "../../../styles/stock.module.css";
import Dropdown2 from "@/components/generic/Dropdown2";

import { useRouter } from "next/navigation";

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

const Page = () => {

  const api = new APICall();

  const router = useRouter();

  // Basic states
  const [id, setId] = useState("");
  const [paid_amt, setPaidAmount] = useState("");
  const [descrp, setDescrp] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");
  const [isAllAmtPay, setIsAllAmtPay] = useState(false);

  // Bank states
  const [allBanksList, setAllBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");

  // Payment method specific states
  const [cheque_amount, setChequeAmount] = useState("");
  const [cheque_no, setChequeNo] = useState("");
  const [cheque_date, setChequeDate] = useState("");
  const [transection_id, setTransactionId] = useState("");

  useEffect(() => {
    getAllBanks();
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  const getAllBanks = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setAllBankList(response.data);
    } catch (error) {
      console.error("Error fetching Banks:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset form fields when changing tabs
    setSelectedBankId("");
    setChequeAmount("");
    setChequeNo("");
    setChequeDate("");
    setTransactionId("");
  };

  const handleBankChange = (selectedValue) => {
    setSelectedBankId(selectedValue);
  };

  const handlePayAllClick = () => {
    setIsAllAmtPay(!isAllAmtPay);
  };

  const createVehicleObject = () => {
    let vehicleObj = {
      service_invoice_id: id,
      paid_amt,
      descrp,
      is_all_amt_pay: isAllAmtPay ? 1 : 0,
      payment_type: activeTab,
    };

    if (activeTab === "cheque") {
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
        amount: paid_amt,
        transection_id,
      };
    }

    return vehicleObj;
  };

  const handleSubmit = async () => {
    setButtonLoading(true);

    const vehicleData = createVehicleObject();
    const response = await api.postFormDataWithToken(
      `${serviceInvoice}/add_payment`,
      vehicleData
    );

    if (response.status === "success") {
      alert("Service Invoice Payment Added Successfully");
      router.push("/viewInvoice")
    } else {
      alert(`${response.error.message}`);
    }
  };

  // Prepare bank options for dropdown2
  const bankOptions = allBanksList.map((bank) => ({
    value: bank.id,
    label: bank.bank_name,
  }));

  return (
    <Grid
      style={{ backgroundColor: "white" }}
      item
      lg={6}
      xs={12}
      sm={6}
      md={6}
    >
      <Grid container spacing={2}>
        <Grid item lg={8} xs={12} md={6}>
          <InputWithTitle
            onChange={(value) => setPaidAmount(value)}
            type="text"
            value={paid_amt}
            title="Paid Amount"
          />
        </Grid>

        <Grid className="mt-3" item lg={4} xs={12} md={6}>
          <button
            onClick={handlePayAllClick}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: isAllAmtPay ? "#28a745" : "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s ease",
            }}
          >
            Pay All
          </button>
        </Grid>

        <Grid item lg={12} xs={12} md={12}>
          <InputWithTitle
            onChange={(value) => setDescrp(value)}
            type="text"
            value={descrp}
            title="Description"
          />
        </Grid>

        <Grid item lg={6} xs={12} sm={6} md={6}>
          <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </Grid>

        {activeTab !== "cash" && (
          <Grid className={styles.fromGrid} container spacing={3}>
            <Grid item xs={12}>
              <Dropdown2
                onChange={handleBankChange}
                title="Banks"
                options={bankOptions}
                value={selectedBankId}
              />
            </Grid>

            {activeTab === "cheque" && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <InputWithTitle
                    title="Cheque Date"
                    type="date"
                    value={cheque_date}
                    onChange={(value) => setChequeDate(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputWithTitle
                    title="Cheque Number"
                    type="text"
                    value={cheque_no}
                    onChange={(value) => setChequeNo(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InputWithTitle
                    title="Cheque Amount"
                    type="text"
                    value={cheque_amount}
                    onChange={(value) => setChequeAmount(value)}
                  />
                </Grid>
              </>
            )}

            {activeTab === "online" && (
              <Grid item xs={12} sm={6}>
                <InputWithTitle
                  title="Transaction ID"
                  type="text"
                  value={transection_id}
                  onChange={(value) => setTransactionId(value)}
                />
              </Grid>
            )}
          </Grid>
        )}
      </Grid>

      {/* <div className="mt-5">
        <GreenButton onClick={handleSubmit} disabled={buttonLoading}>
          {buttonLoading ? (
            <>
              <CircularProgress size={20} style={{ marginRight: "10px" }} />
              <span>Submitting...</span>
            </>
          ) : (
            "Submit"
          )}
        </GreenButton>
      </div> */}

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={buttonLoading ? "Submitting..." : "Submit"}
          disabled={buttonLoading}
        />
      </div>
    </Grid>
  );
};

export default Page;
