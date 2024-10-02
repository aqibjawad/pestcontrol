import React from "react";
import styles from "../../styles/invoicePdf.module.css";

const Terms = ({quote}) => {

  return (
    <div style={{marginLeft:"2rem", marginRight:"2rem"}}>
      <div className={styles.termsPdf}>
        Terms and Conditions
      </div>

      <div className={styles.termsData}>
          {quote?.term_and_condition?.text}
      </div>
    </div>
  );
};

export default Terms; 
