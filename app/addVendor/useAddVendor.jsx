import { useState } from "react";
import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { vendors } from "@/networkUtil/Constants";
import Swal from "sweetalert2";

export const useVendor = () => {
  const api = new APICall();
  const router = useRouter();
  const [vendorData, setVendorData] = useState({
    name: "",
    firm_name: "",
    email: "",
    contact: "",
    mng_name: "",
    mng_contact: "",
    mng_email: "",
    acc_name: "",
    acc_contact: "",
    acc_email: "",
    percentage: "",
    tag: "",
    vat: "",
    opening_balance: "",
  });
  const [sendingData, setSendingData] = useState(false);

  const handleInputChange = (field, value) => {
    setVendorData((prev) => ({ ...prev, [field]: value }));
  };

  const resetAllStates = () => {
    setVendorData({
      name: "",
      firm_name: "",
      email: "",
      contact: "",
      mng_name: "",
      mng_contact: "",
      mng_email: "",
      acc_name: "",
      acc_contact: "",
      acc_email: "",
      percentage: "",
      tag: "",
      vat: "",
      opening_balance: "",
    });
  };

  const addRequest = async () => {
    let msg = "";
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (vendorData.name === "") {
      msg = "Please enter vendor name";
    } else if (vendorData.firm_name === "") {
      msg = "Please enter firm name";
    } else if (vendorData.percentage === "") {
      msg = "Please enter percentage";
    } else if (isNaN(vendorData.percentage)) {
      msg = "Please enter percentage in numbers";
    } else {
      msg = "";
      let obj = {
        name: vendorData.name,
        contact: vendorData.contact,
        email: vendorData.email,
        firm_name: vendorData.firm_name,
        acc_name: vendorData.acc_name,
        acc_contact: vendorData.acc_contact,
        acc_email: vendorData.acc_email,
        percentage: vendorData.percentage,
        mng_name: vendorData.mng_name,
        mng_email: vendorData.mng_email,
        mng_contact: vendorData.mng_contact,
        tag: vendorData.tag,
        vat: vendorData.vat,
        opening_balance: vendorData.opening_balance,
      };
      setSendingData(true);
      try {
        const response = await api.postFormDataWithToken(
          `${vendors}/create`,
          obj
        );
        if (response.status === "success") {
          Swal.fire("Success", `Vendor added`, "success");
        } else {
          Swal.fire("Error", `${response?.error?.message}`, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire(
          "Error",
          "An error occurred while submitting the payment",
          "error"
        );
      } finally {
        setSendingData(false); 
      }
    }

    if (msg !== "") {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
      });
    }
  };

  return {
    vendorData,
    handleInputChange,
    sendingData,
    addRequest,
  };
};
