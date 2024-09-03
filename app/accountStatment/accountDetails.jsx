import React from "react";
import styles from "../../styles/accountStatment.module.css"

const AccountDetails = () => {
  return (
    <div className="flex justify-between" style={{paddingTop:"34px"}}>
    <div className="flex flex-col">

      <div className="flex flex-row">
        <div className={styles.mainHeadAccount}> TRN: </div>
        <div className={styles.mainDataFirst}> 980 </div>
      </div>

      <div className={styles.mainData}> 
         Greece Cluster Building K-12, Office 12 <br /> International City Dubai <br /> info@accuratepestcontrol.ae <br /> accuratepestcontrol.ae <br /> +971521582725 <br /> 043756435
      </div>
    </div>

    <div className="flex flex-col"style={{textAlign:"left"}}>
      <div className={styles.mainHeadAccount}> Contact Person: </div>
      <div className={styles.mainName}> 
          Mr. Shujao
      </div>

      <div className={styles.mainData}> 
         Executive Facility
      </div>

      <div className={styles.mainData}> 
         Email: shujao@gmail.com
      </div>

      <div className={styles.mainData}> 
         0987654321
      </div>

      <div className={styles.mainHeadAccount}> iMile Delivery Services L.L.C: </div>

      <div className={styles.mainData}> 
        Dubai Investment Park, Dubai
      </div>
    </div>
  </div>
  );
};

export default AccountDetails;
