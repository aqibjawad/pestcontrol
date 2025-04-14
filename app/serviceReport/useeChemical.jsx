"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";
import AddChemicals from "../../components/addChemicals";

const UseChemicals = ({ formData, setFormData }) => {
  const [openUseChemicals, setOpenUseChemicals] = useState(false);
  const [used_products, setChemicals] = useState([]);

  const handleOpenUseChemicals = () => setOpenUseChemicals(true);
  const handleCloseUseChemicals = () => setOpenUseChemicals(false);

  const handleAddChemical = (newChemical) => {
    // Add is_extra: 0 to the new chemical
    const chemicalWithExtra = {
      ...newChemical,
      id: Date.now(),
      is_extra: 0,
      price: 0,
    }; 

    const updatedChemicals = [...used_products, chemicalWithExtra];
    setChemicals(updatedChemicals);

    // Update parent formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: updatedChemicals,
    }));
  };

  // Initialize formData with existing chemicals when component mounts
  useEffect(() => {
    if (formData.used_products) {
      // Ensure all existing chemicals have is_extra: 0
      const chemicalsWithExtra = formData.used_products.map((chemical) => ({
        ...chemical,
        is_extra: 0,
        price: 0,
      }));
      setChemicals(chemicalsWithExtra);
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}>Chemical and material</div>
        </div>
        <div className="flex flex-col">
          <div onClick={handleOpenUseChemicals} className={styles.areaButton}>
            + Add Chemicals
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
            </tr>
          </thead>
          <tbody>
            {used_products.map((chemical, index) => (
              <tr key={chemical.id}>
                <td style={{textAlign:"center"}}>{index + 1}</td>
                <td>{chemical.name}</td>
                <td style={{textAlign:"center"}}>{chemical.dose}</td>
                <td style={{textAlign:"center"}}>{chemical.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddChemicals
        openUseChemicals={openUseChemicals}
        handleCloseUseChemicals={handleCloseUseChemicals}
        onAddChemical={handleAddChemical}
      />
    </div>
  );
};

export default UseChemicals;
