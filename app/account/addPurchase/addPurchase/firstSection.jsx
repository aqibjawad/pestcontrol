import React from "react";
import styles from "../../../../styles/loginStyles.module.css";

const FirstSection = () => {
  return (
    <div>
      <div className={styles.userFormContainer} style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
            {" "}
            Supplier{" "}
          </label>
          <input
            type="text"
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              padding: "12px 16px",
              width: "550px",
              height: "49px",
              boxSizing: "border-box",
            }}
            placeholder=" SAP "
          />
        </div>
      </div>

    </div>
  );
};

export default FirstSection;
