import React from "react";
import styles from "../../styles/invoicePdf.module.css";

const ServiceProduct = () => {
  return (
    <div className={styles.tableContainerPdf}>
      <div className={styles.invoicePdf}> Service product </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th> Service Product </th>
            <th> No of Month </th>
            <th> Job Type </th>
            <th> Rate </th>
            <th> Sub Total </th>
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
  );
};

export default ServiceProduct;
