import React from "react";
import styles from "../../../../styles/superAdmin/opreationStyles.module.css";
import DateFilters from "../../../../components/generic/DateFilters";
const Operations = () => {
  const totalExpenses = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.itemTitle}>Total Expenses</div>
            <div className={styles.counter}>2776</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Total Sales</div>
            <div className={styles.counter}>2776</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Balance</div>
            <div className={styles.counter}>2776</div>
          </div>
        </div>
      </div>
    );
  };

  const cashCollection = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>Cash Collection</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Total Sales</div>
            <div className={styles.counter}>2776</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Balance</div>
            <div className={styles.counter}>2776</div>
          </div>
        </div>
      </div>
    );
  };

  const posCollection = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>POS Collection</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>40</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Balance</div>
            <div className={styles.counter}>2776</div>
          </div>
        </div>
      </div>
    );
  };

  const bankCollection = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>Bank Transfer</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>15</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Balance</div>
            <div className={styles.counter}>2776</div>
          </div>
        </div>
      </div>
    );
  };

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
      {numberOfClients()}
      {numberOfJobs()}

      {/* {teamAndVehicales()} */}
      <div className="mt-5"></div>
      <div className="pageTitle">Accounts</div>
      <div className="mt-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">{totalExpenses()}</div>
          <div className="col-span-6 ">{cashCollection()}</div>
        </div>
        <div className="grid grid-cols-12 gap-4 mt-5">
          <div className="col-span-6">{posCollection()}</div>
          <div className="col-span-6 ">{bankCollection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
