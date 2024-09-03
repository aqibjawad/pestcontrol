import React from "react";
import styles from "../../styles/serviceReportPdf.module.css";

const Chemical = () => {
  return (
    <div className={styles.chemicalMain}>
      <div className={styles.tableContainerPdf}>
        <div className={styles.areaHeadPdf}> Chemical and Material </div>

        <table className={styles.tablePdf}>
          <thead>
            <tr>
              <th> chemial and materialused </th>
              <th> Dose </th>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chemical;
