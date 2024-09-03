import React from "react";

import styles from "../../styles/viewQuote.module.css";

const ClientDetails = () => {
  return (
    <div className={styles.quoteMain}>

        <div className="flex justify-between" style={{ padding: "34px" }}>

          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className={styles.quoteheadMain}> Name: </div>
              <div className={styles.quoteName}> Umair Khan </div>
            </div>

            <div className="flex flex-row mt-5">
              <div className={styles.quoteheadMain}> Facility covered: : </div>
              <div className={styles.quoteName}> Umair Khan </div>
            </div>

            <div className="flex flex-row mt-5">
              <div className={styles.quoteheadMain}> Address:: </div>
              <div className={styles.quoteName}> Umair Khan </div>
            </div>

            <div className="flex flex-row mt-5">
              <div className={styles.quoteheadMain}> Serial no: </div>
              <div className={styles.quoteName} >Umair Khan </div>
            </div>

            <div className="flex flex-row mt-5">
              <div className={styles.quoteheadMain}> Service no. </div>
              <div className={styles.quoteName}> Umair Khan </div>
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
    </div>
  );
};

export default ClientDetails;
