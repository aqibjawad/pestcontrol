import React from "react";
import styles from "../../../styles/personalDetails.module.css";

const Identification = () => {
  return (
    <div>
      <div className={styles.personalContainer}>
        <div className={styles.personalHead}>Personal Image</div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>EID No</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Passport No</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test@gmail.com</td>
                <td>123456</td>
                <td>123456</td>
                <td>123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.personalContainer}>
        <div className={styles.personalHead}> Passport </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>EID No</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Passport No</th>
                <th>Profession</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test@gmail.com</td>
                <td>123456</td>
                <td>123456</td>
                <td>123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Identification;
