"use client";

import React, { useState, useEffect } from "react";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getAllSuppliers,
  product,
  purchaseOrder,
} from "@/networkUtil/Constants";

import { Grid, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

import APICall from "@/networkUtil/APICall";

import styles from "../../../styles/addPurchase.module.css";

import GreenButton from "@/components/generic/GreenButton";

import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [fetchingData, setFetchingData] = useState(false);

  const [allBrandsList, setAllBrandsList] = useState([]);
  const [suppliers, setBrandList] = useState([]);
  const [selectedBrandId, setSelectedSupplierId] = useState("");

  const [allProductsList, setAllProductsList] = useState([]);
  const [productsLists, setProductsList] = useState([]);

  // State to manage rows
  const [rows, setRows] = useState([
    { id: Date.now(), product_id: "", quantity: "", price: "", vat_per: "" },
  ]);

  const [order_date, setOrderDate] = useState("");
  const [delivery_date, setDeliveryDate] = useState("");
  const [private_note, setPrivateNote] = useState("");
  const [invoice_no, setInvoiceNo] = useState("");
  const [dis_per, setDisPer] = useState("");
  const [purchase_invoice, setPurchaseInvoice] = useState("");

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllSupplier();
    getAllProducts();
  }, []);

  const getAllSupplier = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllSuppliers}`);
      setAllBrandsList(response.data);
      const brandNames = response.data.map((item) => item.supplier_name);
      setBrandList(brandNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands. Please try again.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const getAllProducts = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}`);
      setAllProductsList(response.data);
      const productsNames = response.data.map((item) => item.product_name);
      setProductsList(productsNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands. Please try again.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleInvoicePictureSelect = (file) => {
    console.log("Selected Product Picture:", file);
    setPurchaseInvoice(file);
  };

  const handleBSupplierChange = (supplier_name, index) => {
    const idAtIndex = allBrandsList[index].id;
    setSelectedSupplierId(idAtIndex);
  };

  const handleProductsChange = (product_id, index) => {
    const newRows = [...rows];
    newRows[index].product_id = product_id;
    setRows(newRows);
  };

  // const handleInputChange = (value, index, field) => {
  //   const newRows = [...rows];
  //   newRows[index][field] = value;
  //   setRows(newRows);
  // };

  // const handleAddRow = () => {
  //   setRows([
  //     ...rows,
  //     { id: Date.now(), product_id: "", quantity: "", price: "", vat_per: "" },
  //   ]);
  // };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoadingSubmit(true);

    const obj = {
      supplier_id: selectedBrandId,
      order_date,
      delivery_date,
      private_note,
      dis_per: "0",
      invoice_no,
      purchase_invoice,
      product_id: rows.map((row) => row.product_id),
      quantity: rows.map((row) => row.quantity),
      price: rows.map((row) => row.price),
      vat_per: rows.map((row) => row.vat_per),
    };

    const response = await api.postFormDataWithToken(
      `${purchaseOrder}/create`,
      obj
    );

    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Purchase added successfully.",
      });
      router.push("/account/purchaseOrders");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${response.error.message}`,
      });
    }
    // try {
    //   if (response.status === 200) {
    //   } else {
    //   }
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    // }
  };

  const calculateTotals = () => {
    let subTotal = 0;
    let totalVat = 0;

    rows.forEach((row) => {
      const rowSubTotal = row.quantity * row.price;
      subTotal += rowSubTotal;
      totalVat += rowSubTotal * (row.vat_per / 100);
    });

    const discountAmount = subTotal * (dis_per / 100);
    const grandTotal = subTotal + totalVat - discountAmount;

    return {
      subTotal: subTotal.toFixed(2),
      totalVat: totalVat.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  };
  const { subTotal, totalVat, grandTotal } = calculateTotals();

  const calculateRowTotals = (quantity, price, vat) => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    const vatPercentage = parseFloat(vat) || 0;

    const subTotal = qty * prc;
    const vatAmount = subTotal * (vatPercentage / 100);
    const totalAmount = subTotal + vatAmount;

    return {
      subTotal: subTotal.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const handleInputChange = (value, index, field) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    // Calculate subtotal and total amount whenever quantity, price or VAT changes
    if (field === "quantity" || field === "price" || field === "vat_per") {
      const { subTotal, totalAmount } = calculateRowTotals(
        newRows[index].quantity,
        newRows[index].price,
        newRows[index].vat_per
      );
      newRows[index].subTotal = subTotal;
      newRows[index].totalAmount = totalAmount;
    }

    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        product_id: "",
        quantity: "",
        price: "",
        vat_per: "",
        subTotal: "0.00",
        totalAmount: "0.00",
      },
    ]);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={12} xs={12} sm={6} md={4}>
          <UploadImagePlaceholder
            title={"Invoice Image"}
            onFileSelect={handleInvoicePictureSelect}
          />
        </Grid>
        <Grid className="mt-5" item lg={4} xs={12} sm={6} md={4}>
          <Dropdown
            onChange={handleBSupplierChange}
            options={suppliers}
            title={"Company"}
          />
        </Grid>

        <Grid className="mt-5" item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle
            title={"Order date"}
            type="date"
            value={order_date}
            onChange={setOrderDate}
          />
        </Grid>
        <Grid className="mt-5" item lg={4} xs={12} sm={6} md={4}>
          <InputWithTitle
            title={"Delivery date"}
            type="date"
            value={delivery_date}
            onChange={setDeliveryDate}
          />
        </Grid>

        <Grid className="mt-5" item lg={10} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Private Notes"} onChange={setPrivateNote} />
        </Grid>

        <Grid className="mt-5" item lg={2} xs={12} sm={6} md={4}>
          <InputWithTitle title={"Invoice Number"} onChange={setInvoiceNo} />
        </Grid>
      </Grid>

      {/* Dynamic Rows */}
      <div className={styles.itemGrid}>
        {rows.map((row, index) => (
          <Grid container spacing={2} key={row.id} className="mt-5">
            <Grid item lg={3} xs={12} sm={6} md={4}>
              <Dropdown
                onChange={(value, dropdownIndex) =>
                  handleProductsChange(allProductsList[dropdownIndex].id, index)
                }
                options={productsLists}
                title={"Items"}
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Quantity"}
                value={row.quantity}
                onChange={(value) =>
                  handleInputChange(value, index, "quantity")
                }
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Price"}
                value={row.price}
                onChange={(value) => handleInputChange(value, index, "price")}
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Sub Total"}
                value={row.rowSubTotal} // Link this to the subTotal value for the row
                readOnly
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Vat"}
                value={row.vat_per}
                onChange={(value) => handleInputChange(value, index, "vat_per")}
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <InputWithTitle
                title={"Total Amount"}
                value={row.totalAmount} // Link this to the totalAmount value for the row
                readOnly
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <DeleteIcon
                style={{ marginTop: "3rem", color: "red", cursor: "pointer" }}
                onClick={() => deleteRow(row.id)}
              />
            </Grid>
          </Grid>
        ))}

        <div className={styles.btn}>
          <div className={styles.addBtn} onClick={handleAddRow}>
            Add
          </div>
        </div>

        {/* Totals Section */}
        <Grid container spacing={2} className="mt-5">
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subHead}>Sub Total</div>
          </Grid>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subAmount}>{subTotal}</div>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="mt-5">
          <Grid item lg={9} xs={12} sm={6} md={4}>
            <div className={styles.subHead}>Discount</div>
          </Grid>
          <Grid item lg={3} xs={12} sm={6} md={4}>
            <div style={{ width: "90%" }}>
              <InputWithTitle
                placeholder={"discount"}
                onChange={(value) => setDisPer(parseFloat(value) || 0)}
              />
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="mt-5">
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subHead}>Vat %</div>
          </Grid>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subAmount}>{totalVat}</div>
          </Grid>
        </Grid>

        <Grid container spacing={2} className="mt-5">
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subHead}>Grand Total</div>
          </Grid>
          <Grid item lg={6} xs={12} sm={6} md={4}>
            <div className={styles.subAmount}>{grandTotal}</div>
          </Grid>
        </Grid>
      </div>

      <div className="mt-20">
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
