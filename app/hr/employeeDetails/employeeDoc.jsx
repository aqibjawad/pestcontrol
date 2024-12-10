import React from "react";
import styles from "../../../styles/personalDetails.module.css";

const EmployeeDoc = () => {
  return (
    <div>
      <div className={styles.personalContainer}>
        <div className={styles.personalHead}> Employee Documents </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Name </th>
                <th> Relation </th>
                <th> Contact </th>
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
        <div className={styles.personalHead}> Financial Information </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th> Basic Salary  </th>
                <th> Allowance </th>
                <th> Total Salary </th>
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

export default EmployeeDoc;
