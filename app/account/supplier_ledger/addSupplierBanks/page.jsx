"use client";
import GreenButton from "@/components/generic/GreenButton";
import InputWithTitle from "@/components/generic/InputWithTitle";
import React, { useEffect, useState } from "react";
import { AppAlerts } from "@/Helper/AppAlerts";
import { addSupplierBankInfo } from "@/networkUtil/Constants";
import { CircularProgress } from "@mui/material";
import APICall from "@/networkUtil/APICall";

import ViewBanks from "./bank";

const Index = () => {
  const api = new APICall();
  const [supplierID, setSupplierID] = useState();

  const [bank_name, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const alert = new AppAlerts();

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");
    setSupplierID(urlId);
  }, []);

  const getParamFromUrl = (url, param) => {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    return searchParams.get(param);
  };

  const addBankInfo = async () => {
    if (bank_name === "") {
      alert.errorAlert("Please enter Bank Name");
    } else if (iban === "") {
      alert.errorAlert("Please enter IBAN");
    } else if (accountNumber === "") {
      alert.errorAlert("Please enter Account number");
    } else if (bankAddress === "") {
      alert.errorAlert("Please enter bank address");
    } else {
      if (!sendingData) {
        setSendingData(true);
        let obj = {
          supplier_id: supplierID,
          bank_name: bank_name,
          iban: iban,
          account_number: accountNumber,
          address: bankAddress,
        };
        const response = await api.postFormDataWithToken(
          addSupplierBankInfo,
          obj
        );
        if (response.status === "success") {
          alert.successAlert(response.message);
          window.location.reload();
        } else {
          alert.errorAlert(response.error.message);
        }

        setSendingData(false);
      }
    }
  };

  const bankSection = () => {
    return (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputWithTitle title="Bank Name" onChange={setBankName} />
          </div>
          <div>
            <InputWithTitle title="IBAN" onChange={setIban} />
          </div>
          <div>
            <InputWithTitle
              title="Account Number"
              onChange={setAccountNumber}
            />
          </div>
          <div className="">
            <InputWithTitle title="Bank Address" onChange={setBankAddress} />
          </div>
        </div>

        <div className="mt-5">
          <GreenButton
            title={
              sendingData ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Add Bank Info"
              )
            }
            onClick={() => addBankInfo()}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {" "}
          <ViewBanks supplierID={supplierID} />{" "}
        </div>
        <div> {bankSection()} </div>
      </div>
    </>
  );
};

export default Index;
