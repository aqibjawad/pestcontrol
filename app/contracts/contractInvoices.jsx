import React from "react";

const ContractInvoices = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contract Job</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Salary
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Software Developer
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Tech Corp
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              New York, NY
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              $120,000
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Data Analyst
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              Data Inc
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              San Francisco, CA
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              $110,000
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ContractInvoices;
