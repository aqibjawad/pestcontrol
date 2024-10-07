import React from "react";

import styles from "../../styles/serviceReportsPdf.module.css"

const page =()=>{
    return(
        <div>
            <div className={styles.companyLogo}>
                <div className={styles.logo}>
                    <img src="/logo.jpeg" />
                </div>
            </div>
        </div>
    )
}

export default page;