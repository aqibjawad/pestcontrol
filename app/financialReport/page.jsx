"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  dashboard,
  vehciles,
  expense_category,
  admin,
  payments,
  clients,
} from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";
import withAuth from "@/utils/withAuth";

const FinancialDashboard = () => {
  const api = new APICall();

  const [allClientsList, setAllClientsList] = useState([]);
  const [allVehicleExpense, setAllVehicleExpense] = useState(0);
  const [expenseList, setExpenseList] = useState(0);
  const [ledgerList, setLedgerList] = useState(0);

  const [paymentList, setPaymentsList] = useState([]);

  const [fetchingData, setFetchingData] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return date.toISOString().slice(0, 7); // Returns YYYY-MM format
  };

  // Fetch all financial data based on selected month
  const fetchFinancialData = async () => {
    setFetchingData(true);
    try {
      // Parallel API calls for different data points
      await Promise.all([
        getFinancial(),
        getVehiclesExpense(),
        getAllExpenses(),
        getLedger(),
        getPending(),
      ]);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedDate]);

  const getFinancial = async () => {
    try {
      const response = await api.getDataWithToken(
        `${dashboard}/monthly_financial_report?month=${formatDate(
          selectedDate
        )}`
      );
      setAllClientsList(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getVehiclesExpense = async () => {
    try {
      const response = await api.getDataWithToken(
        `${vehciles}?month=${formatDate(selectedDate)}`
      );

      const totalExpense = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || 0);
      }, 0);

      setAllVehicleExpense(totalExpense);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllExpenses = async () => {
    try {
      const response = await api.getDataWithToken(
        `${expense_category}?month=${formatDate(selectedDate)}`
      );

      const totalAmount = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.total_amount || 0);
      }, 0);
      setExpenseList(totalAmount);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const getLedger = async () => {
    try {
      const response = await api.getDataWithToken(
        `${clients}/received_amount/get?month=${formatDate(selectedDate)}`
      );

      console.log("response", response.data.ledger_cr_amt_sum);
      
      const totalAmountLedger = response.data.reduce((sum, item) => {
        const paidAmt =
          item.paid_amt !== undefined ? parseFloat(item.ledger_cr_amt_sum ) : 0;
        if (isNaN(paidAmt)) {
          console.error(`Invalid ledger_cr_amt_sum  value: ${item.ledger_cr_amt_sum }`);
          return sum;
        }
        return sum + paidAmt;
      }, 0);

      setLedgerList(totalAmountLedger);

      console.log("Total Ledger Amount:", totalAmountLedger);
    } catch (error) {
      console.error("Error fetching ledger:", error);
    }
  };

  const getPending = async () => {
    try {
      const response = await api.getDataWithToken(
        `${payments}?month=${formatDate(selectedDate)}`
      );
      const totalPending = response.data.reduce((sum, item) => {
        return sum + parseFloat(item.paid_amt || 0);
      }, 0);
      setPaymentsList(totalPending);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const closingData = [
    { category: "CHEMICAL", amount: allClientsList?.supplier_balance || 0 },
    {
      category: "Paid Salaries",
      amount: allClientsList?.paid_employee_salary || 0,
    },
    {
      category: "Paid Comissions",
      amount: allClientsList?.paid_employee_comm || 0,
    },
    { category: "Vehicles Expense", amount: allVehicleExpense },
    { category: "Expenses", amount: expenseList },
  ];

  const calculateClosingTotal = () => {
    return closingData.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
  };

  const detailData = [
    { category: "Cash", amount: ledgerList },
    { category: "Pending Payments", amount: paymentList },
  ];

  const calculateDetailTotal = () => {
    return detailData.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
  };

  const summaryData = [
    { category: "PENDING CASH RCVD", amount: 3980.05 },
    { category: "bank/CHQ", amount: 8254.62 },
  ];

  const Card = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );

  const ExpenseItem = ({ category, amount }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-700">{category}</span>
      <span className="font-medium">
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
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
      <div className="mt-5 bg-green-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold"> Financial Report </h1>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="bg-white text-green-800 px-3 py-2 rounded"
          />
        </div>
      </div>

      {fetchingData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Closing Report */}
          <Card title="Closing Report">
            {closingData.map((item, index) => (
              <ExpenseItem
                key={index}
                category={item.category}
                amount={item.amount}
              />
            ))}
            <TotalRow amount={calculateClosingTotal()} />
          </Card>

          {/* Detail Report */}
          <Card title="Detail Report">
            {detailData.map((item, index) => (
              <ExpenseItem
                key={index}
                category={item.category}
                amount={item.amount}
              />
            ))}
            <TotalRow amount={calculateDetailTotal()} />
          </Card>

          {/* Summary Card */}
          <Card title="Summary">
            <div className="bg-blue-50 p-3 rounded-md">
              {summaryData.map((item, index) => (
                <ExpenseItem
                  key={index}
                  category={item.category}
                  amount={item.amount}
                />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default withAuth(FinancialDashboard);
