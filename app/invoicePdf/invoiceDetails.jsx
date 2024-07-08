import React from "react";
import styles from "../../styles/serviceReport.module.css";

const InvoiceDetails = () => {
  return (
    <div className="flex justify-between" style={{ padding: "34px" }}>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className={styles.mainHead}> Contact Person: </div>
          <div className={styles.mainData}>Umair Khan</div>
        </div>

        <div className="flex flex-row mt-5">
          <div className={styles.mainHead}> Job Title: </div>
          <div className={styles.mainData}>Umair Khan</div>
        </div>

        <div className="flex flex-row">
          <div className={styles.mainHead}> Invoice By: </div>
          <div className={styles.mainData}>May 12, 2019</div>
        </div>

        <div className="flex flex-row">
          <div className={styles.mainHead}> Invoice On: </div>
          <div className={styles.mainData}>Internal area of resturaunt</div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row">
          <img src="/email.png" />
          <div className={styles.quoteName}> Umair Khan</div>
        </div>

        <div className="flex flex-row mt-5">
          <img src="/phone.png" />
          <div className={styles.quoteName}> Umair Khan</div>
        </div>

        <div className="flex flex-row mt-5">
          <img src="/website.png" />
          <div className={styles.quoteName}> Umair Khan</div>
        </div>

        <div className="flex flex-row mt-5">
          <img src="/location.png" />
          <div className={styles.quoteName}> Umair Khan</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
