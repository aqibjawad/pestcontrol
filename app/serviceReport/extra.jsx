"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";
import AddExtraChemicals from "../../components/addExtraChemicals";

const Extra = ({ formData, setFormData }) => {
  const [openChemicals, setOpenChemicals] = useState(false);
  const [used_products, setExtraChemicals] = useState([]);

  const handleOpenChemicals = () => setOpenChemicals(true);
  const handleCloseChemicals = () => setOpenChemicals(false);

  const handleAddExtraChemical = (newChemical) => {
    // First, update the local state
    const updatedChemicals = [
      ...used_products,
      { ...newChemical, id: Date.now() },
    ];
    setExtraChemicals(updatedChemicals);

    // Then, update the parent formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: [
        ...(prevFormData.used_products || []),
        { ...newChemical, id: Date.now() },
      ],
    }));
  };

  // Initialize local state with existing chemicals when component mounts
  useEffect(() => {
    if (formData.used_products && Array.isArray(formData.used_products)) {
      setExtraChemicals(formData.used_products);
    }
  }, [formData.used_products]);

  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}>Extra Chemical and material</div>
        </div>

        <div className="flex flex-col">
          <div onClick={handleOpenChemicals} className={styles.areaButton}>
            + Add Extra Chemicals
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Chemical and Material Used</th>
              <th>Dose</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {used_products.map((chemical, index) => (
              <tr key={chemical.id}>
                <td>{index + 1}</td>
                <td>{chemical.name}</td>
                <td>{chemical.dose}</td>
                <td>{chemical.quantity}</td>
                <td>{chemical.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddExtraChemicals
        openChemicals={openChemicals}
        handleCloseChemicals={handleCloseChemicals}
        onAddExtraChemical={handleAddExtraChemical}
      />
    </div>
  );
};

export default Extra;
