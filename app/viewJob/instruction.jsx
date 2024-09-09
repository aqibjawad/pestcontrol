"use client";

import React from "react";

import styles from "../../styles/job.module.css";

import MultiInput from "../../components/generic/MultilineInput"

const Instruction =()=>{
    return(
        <div>
            <div className={styles.mainText}>
                Job instructions
            </div>

            <div>
                <MultiInput />
            </div>
        </div>
    )
}

export default Instruction