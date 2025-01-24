"use client";

import React, { useState, useRef } from "react";
import { Modal, Box } from "@mui/material";

import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import GreenButton from "@/components/generic/GreenButton";

import CircularProgress from "@mui/material/CircularProgress";
import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import Swal from "sweetalert2";

const AddStockModal = ({ open, onClose, products }) => {
  const api = new APICall();

  const [add_stock_qty, setStockQty] = useState("");

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleStock = (name, value) => {
    setStockQty(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      product_id: products.id,
      add_stock_qty,
    };

    const response = await api.postFormDataWithToken(
      `${product}/stock/add`,
      obj
    );

    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${response.error.message}`,
      });
    }
    setLoadingSubmit(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <InputWithTitle3
          title={"Add Stock Quantity"}
          type={"text"}
          placeholder={"Stock Quantity"}
          value={add_stock_qty}
          onChange={handleStock}
        />

        <div className="mt-5">
          <GreenButton
            onClick={handleSubmit}
            title={
              loadingSubmit ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Submit"
              )
            }
            disabled={loadingSubmit}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default AddStockModal;
