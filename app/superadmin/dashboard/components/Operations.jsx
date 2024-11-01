"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../../styles/superAdmin/opreationStyles.module.css";

import APICall from "@/networkUtil/APICall";
import { dashboard, job, clients } from "@/networkUtil/Constants";

import DateFilters from "../../../../components/generic/DateFilters";

import { format } from "date-fns";

import Skeleton from '@mui/material/Skeleton';

const Operations = () => {
  const api = new APICall();
  const [fetchingData, setFetchingData] = useState(false);

  const [jobsList, setJobsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);

  const [cashList, setCashList] = useState([]);
  const [posList, setPosList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    getAllJobs();
    getAllClients();
    getCash();
    getPos();
    getExpense();
  }, [startDate, endDate]);

  const getAllJobs = async () => {
    setFetchingData(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${job}/all?${queryParams.join("&")}`
      );
      setJobsList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const getAllClients = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${clients}?${queryParams.join("&")}`
      );
      setClientsList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const getCash = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${dashboard}/cash_collection?${queryParams.join("&")}`
      );
      setCashList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const getPos = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${dashboard}/pos_collection?${queryParams.join("&")}`
      );
      setPosList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const getExpense = async () => {
    setFetchingData(true);

    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${dashboard}/expense_collection?${queryParams.join("&")}`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFetchingData(false);
    }
  };

  const totalExpenses = () => {
    return (
      <div className={styles.itemContainer}>
        <div className="flex">
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="flex">
          <div className="flex-grow mt-2">
            <div className={styles.itemTitle}>Total expense</div>
            <div className={styles.counter}> {expenseList.total_expense} </div>
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
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="flex">
          <div className="flex-grow mt-2">
            <div className={styles.itemTitle}>Total Collection</div>
            <div className={styles.counter}> {cashList.total_cash} </div>
          </div>

          <div className=" mt-2">
            <div className={styles.itemTitle}>Total Transactions</div>
            <div className={styles.counter}> {cashList.no_of_transection} </div>
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
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="flex">
          <div className="flex-grow mt-2">
            <div className={styles.itemTitle}>Total Amount</div>
            <div className={styles.counter}> {posList.total_pos} </div>
          </div>
          <div className="mt-2">
            <div className={styles.itemTitle}>Total Transactions</div>
            <div className={styles.counter}> {posList.no_of_transection} </div>
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
          <div
            style={{
              border: "1px solid #38A73B",
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              alignItems: "center",
              display: "flex",
            }}
          >
            <img
              src="/Filters lines.svg"
              height={20}
              width={20}
              className="ml-2 mr-2"
            />
            <DateFilters onDateChange={handleDateChange} />
          </div>
        </div>
        <div className="flex">
          <div className="flex-grow mt-2">
            <div className={styles.itemTitle}>Count</div>
            <div className={styles.counter}>15</div>
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

  const numberOfClients = () => {
    return (
      <div className="flex gap-4 mt-5">
        <div className={` flex flex-grow ${styles.itemContainer} `}>
          <div className="flex-grow">
            <div className={styles.itemTitle}>{"Number of Clients"}</div>
            <div className={styles.itemCount}>{clientsList.length}</div>
          </div>
          <div>
            <div
              style={{
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              <DateFilters onDateChange={handleDateChange} />
            </div>

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
            <div className={styles.itemCount}> {jobsList.length} </div>
          </div>
          <div>
            <div
              style={{
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "150px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              <DateFilters onDateChange={handleDateChange} />
            </div>

            <div className={styles.addClient}> View All Jobs</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Operations</div>

      {/* Wrap number of clients and number of jobs in a grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>{numberOfClients()}</div>
        <div>{numberOfJobs()}</div>
      </div>

      {/* {teamAndVehicales()} */}
      <div className="mt-5"></div>
      <div className="pageTitle">Accounts</div>
      <div className="mt-10">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">{totalExpenses()}</div>
          <div className="col-span-6">{cashCollection()}</div>
        </div>
        <div className="grid grid-cols-12 gap-4 mt-5">
          <div className="col-span-6">{posCollection()}</div>
          <div className="col-span-6">{bankCollection()}</div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
