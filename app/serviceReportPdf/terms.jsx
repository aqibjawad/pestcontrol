import React from "react";

import styles from "../../styles/viewQuote.module.css";

const Terms = ({ serviceReportList }) => {
  return (
    <div>
      <div className={styles.termsHead}>Terms & conditions</div>

      <div className={styles.termDescrp}>
        {serviceReportList?.recommendations_and_remarks}
      </div>
    </div>
  );
};

export default Terms;
