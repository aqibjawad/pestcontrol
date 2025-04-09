"use client";

import React, { useState, useEffect } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import Dropdown from "@/components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";

import {
  getAllSuppliers,
  product,
  purchaeOrder,
} from "@/networkUtil/Constants";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import APICall from "@/networkUtil/APICall";
import GreenButton from "@/components/generic/GreenButton";
import { MdAdd, MdDelete } from "react-icons/md";

const Page = () => {
  const api = new APICall();

  const [fetchingData, setFetchingData] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [rows, setRows] = useState([
    {
      supplier_id: "",
      product_id: "",
      vat_per: "",
      qty: "",
      price: "",
      total: 0,
    },
  ]);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([getAllSupplier(), getAllProducts()]);
    };
    fetchInitialData();
  }, []);

  const getAllSupplier = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllSuppliers}`);
      setAllSuppliers(response.data);
      const supplierNames = response.data.map((item) => item.company_name);
      setSuppliers(supplierNames);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch suppliers. Please try again.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const getAllProducts = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${product}`);
      setAllProducts(response.data);
      setProducts(response.data.map((item) => item.product_name));
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch products.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const calculateTotal = (qty, price, vatPer) => {
    const baseTotal = parseFloat(qty || 0) * parseFloat(price || 0);
    const vatAmount = baseTotal * (parseFloat(vatPer || 0) / 100);
    return baseTotal + vatAmount;
  };

  const handleInputChange = (value, index, field) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    // Recalculate total when qty, price, or vat_per changes
    if (field === "qty" || field === "price" || field === "vat_per") {
      newRows[index].total = calculateTotal(
        field === "qty" ? value : newRows[index].qty,
        field === "price" ? value : newRows[index].price,
        field === "vat_per" ? value : newRows[index].vat_per
      );
    }

    setRows(newRows);
  };

  const handleSupplierChange = (supplierName, index) => {
    const selectedSupplier = allSuppliers.find(
      (supplier) => supplier.company_name === supplierName
    );
    const newRows = [...rows];
    newRows[index].supplier_id = selectedSupplier ? selectedSupplier.id : "";
    setRows(newRows);
  };

  const handleProductChange = (productName, index) => {
    const selectedProduct = allProducts.find(
      (product) => product.product_name === productName
    );
    const newRows = [...rows];
    newRows[index].product_id = selectedProduct ? selectedProduct.id : "";
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        supplier_id: "",
        product_id: "",
        vat_per: "",
        qty: "",
        price: "",
        total: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    // Validate that all required fields are filled
    const isValid = rows.every(
      (row) =>
        row.supplier_id && row.product_id && row.vat_per && row.qty && row.price
    );

    if (!isValid) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields for each row.",
      });
      setLoadingSubmit(false);
      return;
    }

    const obj = {
      supplier_id: rows.map((row) => row.supplier_id).join(","),
      product_id: rows.map((row) => row.product_id).join(","),
      qty: rows.map((row) => row.qty).join(","),
      price: rows.map((row) => row.price).join(","),
      vat_per: rows.map((row) => row.vat_per).join(","),
    };

    try {
      const response = await api.postFormDataWithToken(
        `${purchaeOrder}/create`,
        obj
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Purchase order added successfully.",
        });
        // router.push("/viewPurchase");
        setRows([
          {
            supplier_id: "",
            product_id: "",
            vat_per: "",
            qty: "",
            price: "",
            total: 0,
          },
        ]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit purchase order. Please try again.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="pageTitle">Add Purchase Order</div>
      <Grid container spacing={2} padding={2}>
        {rows.map((row, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            sx={{ marginBottom: 2, alignItems: "center" }}
          >
            <Grid item lg={3} xs={12} sm={6} md={4}>
              <Dropdown
                onChange={(supplierName) =>
                  handleSupplierChange(supplierName, index)
                }
                options={suppliers}
                title="Company"
                value={
                  allSuppliers.find((s) => s.id === row.supplier_id)
                    ?.company_name || ""
                }
              />
            </Grid>

            <Grid item lg={3} xs={12} sm={6} md={4}>
              <Dropdown
                onChange={(productName) =>
                  handleProductChange(productName, index)
                }
                options={products}
                title="Products"
                value={
                  allProducts.find((p) => p.id === row.product_id)
                    ?.product_name || ""
                }
              />
            </Grid>

            <Grid item lg={1} xs={12} sm={6} md={4}>
              <InputWithTitle
                title="VAT %"
                type="number"
                value={row.vat_per}
                onChange={(value) => handleInputChange(value, index, "vat_per")}
              />
            </Grid>
            <Grid item lg={1} xs={12} sm={6} md={4}>
              <InputWithTitle
                title="Quantity"
                type="number"
                value={row.qty}
                onChange={(value) => handleInputChange(value, index, "qty")}
              />
            </Grid>

            <Grid item lg={1} xs={12} sm={6} md={4}>
              <InputWithTitle
                title="Price"
                type="number"
                value={row.price}
                onChange={(value) => handleInputChange(value, index, "price")}
              />
            </Grid>

            <Grid item lg={2} xs={12} sm={6} md={4}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Total: {row.total ? row.total.toFixed(2) : "0.00"}
              </Typography>
            </Grid>

            <Grid
              item
              lg={1}
              xs={12}
              sm={6}
              md={3}
              display="flex"
              alignItems="center"
            >
              <IconButton
                onClick={() => removeRow(index)}
                color="error"
                disabled={rows.length <= 1}
              >
                <MdDelete />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <IconButton onClick={addRow} color="primary">
            <MdAdd />
          </IconButton>
        </Grid>
      </Grid>

      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <GreenButton
            title="Submit"
            onClick={handleSubmit}
            loading={loadingSubmit}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
