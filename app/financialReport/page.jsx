import React from "react";

const FinancialDashboard = () => {
  const closingData = [
    { category: "CHEMICAL", amount: 3416.65 },
    { category: "ENOC", amount: 3875.17 },
    { category: "SALIK", amount: 1006.25 },
    { category: "VEHICALS", amount: 3930.0 },
    { category: "NOL CARD", amount: 100.0 },
    { category: "UTILITY BILLS", amount: 6885.59 },
  ];

  const detailData = [
    { category: "IRFAN", amount: 2253.0 },
    { category: "CASH IN HAND", amount: 0.0 },
    { category: "COIN", amount: 10.0 },
  ];

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Financial Report - NOV 2024</h1>
      </div>

      {/* Dashboard Grid */}
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
          <TotalRow amount={19213.66} />
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
          <TotalRow amount={2263.0} />
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
    </div>
  );
};

export default FinancialDashboard;
