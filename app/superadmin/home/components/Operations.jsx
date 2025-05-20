"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../../styles/superAdmin/opreationStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { dashboard } from "@/networkUtil/Constants";
import DateFilters from "../../../../components/generic/DateFilters";
import { format } from "date-fns";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";

const Operations = () => {
  const api = new APICall();

  // Separate states for each component's loading and date filters
  const [filters, setFilters] = useState({
    jobs: { startDate: null, endDate: null, loading: false },
    clients: { startDate: null, endDate: null, loading: false },
    cash: { startDate: null, endDate: null, loading: false },
    pos: { startDate: null, endDate: null, loading: false },
    expense: { startDate: null, endDate: null, loading: false },
    bank: { startDate: null, endDate: null, loading: false },
  });

  // Data states
  const [jobsList, setJobsList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [cashList, setCashList] = useState([]);
  const [posList, setPosList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [bankList, setBankList] = useState([]);

  // Generic date change handler that takes component identifier
  const handleDateChange = (component) => (start, end) => {
    setFilters((prev) => ({
      ...prev,
      [component]: {
        ...prev[component],
        startDate: start,
        endDate: end,
      },
    }));
  };

  // Generic function to get query params
  const getQueryParams = (component) => {
    const queryParams = [];
    const { startDate, endDate } = filters[component];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    return queryParams;
  };

  // Individual fetch functions with component-specific loading states
  const getAllJobs = async () => {
    setFilters((prev) => ({ ...prev, jobs: { ...prev.jobs, loading: true } }));
    try {
      const queryParams = getQueryParams("jobs");
      const response = await api.getDataWithToken(
        `${dashboard}/count_jobs?${queryParams.join("&")}`
      );
      setJobsList(response);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setFilters((prev) => ({
        ...prev,
        jobs: { ...prev.jobs, loading: false },
      }));
    }
  };

  const getAllClients = async () => {
    setFilters((prev) => ({
      ...prev,
      clients: { ...prev.clients, loading: true },
    }));
    try {
      const queryParams = getQueryParams("clients");
      const response = await api.getDataWithToken(
        `${dashboard}/count_clients?${queryParams.join("&")}`
      );
      setClientsList(response);
      console.log("test client");
      
    } catch (error) {
      console.error(error.message);
    } finally {
      setFilters((prev) => ({
        ...prev,
        clients: { ...prev.clients, loading: false },
      }));
    }
  };

  const getCash = async () => {
    setFilters((prev) => ({ ...prev, cash: { ...prev.cash, loading: true } }));
    try {
      const queryParams = getQueryParams("cash");
      const response = await api.getDataWithToken(
        `${dashboard}/cash_collection?${queryParams.join("&")}`
      );
      setCashList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFilters((prev) => ({
        ...prev,
        cash: { ...prev.cash, loading: false },
      }));
    }
  };

  const getPos = async () => {
    setFilters((prev) => ({ ...prev, pos: { ...prev.pos, loading: true } }));
    try {
      const queryParams = getQueryParams("pos");
      const response = await api.getDataWithToken(
        `${dashboard}/pos_collection?${queryParams.join("&")}`
      );
      setPosList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFilters((prev) => ({ ...prev, pos: { ...prev.pos, loading: false } }));
    }
  };

  const getExpense = async () => {
    setFilters((prev) => ({
      ...prev,
      expense: { ...prev.expense, loading: true },
    }));
    try {
      const queryParams = getQueryParams("expense");
      const response = await api.getDataWithToken(
        `${dashboard}/expense_collection?${queryParams.join("&")}`
      );
      setExpenseList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFilters((prev) => ({
        ...prev,
        expense: { ...prev.expense, loading: false },
      }));
    }
  };

  const getBank = async () => {
    setFilters((prev) => ({ ...prev, bank: { ...prev.bank, loading: true } }));
    try {
      const queryParams = getQueryParams("bank");
      const response = await api.getDataWithToken(
        `${dashboard}/bank_collection?${queryParams.join("&")}`
      );
      setBankList(response.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setFilters((prev) => ({
        ...prev,
        bank: { ...prev.bank, loading: false },
      }));
    }
  };

  // Individual useEffects for each component
  useEffect(() => {
    getAllJobs();
  }, [filters.jobs.startDate, filters.jobs.endDate]);

  useEffect(() => {
    getAllClients();
  }, [filters.clients.startDate, filters.clients.endDate]);

  useEffect(() => {
    getCash();
  }, [filters.cash.startDate, filters.cash.endDate]);

  useEffect(() => {
    getPos();
  }, [filters.pos.startDate, filters.pos.endDate]);

  useEffect(() => {
    getExpense();
  }, [filters.expense.startDate, filters.expense.endDate]);

  useEffect(() => {
    getBank();
  }, [filters.bank.startDate, filters.bank.endDate]);

  // Component render functions
  const totalExpenses = () => (
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
          <DateFilters onDateChange={handleDateChange("expense")} />
        </div>
      </div>
      <div className="flex">
        <div className="flex-grow mt-2">
          <div className={styles.itemTitle}>Total expense</div>
          {filters.expense.loading ? (
            <Skeleton variant="text" width={120} height={40} />
          ) : (
            <div className={styles.counter}>{expenseList?.total_expense}</div>
          )}
        </div>
      </div>
    </div>
  );

  const numberOfClients = () => {
    return (
      <div className="flex gap-4 mt-5">
        <div className={` flex flex-grow ${styles.itemContainer} `}>
          <div className="flex-grow">
            <div className={styles.itemTitle}>{"Number of Clients"}</div>
            {filters.clients.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div className={styles.itemCount}>
                {clientsList?.clients_count}
              </div>
            )}
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
              <DateFilters onDateChange={handleDateChange("clients")} />
            </div>
            <div className={styles.addClient}>
              <Link href="/clients">+ Add New Client</Link>
            </div>
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
            {filters.jobs.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div className={styles.itemCount}>{jobsList?.jobs_count}</div>
            )}
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
              <DateFilters onDateChange={handleDateChange("jobs")} />
            </div>
            <div className={styles.addClient}>
              <Link href="/allJobs">View All Jobs</Link>
            </div>
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
            {filters.cash.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>{cashList?.total_cash}</div>
            )}
          </div>
          <div className="mt-2">
            <div className={styles.itemTitle}>Total Transactions</div>
            {filters.cash.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>
                {cashList?.no_of_transection}
              </div>
            )}
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
            {filters.pos.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>{posList?.total_pos}</div>
            )}
          </div>
          <div className="mt-2">
            <div className={styles.itemTitle}>Total Transactions</div>
            {filters.pos.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>
                {posList?.no_of_transection}
              </div>
            )}
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
            <div className={styles.itemTitle}>total Transfers</div>
            {filters.bank.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>
                {bankList?.total_cheque_transfer}
              </div>
            )}
          </div>

          <div className="mt-2">
            <div className={styles.itemTitle}>total count</div>
            {filters.bank.loading ? (
              <Skeleton variant="text" width={120} height={40} />
            ) : (
              <div>
                {bankList?.total_cheque_count}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Operations</div>
      <div className="grid grid-cols-2 gap-4">
        <div>{numberOfClients()}</div>
        <div>{numberOfJobs()}</div>
      </div>
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
