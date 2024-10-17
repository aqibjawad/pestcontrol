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
import { FaTrash } from "react-icons/fa";
import { CiSquarePlus } from "react-icons/ci";

const Page = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const router = useRouter();

  // Single customer state
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [salesEntries, setSalesEntries] = useState([
    {
      product_id: "",
      vat_per: "",
      price: "",
      quantity: "",
    },
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [fetchingData, setFetchingData] = useState(false);
  const [allCustomersList, setAllCustomersList] = useState([]);
  const [allCustomerNameList, setCustomerNameList] = useState([]);
  const [allProductsList, setAllProductsList] = useState([]);
  const [allProductNameList, setProductNameList] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllCustomers();
    getAllProducts();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [salesEntries, totalDiscount]);

  const calculateTotalAmount = () => {
    const total = salesEntries.reduce((sum, entry) => {
      const price = parseFloat(entry.price) || 0;
      const quantity = parseFloat(entry.quantity) || 0;
      const vat = parseFloat(entry.vat_per) || 0;

      const subTotal = price * quantity;
      const vatAmount = (subTotal * vat) / 100;
      return sum + subTotal + vatAmount;
    }, 0);

    setTotalAmount(total);

    // Calculate final amount after discount
    const discountAmount = (total * (parseFloat(totalDiscount) || 0)) / 100;
    setFinalAmount(total - discountAmount);
  };

  const getAllCustomers = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${customers}`);
      setAllCustomersList(response.data);
      const customerNames = response.data.map((item) => item.person_name);
      setCustomerNameList(customerNames);
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
      setAllProductsList(response.data);
      const productNames = response.data.map((item) => item.product_name);
      setProductNameList(productNames);
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

  const handleCustomerChange = (name, customerIndex) => {
    const customerId = allCustomersList[customerIndex].id;
    setSelectedCustomerId(customerId);
  };

  const handleProductChange = (index, name, productIndex) => {
    const productId = allProductsList[productIndex].id;
    handleEntryChange(index, "product_id", productId);
  };

  const addSalesEntry = () => {
    setSalesEntries([
      ...salesEntries,
      {
        product_id: "",
        vat_per: "",
        price: "",
        quantity: "",
      },
    ]);
  };

  const removeSalesEntry = (index) => {
    const updatedEntries = salesEntries.filter((_, i) => i !== index);
    setSalesEntries(updatedEntries);
  };

  const createSalesObject = () => {
    return {
      customer_id: selectedCustomerId,
      product_id: salesEntries.map((entry) => entry.product_id).join(","),
      vat_per: salesEntries.map((entry) => entry.vat_per).join(","),
      price: salesEntries.map((entry) => entry.price).join(","),
      quantity: salesEntries.map((entry) => entry.quantity).join(","),
      dis_per: totalDiscount,
      total_amount: totalAmount.toFixed(2),
      final_amount: finalAmount.toFixed(2),
    };
  };

  const handleSubmit = async () => {
    if (!selectedCustomerId) {
      alerts.errorAlert("Please select a customer");
      return;
    }

    setLoadingSubmit(true);
    const salesData = createSalesObject();
    try {
      const response = await api.postFormDataWithToken(
        `${saleOrder}/create`,
        salesData
      );
      if (response.status === "success") {
        alerts.successAlert("Sale orders have been created");
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
            onChange={(name, productIndex) =>
              handleProductChange(index, name, productIndex)
            }
            title="Product List"
            options={allProductNameList}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Quantity"
            type="number"
            placeholder="Enter Quantity"
            onChange={(value) => handleEntryChange(index, "quantity", value)}
            value={entry.quantity}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Vat %"
            type="number"
            placeholder="Enter Vat"
            onChange={(value) => handleEntryChange(index, "vat_per", value)}
            value={entry.vat_per}
          />
        </Grid>
        <Grid item lg={6} xs={12} sm={6}>
          <InputWithTitle
            title="Price"
            type="number"
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
        {/* Single Customer Dropdown at the top */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Dropdown
              onChange={handleCustomerChange}
              title="Select Customer"
              options={allCustomerNameList}
            />
          </Grid>
        </Grid>

        {/* Multiple Product Entries */}
        {salesEntries.map((entry, index) => renderSalesForm(entry, index))}

        <IconButton onClick={addSalesEntry} color="primary" className="mt-4">
          <CiSquarePlus />
        </IconButton>

        {/* Totals Section */}
        <Grid container spacing={3} className="mt-5">
          <Grid item xs={12} sm={4}>
            <InputWithTitle
              title="Total Amount"
              type="text"
              value={totalAmount.toFixed(2)}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputWithTitle
              title="Discount %"
              type="number"
              placeholder="Enter Discount"
              onChange={(value) => setTotalDiscount(value)}
              value={totalDiscount}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputWithTitle
              title="Final Amount"
              type="text"
              value={finalAmount.toFixed(2)}
              disabled
            />
          </Grid>
        </Grid>
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
