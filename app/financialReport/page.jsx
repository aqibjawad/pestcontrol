"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthPicker from "../hr/monthPicker";

import {
  dashboard,
  vehciles,
  expense_category,
  adminn,
  payments,
  bank,
  serviceInvoice,
} from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";
import withAuth from "@/utils/withAuth";

import Link from "next/link";
import { useRouter } from "next/navigation";

const FinancialDashboard = () => {
  const api = new APICall();
  const router = useRouter();

  const [allClientsList, setAllClientsList] = useState([]);

  const [allAdminFinance, setAllAdminFinance] = useState([]);

  const [allVehicleExpense, setAllVehicleExpense] = useState(0);
  const [expenseList, setExpenseList] = useState(0);

  const [ledgerList, setLedgerList] = useState(0);
  const [cashList, setCashList] = useState([]);
  const [posList, setPosList] = useState([]);
  const [bankList, setBankList] = useState([]);

  const [paymentList, setPaymentsList] = useState(0);

  const [settleList, setSettleList] = useState(0);

  const [fetchingData, setFetchingData] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatStartEndDates = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startDate = new Date(year, month, 1);

    const endDate = new Date(year, month + 1, 0);

    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    };
  };

  const fetchFinancialData = async (startDate, endDate) => {
    setFetchingData(true);

    try {
      await Promise.all([
        getFinancial(startDate, endDate),
        getVehiclesExpense(startDate, endDate),
        getAllExpenses(startDate, endDate),
        getPending(startDate, endDate),
        getBank(startDate, endDate),
        getPos(startDate, endDate),
        getCash(startDate, endDate),
        getSettle(startDate, endDate),
      ]);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleDateChange = ({ startDate, endDate }) => {
    fetchFinancialData(startDate, endDate);
  };

  const getFinancial = async (startDate, endDate) => {
    try {
      // Extract year and month from startDate
      const date = new Date(startDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const monthParam = `${year}-${month}`;

      const response = await api.getDataWithToken(
        `${dashboard}/monthly_financial_report/${monthParam}`
      );
      setAllClientsList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFinancialAdmin = async () => {
    try {
      const response = await api.getDataWithToken(
        `${adminn}/current/balance/get`
      );
      setAllAdminFinance(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getFinancialAdmin();
  }, []);

  const getVehiclesExpense = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${vehciles}?start_date=${startDate}&end_date=${endDate}`
      );

      const totalExpense = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || 0);
      }, 0);

      setAllVehicleExpense(totalExpense);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllExpenses = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${expense_category}?start_date=${startDate}&end_date=${endDate}`
      );

      const totalAmount = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || 0);
      }, 0);
      setExpenseList(totalAmount);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const getCash = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${dashboard}/cash_collection?start_date=${startDate}&end_date=${endDate}`
      );
      setCashList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPos = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${dashboard}/pos_collection?start_date=${startDate}&end_date=${endDate}`
      );
      setPosList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getBank = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(`${bank}`);
      setBankList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPending = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${payments}?start_date=${startDate}&end_date=${endDate}`
      );
      const totalPending = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.paid_amt || 0);
      }, 0);
      setPaymentsList(totalPending);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const getSettle = async (startDate, endDate) => {
    try {
      const response = await api.getDataWithToken(
        `${serviceInvoice}/settlement/get?start_date=${startDate}&end_date=${endDate}`
      );
      const totalPending = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.settlement_amt || 0);
      }, 0);
      setSettleList(totalPending);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const closingData = [
    {
      category: "PRO Docs Expense",
      amount: allClientsList?.employee_expense || 0,
    },
    {
      category: "Total Payable to suppliers",
      amount: allClientsList?.supplier_balance || 0,
    },
    {
      category: "Selected Month Delivery Note",
      amount: allClientsList?.delivery_note || 0,
    },
    {
      category: "Paid Salaries",
      amount: allClientsList?.paid_employee_salary || 0,
    },
    {
      category: "Paid Comission",
      amount: allClientsList?.paid_employee_comm || 0,
    },
    { category: "Vehicles Expense", amount: allVehicleExpense },
    { category: "Expenses", amount: expenseList },
    {
      category: "Settlement Invoices",
      amount: settleList,
      path: "/settelmentedInvoice",
    },
  ];

  const handleClick = (path) => {
    if (typeof path === "string" && path.trim() !== "") {
      router.push(path);
    } else {
      console.error("Invalid path:", path);
    }
  };

  const calculateClosingTotal = () => {
    const includedCategories = [
      "Paid Salaries",
      "Paid Comissions",
      "Vehicles Expense",
      "Expenses",
    ];

    const filteredData = closingData.filter((item) =>
      includedCategories.includes(item.category)
    );

    return filteredData.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
  };

  const detailData = [
    { category: "Cash", amount: cashList?.total_cash, path: "/cashLedger" },
    { category: "POS", amount: posList?.total_pos },
    { category: "Bank", amount: bankList?.total_cheque_transfer },
    {
      category: "Unapproved Payments",
      amount: paymentList,
    },
  ];

  const calculateDetailTotal = () => {
    return detailData.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
  };

  const overAllData = [
    { category: "Cash", amount: allAdminFinance?.cash_balance, path: "/cashLedger?name=overall" },
    { category: "POS", amount: allAdminFinance?.pos_collection },
    { category: "Bank", amount: allAdminFinance?.bank_balance },
  ];

  const calculateOverAllTotal = () => {
    return overAllData.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
  };

  const Card = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );

  const ExpenseItem = ({ category, amount, path, onClick }) => (
    <div
      onClick={() => (path ? onClick(path) : null)}
      className={`flex justify-between py-2 border-b border-gray-100 ${path ? "cursor-pointer hover:bg-gray-50" : ""}`}
    >
      <span className="text-gray-700">{category}</span>
      <span className="font-medium">
        {amount != null
          ? amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "0.00"}
      </span>
    </div>
  );

  const TotalRow = ({ amount }) => (
    <div className="flex justify-between py-2 px-3 mt-3 bg-green-50 rounded-md font-bold text-green-800">
      <span>TOTAL</span>
      <span>
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="rectangular" width="100%" height={200} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Month Picker */}
      <div></div>
      <div className="mt-5 bg-green-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold"> Financial Report </h1>
      </div>

      <MonthPicker
        onDateChange={handleDateChange}
        onChange={(date) => setSelectedDate(date)}
      />

      {fetchingData ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className=" mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Closing Report */}
          <Card title="Closing Report of the Month">
            {closingData.map((item, index) => (
              <ExpenseItem
                key={index}
                category={item.category}
                amount={item.amount}
                path={item.path}
                onClick={handleClick}
              />
            ))}
            <TotalRow amount={calculateClosingTotal()} />
          </Card>

          {/* Detail Report */}
          <Card title="Detail Report of the Month">
            <div>
              {detailData.map((item, index) => (
                <ExpenseItem
                  key={index}
                  category={item.category}
                  amount={item.amount}
                  path={item.path}
                  onClick={handleClick}
                />
              ))}
              <TotalRow amount={calculateDetailTotal()} />
            </div>
          </Card>

          {/* Overall Report */}
          <Card title="Overall Report">
            <div>
              {overAllData.map((item, index) => (
                <ExpenseItem
                  key={index}
                  category={item.category}
                  amount={item.amount}
                  path={item.path}
                  onClick={handleClick}
                />
              ))}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Bank Name</th>
                      <th className="p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankList?.map((bank) => (
                      <tr key={bank.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Link
                            href={`/operations/bankInfo?id=${bank.id}`}
                            className="text-blue-500"
                          >
                            {bank.bank_name}
                          </Link>
                        </td>
                        <td className="p-2 text-right">
                          {parseFloat(bank.balance).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <TotalRow amount={calculateOverAllTotal()} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default withAuth(FinancialDashboard);