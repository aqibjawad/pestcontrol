import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import styles from "../styles/serviceReport.module.css";
import InputWithTitle from "./generic/InputWithTitle";
import GreenButton from "./generic/GreenButton";
import Dropdown from "./generic/dropDown";

import { product } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

const AddExtraChemicals = ({
  openChemicals,
  handleCloseChemicals,
  onAddExtraChemical,
}) => {
  const api = new APICall();

  const [extraChemicalData, setExtraChemicalData] = useState({
    product_id: "",
    name: "",
    dose: "",
    qty: "",
    price: "",
  });
  const [products, setProducts] = useState([]);

  const [productId, setSelectedProductId] = useState("");

  const [brands, setBrandList] = useState([]);

  const handleInputChange = (field, value) => {
    setExtraChemicalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const { product_id, dose, qty, price } = extraChemicalData;

    const isValid =
      product_id &&
      parseFloat(dose) > 0 &&
      parseFloat(qty) > 0 &&
      parseFloat(price) > 0;

    if (!isValid) {
      alert("Please fill all fields correctly before submitting.");
      return; // Prevent modal from closing
    }

    onAddExtraChemical(extraChemicalData);
    setExtraChemicalData({
      product_id: "",
      name: "",
      dose: "",
      qty: "",
      price: "",
    });
    handleCloseChemicals();
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

  // Transform products for dropdown
  const handleProductChange = (name, index) => {
    const selectedProduct = products[index];
    setExtraChemicalData((prev) => ({
      ...prev,
      product_id: selectedProduct.id,
      name: selectedProduct.product_name,
    }));
  };

  return (
    <Modal
      open={openChemicals}
      onClose={handleCloseChemicals}
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
            value={extraChemicalData.product_id}
            onChange={handleProductChange}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title="Dose"
            type="text"
            placeholder="Dose"
            value={extraChemicalData.dose}
            onChange={(value) => handleInputChange("dose", value)}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title="Quantity"
            type="text"
            placeholder="qty"
            value={extraChemicalData.qty}
            onChange={(value) => handleInputChange("qty", value)}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            title={"Price"}
            value={extraChemicalData.price}
            onChange={(value) => handleInputChange("price", value)}
          />
        </div>
        <div className="mt-5">
          <GreenButton title="Submit" onClick={handleSubmit} />
        </div>
      </Box>
    </Modal>
  );
};

export default AddExtraChemicals;
