import React from "react";

import styles from "../../../styles/personalDetails.module.css";

const PersonalDetails = () => {
  return (
    <div className={styles.personalDetailsContainer}>
      <div className={styles.imageContainer}>
        <img className={styles.personalImage} src="/person.png" alt="Person" />
      </div>
      <div className={styles.personalName}>John black</div>

      <div className={styles.personalContainer}>
        <div className={styles.personalHead}>Personal Image</div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>test@gmail.com</td>
                <td>123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
