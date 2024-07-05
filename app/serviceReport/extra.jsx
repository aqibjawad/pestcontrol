import React from "react";
import styles from "../../styles/serviceReport.module.css"

const Extra = () => {
  return (
    <div>

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}> Extra </div>
        </div>

        <div className="flex flex-col">
          <div className={styles.areaButton}> + Area </div>
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
    </div>
  );
};

export default Extra;
