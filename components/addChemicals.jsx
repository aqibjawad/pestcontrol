import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "./generic/GreenButton";
import Dropdown from "../components/generic/Dropdown";

import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const AddChemicals = ({
  openUseChemicals,
  handleCloseUseChemicals,
  onAddChemical,
}) => {
  const api = new APICall();

  const [chemicalData, setChemicalData] = useState({
    product_id: "",
    name: "",
    dose: 1,
    qty: "",
    remaining_qty: "",
  });
  const [products, setProducts] = useState([]);
  const [brands, setBrandList] = useState([]);

  const handleInputChange = (field, value) => {
    setChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onAddChemical(chemicalData);
    setChemicalData({
      product_id: "",
      name: "",
      dose: "",
      qty: "",
      remaining_qty: "",
      price: 0,
    });
    handleCloseUseChemicals();
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await api.getDataWithToken(product);
      setProducts(response.data);
      const brandNames = response.data.map((item) => item.product_name);
      setBrandList(brandNames);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductChange = (name, index) => {
    const selectedProduct = products[index];
    setChemicalData((prev) => ({
      ...prev,
      product_id: selectedProduct.id,
      name: selectedProduct.product_name,
      remaining_qty: selectedProduct.stocks[0]?.remaining_qty || "N/A",
    }));
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
        <div className={styles.serviceHead}>Chemicals and material</div>
        <div className={styles.serviceDescrp}>
          Thank you for choosing us to meet your needs. We look forward to
          serving you with excellence
        </div>
        <div className="mt-5">
          <Dropdown
            title="Chemicals And Materials"
            options={brands}
            value={chemicalData.product_id}
            onChange={handleProductChange}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title={`Quantity (Available: ${chemicalData.remaining_qty})`}
            type="text"
            placeholder="qty"
            value={chemicalData.qty}
            onChange={(value) => handleInputChange("qty", value)}
          />
        </div>
        <div className="mt-5">
          <GreenButton
            title="Submit"
            onClick={handleSubmit}
            disabled={!chemicalData.qty || chemicalData.qty <= 0} // Disable button if qty <= 0
          />
        </div>
      </Box>
    </Modal>
  );
};

export default AddChemicals;
