import React from "react";
import styles from "../../styles/serviceReport.module.css"

const ClientDetails = ({serviceReportList}) => {
  return (
    <div className="flex justify-between" style={{ padding: "34px" }}>

      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className={styles.mainHead}>Client Name: </div>
          <div className={styles.mainData}> {serviceReportList?.user?.name} </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className={styles.mainHead}>Contact Number: </div>
          <div className={styles.mainData}> {serviceReportList?.user?.client?.phone_number}  </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className={styles.mainHead}>Date: </div>
          <div className={styles.mainData}>May 12, 2019</div>
        </div>

        <div className="flex flex-row mt-5">
          <div className={styles.mainHead}>Facility Covered :: </div>
          <div className={styles.mainData}>Internal area of resturaunt</div>
        </div>
      </div>

    </div>
  );
};

export default ClientDetails;
