import React from "react";

import "../index.css";
import styles from "../../../styles/quotes.module.css"

const ContractSummery = () => {
  return (
    <div
      style={{
        border: "1px solid black",
        marginTop:"2rem"
      }}
    >
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

      <div className="flex justify-between" style={{padding:"34px"}}>
        <div className="flex flex-col">
          <div className={styles.subTotal}>Subtotal</div>
          <div className="discount">discount:</div>
          <div className="vat">VAT</div>
          <div className="total">Grand Total</div>
        </div>

        <div className="flex flex-col">
          <div className="sub-total">Subtotal</div>
          <div>
            <div className="flex mt-4">
              <div className="discount-button flex flex-col">0</div>

              <div className="discount-perc flex flex-col">%</div>
            </div>
          </div>
          <div className="vat">VAT</div>
          <div className="total">Grand Total</div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummery;
