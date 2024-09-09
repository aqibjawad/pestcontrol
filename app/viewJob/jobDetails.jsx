import React from "react";
import styles from "../../styles/viewQuote.module.css";

const JobDetails = () => {
  return (
    <div>
      <div className="pageTitle">Job Details</div>
      <div className="mb-10 mt-10">
        <div className={styles.quoteMain}>
          <div className="flex mt-10">
            <div className="flex-grow">
              <div className={styles.itemTitle}>Job Title</div>
            </div>
            <div className={styles.itemName}>Pest Control </div>
          </div>

          <div className="flex mt-10">
            <div className="flex-grow">
              <div className={styles.itemTitle}>Job Title</div>
            </div>
            <div className={styles.itemName}>Pest Control </div>
          </div>

          <div className="flex mt-10">
            <div className="flex-grow">
              <div className={styles.itemTitle}>Region</div>
            </div>
            <div className={styles.itemName}>Dubai </div>
          </div>

          <div className="flex mt-10">
            <div className="flex-grow">
              <div className={styles.itemTitle}>Address</div>
            </div>
            <div className={styles.itemName}>Detailed Address</div>
          </div>

          <div className="flex mt-10">
            <div className="flex-grow">
              <div className={styles.itemTitle}>Address</div>
            </div>
            <div className={styles.itemName}>Detailed Address</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
