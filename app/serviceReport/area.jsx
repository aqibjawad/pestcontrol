import React from "react";
import styles from "../../styles/serviceReport.module.css";

const Area = () => {
  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}> Areas </div>
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
              <th> Inspected Areas </th>
              <th> Infestation level </th>
              <th> Manifested areas </th>
              <th> Report and follow up detail </th>
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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
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
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Rodents"
                    />
                    Rodents
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Insects"
                    />
                    Insects
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Termites"
                    />
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
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Rodents"
                    />
                    Rodents
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Insects"
                    />
                    Insects
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pestFound"
                      value="Termites"
                    />
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

export default Area;
