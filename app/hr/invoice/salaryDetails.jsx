import React from "react";
import styles from "../../../styles/invoicePdf.module.css";

const SalaryDetails = () => {
  return (
    <div className={styles.tableContainerPdf}>
      <div className={styles.invoicePdfHead}> Salary Details </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th> Sr. </th>
            <th> Employee Name </th>
            <th> Designation </th>
            <th> Attendence </th>
            <th> Comission </th>
            <th> Salary </th>
          </tr>
        </thead>
        <tbody>
          <tr> 
            <td> 01 </td>
            <td> Internal areas of restaurant </td>
            <td>High</td>
            <td>High</td>
            <td>High</td>
            <td>High</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalaryDetails;
