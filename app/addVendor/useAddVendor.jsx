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
        phone_number: vendorData.contact,
        email: vendorData.email,
        firm_name: vendorData.firm_name,
        acc_name: vendorData.acc_name,
        acc_contact: vendorData.acc_contact,
        acc_email: vendorData.acc_email,
        percentage: vendorData.percentage,
        mng_name: vendorData.mng_name,
        mng_email: vendorData.mng_email,
        mng_contact: vendorData.mng_contact,
      };
      setSendingData(true);
      try {
        const response = await api.postFormDataWithToken(`${vendors}/create`, obj);
        setSendingData(false);
        if (response.message === "Vendor Added") {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Vendor Added",
          });
          resetAllStates();
          router.push("/allVendors");
        } else {
          throw new Error("Could not add vendor");
        }
      } catch (error) {
        setSendingData(false);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not add vendor, please try later",
        });
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