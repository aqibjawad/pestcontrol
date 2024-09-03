import React from "react";
import styles from "../../styles/accountStatment.module.css"

const StatmentAccount = () => {
  return (
    <div style={{ marginTop: "3rem" }} className={styles.tableContainerPdf}>
      <div className={styles.accountHead}> Statement of Accounts </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th> Invoice Ref </th>
            <th> Invoice Date </th>
            <th> Invoice Amount </th>
            <th> Allocated Amount </th>
            <th> Pending Dues </th>
            <th> Recieved </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 00 </td>
            <td> Internal areas of restaurant </td>
            <td> Internal areas of restaurant </td>
            <td> Internal areas of restaurant </td>
            <td> Internal areas of restaurant </td>
            <td> Internal areas of restaurant </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatmentAccount;
