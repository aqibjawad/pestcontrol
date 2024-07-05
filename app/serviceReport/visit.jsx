import React from "react";
import styles from "../../styles/serviceReport.module.css"

const TypeVisit = () => {
    return (
        <div>
            <div className={styles.visitHead}>
                Type Of Visit
            </div>
            <div className={styles.checkboxesContainer}>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="visitType" value="Consultation" />
                    Consultation
                </label>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="visitType" value="Follow-up" />
                    Follow-up
                </label>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="visitType" value="Emergency" />
                    Emergency
                </label>
            </div>
        </div>
    );
}

export default TypeVisit;
