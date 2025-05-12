"use client";

import React, { useState } from "react";
import styles from "../../styles/serviceReport.module.css";
import AddExtraChemicals from "../../components/addExtraChemicals";

const Extra = ({ formData, setFormData }) => {
  const [openChemicals, setOpenChemicals] = useState(false);
  const [extraChemicals, setExtraChemicals] = useState([]);

  const handleOpenChemicals = () => setOpenChemicals(true);
  const handleCloseChemicals = () => setOpenChemicals(false);

  const handleAddExtraChemical = (newChemical) => {
    // Update the local state for extra chemicals
    const updatedExtraChemicals = [
      ...extraChemicals,
      { ...newChemical, id: Date.now() },
    ];
    setExtraChemicals(updatedExtraChemicals);

    // Update the parent formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      used_products: [
        ...(prevFormData.used_products || []),
        { ...newChemical, id: Date.now(), is_extra: 1 },
      ],
    }));
  };

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
            {extraChemicals.map((chemical, index) => (
              <tr key={chemical.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{chemical.name}</td>
                <td style={{ textAlign: "center" }}>{chemical.dose}</td>
                <td style={{ textAlign: "center" }}>{chemical.quantity}</td>
                <td style={{ textAlign: "center" }}>{chemical.price}</td>
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
