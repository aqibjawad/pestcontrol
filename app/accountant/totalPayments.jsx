"use client";

import React from "react";
import Link from "next/link";

const PaymentsTotal = ({ payableList }) => {
  console.log(payableList);

  // Dummy data for payments
  const dummyPayments = [
    {
      id: 1,
      created_at: "2025-05-10",
      description: "Monthly service payment",
      referenceable: {
        name: "Vehicle Maintenance",
      },
      cash_amt: "500.00",
      online_amt: "0.00",
      cheque_amt: "0.00",
    },
    {
      id: 2,
      created_at: "2025-05-12",
      description: "Spare parts payment",
      referenceable: {
        vehicle_number: "DXB-12345",
      },
      cash_amt: "0.00",
      online_amt: "1200.50",
      cheque_amt: "0.00",
    },
    {
      id: 3,
      created_at: "2025-05-15",
      description: "Quarterly maintenance contract",
      referenceable: {
        supplier_name: "AutoParts LLC",
      },
      cash_amt: "0.00",
      online_amt: "0.00",
      cheque_amt: "3500.00",
    },
    {
      id: 4,
      created_at: "2025-05-18",
      description: "Emergency repair service",
      referenceable: {
        expense_name: "Breakdown Assistance",
      },
      cash_amt: "750.00",
      online_amt: "0.00",
      cheque_amt: "0.00",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Calculate totals for summary
  const calculateTotals = () => {
    let totalCash = 0;
    let totalBank = 0;
    let totalCheque = 0;
    let grandTotal = 0;

    dummyPayments.forEach((transaction) => {
      totalCash += parseFloat(transaction.cash_amt || 0);
      totalBank += parseFloat(transaction.online_amt || 0);
      totalCheque += parseFloat(transaction.cheque_amt || 0);
      grandTotal +=
        parseFloat(transaction.cash_amt || 0) +
        parseFloat(transaction.online_amt || 0) +
        parseFloat(transaction.cheque_amt || 0);
    });

    return {
      totalCash,
      totalBank,
      totalCheque,
      grandTotal,
    };
  };

  const totals = calculateTotals();

  return (
    <div>
      <div style={{ padding: "20px 0" }}>
        {/* Header with flex layout */}
        {/* <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              Payable Cheques
            </div>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div className="grid gap-2">
            {payableList.map((transaction, index) => {
              return (
                <div
                  key={transaction.id}
                  className="bg-white rounded shadow px-4 py-2"
                >
                  {/* First row - Sr. No, Date, Reference */}
                  <div className="flex mb-1">
                    <div style={{ width: "70px" }} className="text-sm">
                      <span className="font-semibold">Sr. No</span>
                      <div>{index + 1}</div>
                    </div>
                    <div style={{ width: "100px" }} className="text-sm">
                      <span className="font-semibold">Cheque Date</span>
                      <div>{formatDate(transaction.cheque_date)}</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Cheque No</span>
                      <div>{transaction?.cheque_no}</div>
                    </div>
                  </div>

                  {/* Second row - Description, Amount */}
                  <div className="flex justify-between mt-5">
                    <div className="text-sm">
                      <span className="font-semibold">Reference Category </span>
                      <div>
                        {transaction.entry_type === "supplier_payment"
                          ? "Supplier"
                          : transaction.entry_type === "expense_payment"
                          ? "Expense"
                          : "Expense"}
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <span className="font-semibold">Reference</span>
                      <div className="font-medium">
                        {transaction.linkable?.supplier_name ||
                          transaction.linkable?.expense_name}
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <span className="font-semibold">Cheque Amount</span>
                      <div className="font-medium">
                        {transaction.cheque_amount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTotal;
