"use client";

import React, { useState, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import styles from "../../../styles/loginStyles.module.css";
import { getAllSuppliers } from "@/networkUtil/Constants";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Generate PDF function
const generatePDF = async () => {
  const input = document.getElementById("supplierTable");
  if (!input) return;

  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF();

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -heightLeft, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("suppliers.pdf");
};

const listTable = (data) => {
  return (
    <div className={tableStyles.tableContainer} id="supplierTable">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              Sr.
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Supplier
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Company
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Email
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              TRN
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              VAT
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              HSN
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Zip
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{index + 1}</td>
              <td className="py-2 px-4">{row.supplier_name}</td>
              <td className="py-2 px-4">{row.company_name}</td>
              <td className="py-2 px-4">{row.email}</td>
              <td className="py-2 px-4">{row.trn_no}</td>
              <td className="py-2 px-4">{row.vat}</td>
              <td className="py-2 px-4">{row.hsn}</td>
              <td className="py-2 px-4">{row.zip}</td>
              <td className="py-2 px-4">
                <Link href={`/account/supplier_ledger?id=${row.id}`}>
                  <span className="text-blue-600 hover:text-blue-800">
                    View Details
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViewSuppliers = () => {
  const api = new APICall();

  useEffect(() => {
    getAllSuppliere();
  }, []);

  const getAllSuppliere = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${getAllSuppliers}`);
      setSupplierList(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const [fetchingData, setFetchingData] = useState(false);
  const [supplierList, setSupplierList] = useState([]);

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Suppliers
        </div>
        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
              <SearchInput />
            </div>
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "100px",
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
              Filters
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              onClick={generatePDF}
              style={{
                marginTop: "2rem",
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                height: "44px",
                width: "202px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                padding: "12px, 16px, 12px, 16px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Download all
            </div>
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "black",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "44px",
                width: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
                borderRadius: "10px",
              }}
            >
              <Link href="/account/addSuppliers">Add</Link>
            </div>
            {/* <button
              onClick={generatePDF}
              style={{
                marginTop: "2rem",
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                height: "44px",
                width: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
                borderRadius: "10px",
                border: "none",
              }}
            >
              Download PDF
            </button> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {fetchingData ? <div>Loading...</div> : listTable(supplierList)}
        </div>
      </div>
    </div>
  );
};

export default ViewSuppliers;
