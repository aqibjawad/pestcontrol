import { useState } from "react";
import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { suppliers } from "@/networkUtil/Constants";
import Swal from "sweetalert2";

export const useSupplier = () => {

  const api = new APICall();

  const router = useRouter();

  const [sendingData, setSendingData] = useState(false);

  const [supplierData, setSupplierData] = useState({
    supplier_name: "", // Updated to match validation schema
    company_name: "", // Updated to match validation schema
    email: "", // Remains the same
    number: "", // Remains the same
    vat: "", // Remains the same
    trn_no: "", // Updated to match validation schema
    address: "", // Remains the same
    country: "", // Remains the same
    state: "", // Remains the same
    hsn: "", // Updated to match validation schema
    city: "", // Remains the same
    zip: "", // Remains the same
    item_notes: "", // Updated to match validation schema
    opening_balance: ""
  });

  const handleInputChange = (field, value) => {
    setSupplierData((prev) => ({ ...prev, [field]: value }));
  };

  const emiratesOfDubai = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  const handleSupplierType = (value) => {
    handleInputChange("supplierType", value);
  };

  const handleCountryChanged = (value) => {
    handleInputChange("country", value);
  };

  const handleCityChanged = (value) => {
    handleInputChange("city", value);
  };

  const saveSupplier = async () => {
    let msg = "";
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (supplierData.supplier_name === "") {
      msg = "Please enter supplier name";
    } else if (supplierData.company_name === "") {
      msg = "Please enter company name";
    } else if (supplierData.email === "") {
      msg = "Please enter email";
    } else if (!emailRegex.test(supplierData.email)) {
      msg = "Please enter a valid email address";
    } else if (supplierData.number === "") {
      msg = "Please enter contact number";
    } else if (supplierData.vat === "") {
      msg = "Please enter VAT";
    } else if (supplierData.trn_no === "") {
      msg = "Please enter TRN";
    } else if (supplierData.address === "") {
      msg = "Please enter address";
    } else if (supplierData.country === "") {
      msg = "Please select country";
    } else if (supplierData.city === "") {
      msg = "Please select city";
    } else if (supplierData.hsn === "") {
      msg = "Please enter HSN";
    } else if (supplierData.zip === "") {
      msg = "Please enter zip code";
    } else if (supplierData.item_notes === "") {
      msg = "Please enter item notes";
    } else {
      msg = "";
      let obj = {
        supplier_name: supplierData.supplier_name,
        company_name: supplierData.company_name,
        email: supplierData.email,
        number: supplierData.number,
        vat: supplierData.vat,
        trn_no: supplierData.trn_no,
        address: supplierData.address,
        country: supplierData.country,
        city: supplierData.city,
        hsn: supplierData.hsn,
        zip: supplierData.zip,
        item_notes: supplierData.item_notes,
        opening_balance: supplierData.opening_balance
      };
      setSendingData(true);
      try {
        const response = await api.postFormDataWithToken(
          `${suppliers}/create`,
          obj
        );
        if (response.status === "success") {
          Swal.fire("Success", `Supplier added`, "success");
          router.push("/account/viewSuppliers")
        } else {
          Swal.fire("Error", `${response?.error?.message}`, "error");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire(
          "Error",
          "An error occurred while submitting the supplier data",
          "error"
        );
      } finally {
        setSendingData(false); // Ensure this is called whether successful or not
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
    supplierData,
    handleInputChange,
    emiratesOfDubai,
    handleSupplierType,
    handleCountryChanged,
    handleCityChanged,
    saveSupplier,
  };
};
