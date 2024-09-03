import React from "react";
import styles from "../../styles/clientPdf.module.css";

const VisitRecords = () => {
  return (
      <div className={styles.recordMain}>
        <div className={styles.clientName}> Visit Records </div>

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

export default VisitRecords;
