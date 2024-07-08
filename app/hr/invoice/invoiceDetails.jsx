import React from "react";
import styles from "../../../styles/serviceReport.module.css";

const InvoiceDetails = () => {
  return (
    <>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
            <div style={{fontWeight:"700", fontSize:"30px", color:"#32A92E"}}>
                Invoice Details
            </div>
          <div className="flex flex-row">
            <div className={styles.mainHead}> Contact Person: </div>
            <div className={styles.mainData}>Umair Khan</div>
          </div>

          <div className="flex flex-row mt-5">
            <div className={styles.mainHead}> Job Title: </div>
            <div className={styles.mainData}>Umair Khan</div>
          </div>

          <div className="flex flex-row mt-5">
            <div className={styles.mainHead}> Invoice By: </div>
            <div className={styles.mainData}>May 12, 2019</div>
          </div>

          <div className="flex flex-row mt-5">
            <div className={styles.mainHead}> Invoice On: </div>
            <div className={styles.mainData}>Internal area of resturaunt</div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <img src="/email.png" alt="Email" className={styles.icon} />
            <div className={styles.quoteName}> Umair Khan</div>
          </div>

          <div className="flex flex-row items-center mt-5">
            <img src="/phone.png" alt="Phone" className={styles.icon} />
            <div className={styles.quoteName}> Umair Khan</div>
          </div>

          <div className="flex flex-row items-center mt-5">
            <img src="/website.png" alt="Website" className={styles.icon} />
            <div className={styles.quoteName}> Umair Khan</div>
          </div>

          <div className="flex flex-row items-center mt-5">
            <img src="/location.png" alt="Location" className={styles.icon} />
            <div className={styles.quoteName}> Umair Khan</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;
