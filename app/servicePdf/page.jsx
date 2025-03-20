"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PestControlRecord = () => {
  // Reference to the component that will be printed
  const componentRef = useRef();

  // Function to handle printing (PDF generation)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "PIPM-Pest-Control-Record",
  });

  // Sample data based on the image
  const companyInfo = {
    name: "P I P M Pest Control Services",
    address: "Al Qusais Industrial Area 3 - Nariya Building - 203 B",
    poBox: "P.O Box: 234061",
    city: "Dubai, UAE",
    phone: "+97143801800",
    email: "info@pipm.ae",
    trn: "100402180600003",
  };

  const clientInfo = {
    name: "Saddle Café and Restaurant Mandif and Madlall and Girll L.L.C",
    date: "Dubai - UAE",
    phone: "97143354888",
    customerId: "8292",
    contractNumber: "682022522",
    totalVisits: "27",
  };

  const contractInfo = {
    description: "Commercial & Restaurant Pest Control",
    startingDate: "17.11.2022",
    expiryDate: "16.11.2023",
    typeOfService: "General Pest Control - Rodent and Pest Management",
    methodOfTreatment: "Spray, Gel application, Monitoring",
    frequency: "Twice a Month - Fortnightly",
  };

  const visitsData = [
    {
      id: 1,
      date: "17 Nov 2022",
      type: "Treatment",
      serviceReport: "6916",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 2,
      date: "30 Nov 2022",
      type: "Treatment",
      serviceReport: "6689",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 3,
      date: "02 Dec 2022",
      type: "Treatment",
      serviceReport: "6604",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 4,
      date: "06 Dec 2022",
      type: "Treatment",
      serviceReport: "6735",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 5,
      date: "15 Dec 2022",
      type: "Treatment",
      serviceReport: "6734",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 6,
      date: "26 Dec 2022",
      type: "Treatment",
      serviceReport: "6895",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 7,
      date: "03 Jan 2023",
      type: "Treatment",
      serviceReport: "7069",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 8,
      date: "18 Jan 2023",
      type: "Treatment",
      serviceReport: "7359",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 9,
      date: "02 Feb 2023",
      type: "Treatment",
      serviceReport: "7279",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 10,
      date: "17 Feb 2023",
      type: "Treatment",
      serviceReport: "7396",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 11,
      date: "22 Feb 2023",
      type: "Complain",
      serviceReport: "7430",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 12,
      date: "06 Mar 2023",
      type: "Treatment",
      serviceReport: "7716",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 13,
      date: "18 Mar 2023",
      type: "Treatment",
      serviceReport: "7649",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 14,
      date: "07 Apr 2023",
      type: "Treatment",
      serviceReport: "8415",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 15,
      date: "26 Apr 2023",
      type: "Treatment",
      serviceReport: "8096",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 16,
      date: "08 May 2023",
      type: "Treatment",
      serviceReport: "8641",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 17,
      date: "23 May 2023",
      type: "Treatment",
      serviceReport: "8645",
      baitStatus: "",
      checkedList: "",
      flyingInsect: "",
    },
    {
      id: 18,
      date: "06 Jun 2023",
      type: "Treatment",
      serviceReport: "8624",
      baitStatus: "L",
      checkedList: "L",
      flyingInsect: "L",
    },
    {
      id: 19,
      date: "13 Jun 2023",
      type: "Treatment",
      serviceReport: "8651",
      baitStatus: "N",
      checkedList: "M",
      flyingInsect: "N",
    },
    {
      id: 20,
      date: "06 Jul 2023",
      type: "Treatment",
      serviceReport: "9755",
      baitStatus: "L",
      checkedList: "M",
      flyingInsect: "N",
    },
    {
      id: 21,
      date: "25 Jul 2023",
      type: "Treatment",
      serviceReport: "10089",
      baitStatus: "N",
      checkedList: "L",
      flyingInsect: "L",
    },
    {
      id: 22,
      date: "09 Aug 2023",
      type: "Treatment",
      serviceReport: "10158",
      baitStatus: "N",
      checkedList: "M",
      flyingInsect: "N",
    },
    {
      id: 23,
      date: "09 Aug 2023",
      type: "Spray Treatment",
      serviceReport: "10570",
      baitStatus: "N",
      checkedList: "L",
      flyingInsect: "L",
    },
    {
      id: 24,
      date: "13 Sep 2023",
      type: "Spray Treatment",
      serviceReport: "10891",
      baitStatus: "N",
      checkedList: "M",
      flyingInsect: "N",
    },
  ];

  const recommendations = [
    "Keep the UPC Treated area closed for at least 4 hours",
    "Maintain regular cleaning for the facility and specially for the infested areas",
    "Make sure to seal all the possible entrances/holes to eliminate the nesting of pests and entering of RATS",
    "Keep the lids in place and avoid spillage/wet waste in the transit areas",
    "Follow the recommendations and directions given by the team to eliminate the infestation or prevent future Pests problems.",
  ];

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Only show the PDF button */}
      <div className="w-full max-w-4xl mb-8 flex justify-center">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
        >
          Download PDF
        </button>
      </div>

      {/* Hidden report content for PDF generation */}
      <div className="hidden">
        <div
          ref={componentRef}
          className="w-full max-w-4xl mx-auto bg-white p-4"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="w-2/3">
              <h1 className="text-purple-800 font-bold text-2xl">
                {companyInfo.name}
              </h1>
              <p className="text-sm">{companyInfo.address}</p>
              <p className="text-sm">
                {companyInfo.city} - {companyInfo.poBox}
              </p>
              <p className="text-sm">
                Phone: {companyInfo.phone} - Email: {companyInfo.email}
              </p>
              <p className="text-sm">TRN: {companyInfo.trn}</p>
            </div>
            <div className="w-1/3 flex flex-col items-end">
              <div className="bg-purple-700 text-white px-4 py-2 text-center w-full">
                <p className="font-bold">PEST CONTROL</p>
                <p className="font-bold">VISITS RECORD</p>
              </div>
              <div className="mt-2">
                <img
                  src="/api/placeholder/150/80"
                  alt="PIPM Logo"
                  className="h-16"
                />
              </div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="mt-4">
            <div className="bg-purple-600 text-white px-4 py-1">
              <h2 className="font-semibold">Client Details</h2>
            </div>
            <div className="border border-gray-300 p-2">
              <p className="font-bold">{clientInfo.name}</p>
              <p>{clientInfo.date}</p>
              <p>PHONE: {clientInfo.phone}</p>
            </div>
          </div>

          {/* Customer ID and Contract Number Section */}
          <div className="mt-4 flex">
            <div className="w-2/3">
              <div className="bg-purple-700 text-white text-center py-1">
                <p>CUSTOMER ID</p>
              </div>
              <div className="border border-gray-300 text-center py-1">
                <p>{clientInfo.customerId}</p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-purple-700 text-white text-center py-1">
                <p>Contract #</p>
              </div>
              <div className="border border-gray-300 text-center py-1">
                <p>{clientInfo.contractNumber}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex">
            <div className="w-2/3">
              <div className="border border-gray-300 text-center py-1">
                <p>Total # of Visits Up to Date</p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="border border-gray-300 text-center py-1">
                <p>{clientInfo.totalVisits}</p>
              </div>
            </div>
          </div>

          {/* Contract Details Section */}
          <div className="mt-4">
            <div className="bg-black text-white px-4 py-1 text-center">
              <h2 className="font-semibold">DESCRIPTION</h2>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 w-1/3 border border-gray-300">
                    Description:
                  </td>
                  <td className="py-1 px-2 w-2/3 border border-gray-300 text-center">
                    {contractInfo.description}
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 border border-gray-300">
                    Contract Starting Date:
                  </td>
                  <td className="py-1 px-2 border border-gray-300 text-center">
                    {contractInfo.startingDate}
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 border border-gray-300">
                    Contract Expiry Date:
                  </td>
                  <td className="py-1 px-2 border border-gray-300 text-center">
                    {contractInfo.expiryDate}
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 border border-gray-300">
                    Type of Service:
                  </td>
                  <td className="py-1 px-2 border border-gray-300 text-center">
                    {contractInfo.typeOfService}
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 border border-gray-300">
                    Method of Treatment:
                  </td>
                  <td className="py-1 px-2 border border-gray-300 text-center">
                    {contractInfo.methodOfTreatment}
                  </td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="py-1 px-2 border border-gray-300">
                    Frequency:
                  </td>
                  <td className="py-1 px-2 border border-gray-300 text-center">
                    {contractInfo.frequency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visits Records Section */}
          <div className="mt-4">
            <div className="bg-black text-white px-4 py-1 text-center">
              <h2 className="font-semibold">Visits Records</h2>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-500">
                  <th className="border border-gray-300 py-1 px-2">SL</th>
                  <th className="border border-gray-300 py-1 px-2">Date</th>
                  <th className="border border-gray-300 py-1 px-2">
                    Type of Visit
                  </th>
                  <th className="border border-gray-300 py-1 px-2">
                    Service Report #
                  </th>
                  <th className="border border-gray-300 py-1 px-2">
                    Bait/Chemical of Infestation
                  </th>
                  <th className="border border-gray-300 py-1 px-2">
                    Checked List of Infestation
                  </th>
                  <th className="border border-gray-300 py-1 px-2">
                    Flying Insects/EFT of Infestation
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitsData.map((visit) => (
                  <tr key={visit.id}>
                    <td className="border border-gray-300 py-1 px-2 text-center">
                      {visit.id}
                    </td>
                    <td className="border border-gray-300 py-1 px-2">
                      {visit.date}
                    </td>
                    <td className="border border-gray-300 py-1 px-2 text-center text-blue-600">
                      {visit.type}
                    </td>
                    <td className="border border-gray-300 py-1 px-2 text-center">
                      {visit.serviceReport}
                    </td>
                    <td className="border border-gray-300 py-1 px-2 text-center">
                      {visit.baitStatus}
                    </td>
                    <td className="border border-gray-300 py-1 px-2 text-center">
                      {visit.checkedList}
                    </td>
                    <td className="border border-gray-300 py-1 px-2 text-center">
                      {visit.flyingInsect}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommendations Section */}
          <div className="mt-4">
            <div className="bg-purple-600 text-white px-4 py-1 text-center">
              <h2 className="font-semibold">Recommendations and Remarks:</h2>
            </div>
            <div className="border border-gray-300 p-2">
              <ul className="pl-6 list-disc">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="py-1">
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <img
              src="/api/placeholder/100/40"
              alt="PIPM Logo"
              className="h-12 mx-auto"
            />
            <div className="bg-purple-600 text-white px-4 py-1 mt-2">
              <p className="text-sm">
                If you have any query or complaints about this report, please
                contact
              </p>
              <p className="text-sm">04-3801800, OPERATIONS@PIPM.AE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestControlRecord;
