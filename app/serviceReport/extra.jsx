"use client";

import React, { useState } from "react";
import styles from "../../styles/serviceReport.module.css";

import AddChemicals from "../../components/addChemicals"

const Extra = () => {
  
  const [openChemicals, setOpenChemicals] = useState(false);

  console.log("modal",openChemicals);
  

  const handleOpenChemicals = () => setOpenChemicals(true);
  const handleCloseChemicals = () => setOpenChemicals(false);

  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}> Chemical and material </div>
        </div>

        <div className="flex flex-col">
          <div onClick={handleOpenChemicals} className={styles.areaButton}>
            {" "}
            + Add Chemicals{" "}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> chemial and materialused </th>
              <th> Infestation </th>
              <th> Quantity </th>
              <th> Price </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> 01 </td>
              <td> Internal areas of restaurant </td>
              <td>High</td>
              <td>High</td>
              <td>High</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddChemicals
        openChemicals={openChemicals}
        handleCloseChemicals={handleCloseChemicals}
      />
    </div>
  );
};

export default Extra;
