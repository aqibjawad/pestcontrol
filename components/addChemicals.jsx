import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "./generic/GreenButton";
import Dropdown from "./generic/dropDown";

import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const AddChemicals = ({
  openUseChemicals,
  handleCloseUseChemicals,
  onAddChemical,
  employeeStock,
  employeeList,
}) => {
  const api = new APICall();

  console.log(employeeList);

  const [chemicalData, setChemicalData] = useState({
    product_id: "",
    name: "",
    dose: 1,
    qty: "",
    remaining_qty: "",
    adjusted_qty: "", // Added new field to store adjusted quantity
    unit: "", // Added field to store the unit of measurement
  });
  const [availableStocks, setAvailableStocks] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error message when user changes input
    setErrorMessage("");
  };

  const handleSubmit = () => {
    // Check if quantity exceeds adjusted available quantity
    if (parseFloat(chemicalData.qty) > parseFloat(chemicalData.adjusted_qty)) {
      setErrorMessage(
        "Quantity exceeds available stock. Please enter a valid quantity."
      );
      return;
    }

    // Other validation checks
    if (!chemicalData.product_id || !chemicalData.name) {
      setErrorMessage("Please select a product.");
      return;
    }

    if (!chemicalData.dose || parseFloat(chemicalData.dose) <= 0) {
      setErrorMessage("Please enter a valid dose.");
      return;
    }

    if (!chemicalData.qty || parseFloat(chemicalData.qty) <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }

    // If valid, submit and reset
    onAddChemical(chemicalData);
    setChemicalData({
      product_id: "",
      name: "",
      dose: 1,
      qty: "",
      remaining_qty: "",
      adjusted_qty: "",
      unit: "",
      price: 0,
    });
    setErrorMessage("");
    handleCloseUseChemicals();
  };

  useEffect(() => {
    // Process employee stock data when it's available
    if (employeeStock?.stocks && employeeStock.stocks.length > 0) {
      const stocks = employeeStock.stocks.filter(
        (item) => parseFloat(item.remaining_qty) > 0
      );

      setAvailableStocks(stocks);

      // Create dropdown options from the stock items
      const options = stocks.map(
        (item) => item.product?.product_name || "Unknown Product"
      );

      setStockOptions(options);
    }
  }, [employeeStock]);

  const handleProductChange = (name, index) => {
    if (index >= 0 && index < availableStocks.length) {
      const selectedStock = availableStocks[index];
      const productInfo = selectedStock.product;

      // Calculate adjusted quantity by multiplying with per_item_qty
      const rawRemainingQty = selectedStock.remaining_qty || "0.00";
      const perItemQty = productInfo?.per_item_qty || 1;
      const adjustedQty = (
        parseFloat(rawRemainingQty) * parseFloat(perItemQty)
      ).toFixed(2);

      setChemicalData((prev) => ({
        ...prev,
        product_id: selectedStock.product_id,
        name: productInfo?.product_name || "Unknown Product",
        remaining_qty: rawRemainingQty,
        adjusted_qty: adjustedQty, // Store the adjusted quantity
        unit: productInfo?.unit || "", // Store the unit of measurement
      }));

      // Clear error message when product changes
      setErrorMessage("");
    }
  };

  return (
    <Modal
      open={openUseChemicals}
      onClose={handleCloseUseChemicals}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <div className={styles.serviceHead}>Chemicals and Materials</div>
        <div className={styles.serviceDescrp}>
          Thank you for choosing us to meet your needs. We look forward to
          serving you with excellence
        </div>

        {errorMessage && (
          <div
            style={{
              color: "white",
              backgroundColor: "#5a2c1b",
              padding: "15px",
              borderRadius: "5px",
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{errorMessage}</div>
            <button
              onClick={() => setErrorMessage("")}
              style={{
                backgroundColor: "#e9be77",
                color: "#5a2c1b",
                border: "none",
                borderRadius: "5px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        )}

        <div className="mt-5">
          <Dropdown
            title="Chemicals And Materials"
            options={stockOptions}
            value={chemicalData.name}
            onChange={handleProductChange}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title="Dose"
            type="number"
            placeholder="Enter dose"
            value={chemicalData.dose}
            onChange={(value) => handleInputChange("dose", value)}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title={`Quantity (Available: ${
              chemicalData.adjusted_qty || "0.00"
            } ${chemicalData.unit})`}
            type="text"
            placeholder="Enter quantity"
            value={chemicalData.qty}
            onChange={(value) => handleInputChange("qty", value)}
          />
        </div>
        <div className="mt-5">
          <GreenButton
            title="Submit"
            onClick={handleSubmit}
            disabled={
              !chemicalData.qty ||
              parseFloat(chemicalData.qty) <= 0 ||
              !chemicalData.dose ||
              parseFloat(chemicalData.dose) <= 0 ||
              !chemicalData.product_id ||
              parseFloat(chemicalData.qty) >
                parseFloat(chemicalData.adjusted_qty)
            }
          />
        </div>
      </Box>
    </Modal>
  );
};

export default AddChemicals;
