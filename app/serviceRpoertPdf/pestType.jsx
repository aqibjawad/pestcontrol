import React from "react";
import styles from "../../styles/serviceReportPdf.module.css";

const PestType = () => {
  return (
    <div>
      <div className={styles.tableContainerPdf}>
        <div className={styles.areaHeadPdf}> Pest Type </div>
        <table className={styles.tablePdf}>
          <thead>
            <tr>
              <th> Pest Found </th>
              <th> Type of Treatment </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.checkboxesContainer}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Rodents" />
                    Rodents
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Insects" />
                    Insects
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Termites" />
                    Termites
                  </label>
                </div>
              </td>
              <td>
                <div className={styles.checkboxesContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Chemical"
                    />
                    Chemical
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Non-Chemical"
                    />
                    Non-Chemical
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Integrated"
                    />
                    Integrated
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.checkboxesContainer}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Rodents" />
                    Rodents
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Insects" />
                    Insects
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="pestFound" value="Termites" />
                    Termites
                  </label>
                </div>
              </td>
              <td>
                <div className={styles.checkboxesContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Chemical"
                    />
                    Chemical
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Non-Chemical"
                    />
                    Non-Chemical
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="treatmentType"
                      value="Integrated"
                    />
                    Integrated
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PestType;
