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
}) => {
  const api = new APICall();

  const [chemicalData, setChemicalData] = useState({
    product_id: "",
    name: "",
    dose: 1,
    qty: "",
    remaining_qty: "",
  });
  const [availableStocks, setAvailableStocks] = useState([]);
  const [stockOptions, setStockOptions] = useState([]);

  const handleInputChange = (field, value) => {
    setChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validation check
    const isValid =
      chemicalData.product_id &&
      chemicalData.name &&
      parseFloat(chemicalData.dose) > 0 &&
      parseFloat(chemicalData.qty) > 0 &&
      parseFloat(chemicalData.qty) <= parseFloat(chemicalData.remaining_qty);

    if (!isValid) {
      alert("Please fill all fields correctly before submitting.");
      return; // Prevent modal from closing
    }

    // If valid, submit and reset
    onAddChemical(chemicalData);
    setChemicalData({
      product_id: "",
      name: "",
      dose: 1,
      qty: "",
      remaining_qty: "",
      price: 0,
    });
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

      setChemicalData((prev) => ({
        ...prev,
        product_id: selectedStock.product_id,
        name: productInfo?.product_name || "Unknown Product",
        remaining_qty: selectedStock.remaining_qty || "0.00",
      }));
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
              chemicalData.remaining_qty || "0.00"
            })`}
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
                parseFloat(chemicalData.remaining_qty)
            }
          />
        </div>
      </Box>
    </Modal>
  );
};

export default AddChemicals;
