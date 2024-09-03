"use client";
import React, { useState } from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import styles from ".././../styles/superAdmin/addVendor.module.css";
import GreenButton from "@/components/generic/GreenButton";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { addVendor } from "@/networkUtil/Constants";
const Page = () => {
  const api = new APICall();
  const router = useRouter();
  const [vendorName, setVendorName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [managerName, setMangerName] = useState("");
  const [managerContact, setManagerContact] = useState("");
  const [managerEmail, setManagerEmail] = useState("");

  const [accountantName, setAccountantName] = useState("");
  const [accountantContact, setAccountantContact] = useState("");
  const [accountantEmail, setAccountantEmail] = useState("");
  const [percentage, setPercentage] = useState("");
  const [sendingData, setSendingData] = useState(false);

  const addRequest = async () => {
    let msg = "";
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (vendorName === "") {
      msg = "Please enter vendor name";
    } else if (firmName === "") {
      msg = "Please enter firm name";
    } else if (percentage === "") {
      msg = "Please enter percentage";
    } else if (isNaN(percentage)) {
      msg = "Please enter percentage in numbers";
    } else {
      msg = "";
      let obj = {
        name: vendorName,
        role: "6",
        phone_number: vendorContact,
        email: vendorEmail,
        firm_name: firmName,
        acc_name: accountantName,
        acc_contact: accountantContact,
        acc_email: accountantEmail,
        percentage: percentage,
        mng_name: managerName,
        mng_email: managerEmail,
        mng_contact: managerContact,
      };
      setSendingData(true);
      const response = await api.postFormDataWithToken(addVendor, obj);
      setSendingData(false);
      if (response.message === "Vendor Added") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vendor Added",
        }).then((result) => {
          if (result.isConfirmed) {
            resetAllStates();
            router.push("/allVendors");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not add vendor, please try later",
        });
      }
    }

    if (msg !== "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    }
  };

  const resetAllStates = () => {
    setVendorName("");
    setFirmName("");
    setVendorEmail("");
    setVendorContact("");
    setMangerName("");
    setManagerContact("");
    setManagerEmail("");
    setAccountantName("");
    setAccountantContact("");
    setAccountantEmail("");
    setPercentage("");
  };

  return (
    <div>
      <div className="pageTitle">Add Vendor</div>
      <div className="grid grid-cols-4 gap-5">
        <div className="mt-5">
          <InputWithTitle
            onChange={setVendorName}
            title={"Vendor Name"}
            value={vendorName}
            placeholder={"Vendor Name"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            onChange={setFirmName}
            title={"Firm Name"}
            value={firmName}
            placeholder={"Firm Name"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorContact}
            onChange={setVendorContact}
            title={"Vendor Contact"}
            placeholder={"Vendor Contact"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorEmail}
            onChange={setVendorEmail}
            title={"Vendor Email"}
            placeholder={"Vendor Email"}
          />
        </div>
      </div>

      <div className={styles.itemTitle}>Manager</div>
      <div className="grid grid-cols-3 mt-5 gap-10">
        <div>
          <InputWithTitle
            onChange={setMangerName}
            title={"Manger Name"}
            value={managerName}
            placeholder={"Manger Name"}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={setManagerContact}
            title={"Manager Contact"}
            value={managerContact}
            placeholder={"Manger Contact"}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={setManagerEmail}
            title={"Manager Email"}
            type={"email"}
            placeholder={"Manger Email"}
            value={managerEmail}
          />
        </div>
      </div>

      <div className={styles.itemTitle}>Accountant</div>
      <div className="grid grid-cols-3 mt-5 gap-10">
        <div>
          <InputWithTitle
            onChange={setAccountantName}
            title={"Accountant Name"}
            placeholder={"Accountant Name"}
            value={accountantName}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={setAccountantContact}
            title={"Accountant Contact"}
            placeholder={"Accountant Contact"}
            value={accountantContact}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={setAccountantEmail}
            title={"Accountant Email"}
            type={"email"}
            value={accountantEmail}
            placeholder={"Accountant Email"}
          />
        </div>
      </div>

      <div className="mt-5">
        <InputWithTitle
          title={"Percentage"}
          onChange={setPercentage}
          placeholder={"Percentage"}
          value={percentage}
        />
      </div>
      <div className="mt-20 ml-20 mr-20">
        <GreenButton
          sendingData={sendingData}
          onClick={() => addRequest()}
          title={"Add Vendor"}
        />
      </div>
    </div>
  );
};

export default Page;
