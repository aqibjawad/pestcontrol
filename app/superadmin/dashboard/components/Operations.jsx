import React from "react";
import styles from "../../../../styles/superAdmin/opreationStyles.module.css";
import DateFilters from "../../../../components/generic/DateFilters";
const Operations = () => {
  const teamAndVehicales = () => {
    return (
      <div className="flex gap-4 mt-5">
        <div
          className={`flex-grow ${styles.itemContainer} ${styles.teamMembers}`}
        >
          <div className={styles.itemTitle}>{"Team Member"}</div>
          <div className={styles.itemCount}>{"423"}</div>
        </div>
        <div className={`flex-grow ${styles.itemContainer} `}>
          <div className={styles.itemTitle}>{"Number of Vehicle"}</div>
          <div className={styles.itemCount}>{"423"}</div>
        </div>
      </div>
    );
  };
  const onSelectionChange = (selection) => {
    console.log("onSelectionChange" + selection);
  };

  const onDateChange = (startDate, endData) => {
    console.log("onSelectionChange" + startDate + " " + endData);
  };

  const numberOfClients = () => {
    return (
      <div className="flex gap-4 mt-5">
        <div className={` flex flex-grow ${styles.itemContainer} `}>
          <div className="flex-grow">
            <div className={styles.itemTitle}>{"Number of Clients"}</div>
            <div className={styles.itemCount}>{"423"}</div>
          </div>
          <div>
            <DateFilters
              onOptionChange={onSelectionChange}
              onDateChange={onDateChange}
            />
            <div className={styles.addClient}> + Add New Client</div>
          </div>
        </div>
      </div>
    );
  };

  const numberOfJobs = () => {
    return (
      <div className="flex gap-4 mt-5">
        <div className={` flex flex-grow ${styles.itemContainer} `}>
          <div className="flex-grow">
            <div className={styles.itemTitle}>{"Number of Jobs"}</div>
            <div className={styles.itemCount}>{"423"}</div>
          </div>
          <div>
            <DateFilters
              onOptionChange={onSelectionChange}
              onDateChange={onDateChange}
            />
            <div className={styles.addClient}> View All Jobs</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Operations</div>
      {teamAndVehicales()}
      {numberOfClients()}
      {numberOfJobs()}
    </div>
  );
};

export default Operations;
