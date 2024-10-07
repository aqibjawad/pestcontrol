"use client";

import React from "react";
import styles from "../../styles/serviceReport.module.css"

const TypeVisit = ({ formData, setFormData }) => {
    const handleVisitTypeChange = (event) => {
        const { value, checked } = event.target;
        
        setFormData((prevData) => ({
            ...prevData,
            type_of_visit: value
        }));
    };

    return (
        <div>
            <div style={{textAlign:"center"}} className={styles.visitHead}>
                Type Of Visit
            </div>
            <div className={styles.checkboxesContainer}>
                <label className={styles.checkboxLabel}>
                    <input 
                        type="checkbox" 
                        name="visitType" 
                        value="Consultation"
                        checked={formData.type_of_visit === "Consultation"}
                        onChange={handleVisitTypeChange}
                    />
                    Consultation
                </label>
                <label className={styles.checkboxLabel}>
                    <input 
                        type="checkbox" 
                        name="visitType" 
                        value="Follow-up"
                        checked={formData.type_of_visit === "Follow-up"}
                        onChange={handleVisitTypeChange}
                    />
                    Follow-up
                </label>
                <label className={styles.checkboxLabel}>
                    <input 
                        type="checkbox" 
                        name="visitType" 
                        value="Emergency"
                        checked={formData.type_of_visit === "Emergency"}
                        onChange={handleVisitTypeChange}
                    />
                    Emergency
                </label>
            </div>
        </div>
    );
}

export default TypeVisit;