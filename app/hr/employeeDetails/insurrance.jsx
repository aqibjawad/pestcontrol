import React from "react";
import styles from "../../../styles/personalDetails.module.css";

const Insurance = () => {
  return (
    <div>
      <div className={styles.personalContainer}>
        <div className={styles.personalHead}> Passport </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Health Insurrance</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test@gmail.com</td>
                <td>123456</td>
                <td>123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.personalContainer}>
        <div className={styles.personalHead}> Unemployment Insurance </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Unemployment Insurance status</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test@gmail.com</td>
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

export default Insurance;
