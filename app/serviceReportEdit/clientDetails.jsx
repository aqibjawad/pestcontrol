import React from "react";
import styles from "../../styles/serviceReport.module.css"

const ClientDetails = ({serviceReportList, serviceReport}) => {

  console.log(serviceReport);
  

  return (
    <div className="flex justify-between" style={{ padding: "34px" }}>

      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className={styles.mainHead}>Client Name: </div>
          <div className={styles.mainData}> {serviceReportList?.user?.client?.firm_name} </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className={styles.mainHead}>Contact Number: </div>
          <div className={styles.mainData}> {serviceReportList?.user?.client?.phone_number}  </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className={styles.mainHead}>Date: </div>
          <div className={styles.mainData}> {serviceReportList?.job_date} </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className={styles.mainHead}>Facility Covered :: </div>
          <div className={styles.mainData}> {serviceReportList?.client_address?.address} </div>
        </div>
      </div>

    </div>
  );
};

export default ClientDetails;
