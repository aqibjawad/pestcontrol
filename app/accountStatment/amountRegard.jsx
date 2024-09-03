import React from "react";

import styles from "../../styles/serviceReport.module.css";

const AmountRegards = () => {
  return (
    <div className="flex justify-between" style={{paddingTop:"34px"}}>
      <div className="flex flex-col">

        <div className="flex flex-row">
          <div className={styles.mainHead}> Amount Recieved: </div>
          <div className={styles.mainData}> 980 </div>
        </div>

        <div className="flex flex-row">
          <div className={styles.mainHead}> Amount Pending: </div>
          <div className={styles.mainData}> 9801 </div>
        </div>
        <div className={styles.mainData}> Pending Amount(AED 13,232.50) Thirteen Thousand </div>
        <div style={{color:"#8E8E93", fontFamily:'regular', fontWeight:"500", fontSize:"14px"}}> Hundred and Thirty Only </div>
      </div>

      <div className="flex flex-col"style={{textAlign:"left"}}>
        <div className={styles.mainHead}> Best Regards: </div>
        <div className={styles.mainData}> 
            Accurate Pest Control Services LLC <br /> Joseph Matt <br /> Accounts Manager<br /> 0521582725 <br /> info@accuratepestcontrol.ae 
        </div>
      </div>
    </div>
  );
};

export default AmountRegards;
