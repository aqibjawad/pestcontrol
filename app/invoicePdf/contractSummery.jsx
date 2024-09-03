import React from "react";
import styles from "../../styles/invoicePdf.module.css";

const ContractSummery = () => {
  return (
    <div style={{marginTop:"3rem"}} className={styles.tableContainerPdf}>
      <div className={styles.invoicePdfHead}> Contract Summery </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th> Sub Total </th>
            <th> Grand Total </th>
          </tr>
        </thead>
        <tbody>
          <tr> 
            <td> 00 </td>
            <td> Internal areas of restaurant </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContractSummery;
