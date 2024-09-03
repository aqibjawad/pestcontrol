import React from "react";
import styles from "../../styles/viewQuote.module.css";

const JobDetails = () => {
  return (
    <div>
      <div className="pageTitle">Quotes</div>

      <div className={styles.quoteMain}>
        <div className={styles.quoteHead}> Job Details </div>

          <div className="flex justify-between" style={{ padding: "34px" }}>
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className={styles.quoteheadMain}> Job Title: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}>Contact Person: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Reference: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Priority: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}>Priority: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Start On: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Duration: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

            </div>

            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className={styles.quoteheadMain}> Reference: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}>Contact Person: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Date: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> Day Part: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

              <div className="flex flex-row mt-5">
                <div className={styles.quoteheadMain}> End On: </div>
                <div className={styles.quoteName}> Umair Khan </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  );
};

export default JobDetails;
