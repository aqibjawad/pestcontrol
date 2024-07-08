import React from "react";
import styles from "../../styles/clientPdf.module.css";

const ClientRecords = () => {
  return (
    <div>
      <div className={styles.clientName}>Client Details</div>
      <div className={styles.tableContainerPdf}>
        <table className={styles.tablePdf}>
          <thead>
            <tr>
              <th> Type </th>
              <th> Description </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> 01 </td>
              <td> Internal areas of restaurant </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientRecords;
