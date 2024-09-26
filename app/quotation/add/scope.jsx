import React, { useState } from "react";
import styles from "../../../styles/quotes.module.css";

const Scope = () => {
  // State to control the visibility of the scope section
  const [isScopeVisible, setIsScopeVisible] = useState(false); // By default, it's hidden

  const handleEnable = () => {
    setIsScopeVisible(true); // Show scope on enable
  };

  const handleDisable = () => {
    setIsScopeVisible(false); // Hide scope on disable
  };

  return (
    <div className="flex flex-col" style={{ marginTop: "2rem" }}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className={styles.scopeHead}>Scope of Work</div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between gap-4">
            <div style={{cursor:"pointer"}} className={styles.disableButton} onClick={handleDisable}>
              Disable
            </div>

            <div style={{cursor:"pointer"}} className={styles.enableButton} onClick={handleEnable}>
              Enable
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally render the Scope section */}
      {isScopeVisible && (
        <div className="mt-4">
          {/* Content of the Scope of Work */}
          <p>This is the scope of work. You can include any content here.</p>
        </div>
      )}
    </div>
  );
};

export default Scope;
