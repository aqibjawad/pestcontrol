import React from "react";
import styles from "../../../../styles/superAdmin/finanaceStyles.module.css";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import DateFilters from "@/components/generic/DateFilters";

import CommissionCal from "@/app/hr/comCal/page";
import Invoices from "@/app/invoice/invoices";

import All from "../../../accountant/all/page";

const Finance = ({ isVisible }) => {
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

  const accountStatement = () => {
    return (
      <div>
        <div className="pageTitle"></div>
        <div className="flex">
          {/* <div className="flex-grow">
            <div className="mt-5">
              <SearchInput />
            </div>
          </div> */}
          {/* <div className="flex">
            <GreenButton title={"Client"} />
            <GreenButton title={"Vendor"} />
          </div> */}

          {/* <AllClients /> */}
        </div>
      </div>
    );
  };

  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientEmail: "ali@gmail.com",
    clientPhone: "0900 78601",
    service: "Pest Control",
    date: "5 May 2024",
    priority: "High",
    status: "Completed",
    teamCaptain: "Babar Azam",
  }));

  const listTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table class="min-w-full bg-white ">
          <thead class="">
            <tr>
              <th class="py-5 px-4 border-b border-gray-200 text-left">Sr.</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">Name</th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Completed Jobs
              </th>
              <th class="py-2 px-4 border-b border-gray-200 text-left">
                Account Statement
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">1</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{row.clientName}</div>
                  <div className={tableStyles.clientEmail}>
                    {row.clientEmail}
                  </div>
                  <div className={tableStyles.clientPhone}>
                    {row.clientPhone}
                  </div>
                </td>
                <td className="py-2 px-4">{"5"}</td>
                <td className="py-2 px-4">{"View Statement"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const invoices = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>Invoices</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>12</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Amount</div>
            <div className={styles.counter}>5000 : AED</div>
          </div>
        </div>
      </div>
    );
  };

  const paymentReceipt = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>Payment receipts</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>12</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Amount</div>
            <div className={styles.counter}>5000 : AED</div>
          </div>
        </div>
      </div>
    );
  };

  const paymentVouchers = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div className="flex-grow">
            <div className={styles.boxTitle}>Payment Vouchers</div>
          </div>
          <DateFilters />
        </div>
        <div className="flex">
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>12</div>
          </div>
          <div className="flex-grow mt-5">
            <div className={styles.itemTitle}>Amount</div>
            <div className={styles.counter}>5000 : AED</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-10">
        <All />
      </div>
      {/* <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">{totalExpenses()}</div>
        <div className="col-span-6 ">{cashCollection()}</div>
      </div> */}
      {/* <div className="grid grid-cols-12 gap-4 mt-5">
        <div className="col-span-6">{posCollection()}</div>
        <div className="col-span-6 ">{bankCollection()}</div>
      </div> */}

      <CommissionCal isVisible={isVisible} />
      <div className="mt-10 mb-10">{accountStatement()}</div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 ">
          <Invoices isVisible={isVisible} />
        </div>
        {/* <div className="col-span-6 ">{paymentReceipt()}</div>
        <div className="col-span-6 ">{paymentVouchers()}</div> */}
      </div>
    </div>
  );
};

export default Finance;
