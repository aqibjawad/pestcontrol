"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";
import { CircularProgress, Grid, IconButton } from "@mui/material";
import { product, customers, saleOrder } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { AppAlerts } from "../../../Helper/AppAlerts";
import { useRouter } from "next/navigation";
// import { Plus, Trash2 } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  const [salesEntries, setSalesEntries] = useState([
    {
      customer_id: "",
      product_id: "",
      vat_per: "",
      price: "",
      quantity: "",
      dis_per: "",
    },
  ]);

  const [fetchingData, setFetchingData] = useState(false);
  const [allSupplierList, setAllSuppliersList] = useState([]);
  const [allSupplierNameList, setSupplierNameList] = useState([]);
  const [allBanksList, setAllBankList] = useState([]);
  const [allBankNameList, setBankNameList] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllCustomers();
    getAllProducts();
  }, []);

  const getAllCustomers = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${customers}`);
      setAllSuppliersList(response.data);
      const customerNames = response.data.map((item) => item.person_name);
      setSupplierNameList(customerNames);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllProducts = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}`);
      setAllBankList(response.data);
      const productNames = response.data.map((item) => item.product_name);
      setBankNameList(productNames);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...salesEntries];
    updatedEntries[index][field] = value;
    setSalesEntries(updatedEntries);
  };

  const handleCustomerChange = (index, name, customerIndex) => {
    const customerId = allSupplierList[customerIndex].id;
    handleEntryChange(index, "customer_id", customerId);
  };

  const handleProductChange = (index, name, productIndex) => {
    const productId = allBanksList[productIndex].id;
    handleEntryChange(index, "product_id", productId);
  };

  const addSalesEntry = () => {
    setSalesEntries([
      ...salesEntries,
      {
        customer_id: "",
        product_id: "",
        vat_per: "",
        price: "",
        quantity: "",
        dis_per: "",
      },
    ]);
  };

  const removeSalesEntry = (index) => {
    const updatedEntries = salesEntries.filter((_, i) => i !== index);
    setSalesEntries(updatedEntries);
  };

  const createSalesObject = () => {
    return {
      customer_id: salesEntries.map((entry) => entry.customer_id).join(","),
      product_id: salesEntries.map((entry) => entry.product_id).join(","),
      vat_per: salesEntries.map((entry) => entry.vat_per).join(","),
      price: salesEntries.map((entry) => entry.price).join(","),
      quantity: salesEntries.map((entry) => entry.quantity).join(","),
      dis_per: salesEntries.map((entry) => entry.dis_per).join(","),
    };
  };

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    const salesData = createSalesObject();
    try {
      const response = await api.postFormDataWithToken(
        `${saleOrder}/create`,
        salesData
      );
      if (response.status === "success") {
        alerts.successAlert("Sale orders have been created");
        // router.push('/some-route');
      } else {
        alerts.errorAlert(response.error.message);
      }
    } catch (error) {
      console.error("Error submitting sales data:", error);
      alerts.errorAlert("An error occurred while submitting the data");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderSalesForm = (entry, index) => {
    return (
      <Grid container spacing={3} className="mt-5" key={index}>
        <Grid item xs={12} sm={6}>
          <Dropdown
            onChange={(name, customerIndex) =>
              handleCustomerChange(index, name, customerIndex)
            }
            title="Customers List"
            options={allSupplierNameList}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Dropdown
            onChange={(name, productIndex) =>
              handleProductChange(index, name, productIndex)
            }
            title="Product List"
            options={allBankNameList}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Discount"
            type="text"
            placeholder="Enter Discount"
            onChange={(value) => handleEntryChange(index, "dis_per", value)}
            value={entry.dis_per}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Quantity"
            type="text"
            placeholder="Enter Quantity"
            onChange={(value) => handleEntryChange(index, "quantity", value)}
            value={entry.quantity}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Vat"
            type="text"
            placeholder="Enter Vat"
            onChange={(value) => handleEntryChange(index, "vat_per", value)}
            value={entry.vat_per}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Price"
            type="text"
            placeholder="Enter Price"
            onChange={(value) => handleEntryChange(index, "price", value)}
            value={entry.price}
          />
        </Grid>
        <Grid item xs={12}>
          <IconButton onClick={() => removeSalesEntry(index)} color="error">
            <FaTrash />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Sales</div>
      <div className="mt-10"></div>
      <div className="p-4">
        {salesEntries.map((entry, index) => renderSalesForm(entry, index))}
        <IconButton onClick={addSalesEntry} color="primary" className="mt-4">
          <CiSquarePlus />
        </IconButton>
      </div>
      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loadingSubmit ? "Saving..." : "Save"}
          disabled={loadingSubmit}
          startIcon={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        />
      </div>
    </div>
  );
};

export default Page;
