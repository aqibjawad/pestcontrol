import React from "react";
import styles from "../../styles/viewQuote.module.css";

const ContractSummery = () => {
  return (
    <div style={{ border: "1px solid #EAECF0", marginTop: "2rem" }}>
      <div
        className="mt-5"
        style={{
          padding: "34px",
          fontWeight: "600",
          fontSize: "20px",
        }}
      >
        Contract Summery
      </div>

      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.contractHead}>Subtotal</div>
          <div className={styles.contractHead}>discount:</div>
          <div className={styles.contractHead}>Tax Summeries:</div>

          <div className={styles.contractHead}>VAT</div>
          <div className={styles.contractHead}>Grand Total</div>
        </div>

        <div className="flex flex-col">
          <div className={styles.contractValue}>Subtotal</div>
          <div className={styles.contractValue}>VAT</div>
          <div className={styles.contractValue}>Grand Total</div>
          <div className={styles.contractValue}>Grand Total</div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummery;
