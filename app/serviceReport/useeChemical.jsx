import React from "react";

import styles from "../../styles/serviceReport.module.css";

const UseChemicals = () => {
  return (
    <div>
      <div className={styles.chemHead}>Use Chemicals</div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th> Sr. </th>
              <th> chemial and materialused </th>
              <th> High </th>
              <th> Medium </th>
              <th> Low </th>
            </tr>
          </thead>
          <tbody>
            
            <tr>
                <td>
                    01
                </td>

                <td>
                   Delta super
                </td>
              <td>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" name="pestFound" value="Rodents" />
                  Rodents
                </label>
              </td>
              <td>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="treatmentType"
                    value="Chemical"
                  />
                  Chemical
                </label>
              </td>

              <td>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="treatmentType"
                    value="Chemical"
                  />
                  Chemical
                </label>
              </td>

            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UseChemicals;
