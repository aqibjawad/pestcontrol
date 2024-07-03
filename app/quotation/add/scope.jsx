import React from "react";
import styles from "../../../styles/quotes.module.css"

const Scope = () => {
  return (
    <div className="flex justify-between" style={{marginTop:"2rem"}}>  
      <div className="flex flex-col">
        <div className={styles.scopeHead}>
          Scope of Work
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between">
            <div className={styles.disableButton}>
                Disable
            </div>

            <div className={styles.enableButton}>
                Enable
            </div>
        </div>
      </div>
    </div>
  );
};

export default Scope;
