"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import MonthPicker from "../../hr/monthPicker";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Sales = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    const monthStr = dates.startDate.slice(0, 7);
    setSelectedMonth(monthStr);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_man/get/${selectedMonth}`
      );
      setSalesData(response?.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, [selectedMonth]);

  const renderSkeletonRows = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" width={80} />
          </TableCell>
        </TableRow>
      ));
  };

  // Function to format date for display
  const formatMonthYear = (dateString) => {
    const date = new Date(dateString + "-01");
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Function to handle PDF generation with correct logo aspect ratio
  const downloadPDF = () => {
    const doc = new jsPDF();
    const formattedMonth = formatMonthYear(selectedMonth);
    const title = `Sales Man Target - ${formattedMonth}`;

    // Add company logo with proper aspect ratio
    const img = new Image();
    img.src = "/logo.jpeg"; // Update with your actual logo path

    img.onload = function () {
      // Calculate aspect ratio to avoid stretching
      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;

      // Add logo with correct proportions
      doc.addImage(img, "PNG", 15, 10, imgWidth, imgHeight);

      // Add company name
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ACCURATE", 60, 20);
      doc.setFontSize(14);
      doc.text("PEST CONTROL SERVICES LLC", 60, 28);

      // Add title with month/year
      doc.setFontSize(16);
      doc.text(title, 15, imgHeight + 20);

      // Add current date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${date}`, 15, imgHeight + 30);

      // Create table data - excluding the View columns as requested
      const tableColumn = [
        "ID",
        "Salesman Name",
        "Contract Target",
        "Achieved Target",
        "Achieved Target %",
        "Remaining Target",
        "Income Target",
        "Cash Sales",
        "MTD Sales",
      ];

      const tableRows = salesData.map((row, index) => {
        // Calculate achieved target percentage
        const achievedPercentage =
          row?.emp_contract_targets?.[0]?.achieved_target &&
          row?.emp_contract_targets?.[0]?.base_target
            ? (
                (row.emp_contract_targets[0].achieved_target /
                  row.emp_contract_targets[0].base_target) *
                100
              ).toFixed(2)
            : "0";

        return [
          index + 1,
          row.name,
          row?.emp_contract_targets[0]?.contract_target || "",
          row?.emp_contract_targets[0]?.achieved_target || "",
          achievedPercentage + "%",
          row?.emp_contract_targets[0]?.remaining_target || "",
          row?.employee_commissions[0]?.target || "",
          row?.employee_commissions[0]?.sale || "",
          row?.completed_jobs_total || "",
        ];
      });

      // Convert table to PDF - excluding the View columns
      doc.autoTable({
        startY: imgHeight + 35,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [76, 175, 80] },
        columnStyles: {
          0: { cellWidth: 10 }, // ID column width
          1: { cellWidth: 30 }, // Name column width
        },
        didDrawPage: function (data) {
          // Add page numbers
          doc.setFontSize(10);
          doc.text(
            `Page ${doc.internal.getNumberOfPages()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      // Save PDF
      doc.save(`accurate_sales_target_${selectedMonth}.pdf`);
    };

    // Handle potential error
    img.onerror = function () {
      console.error("Error loading logo image");
      // Generate PDF without logo
      generatePDFWithoutLogo(doc, title);
    };
  };

  // Backup function if logo can't be loaded
  const generatePDFWithoutLogo = (doc, title) => {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ACCURATE PEST CONTROL", 15, 20);
    doc.text(title, 15, 40);

    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 15, 50);

    // Create table data - excluding the View columns
    const tableColumn = [
      "ID",
      "Salesman Name",
      "Contract Target",
      "Achieved Target",
      "Achieved Target %",
      "Remaining Target",
      "Income Target",
      "Cash Sales",
      "MTD Sales",
    ];

    const tableRows = salesData.map((row, index) => {
      const achievedPercentage =
        row?.emp_contract_targets?.[0]?.achieved_target &&
        row?.emp_contract_targets?.[0]?.base_target
          ? (
              (row.emp_contract_targets[0].achieved_target /
                row.emp_contract_targets[0].base_target) *
              100
            ).toFixed(2)
          : "0";

      return [
        index + 1,
        row.name,
        row?.emp_contract_targets[0]?.contract_target || "",
        row?.emp_contract_targets[0]?.achieved_target || "",
        achievedPercentage + "%",
        row?.emp_contract_targets[0]?.remaining_target || "",
        row?.employee_commissions[0]?.target || "",
        row?.employee_commissions[0]?.sale || "",
        row?.completed_jobs_total || "",
      ];
    });

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [76, 175, 80] },
    });

    doc.save(`accurate_sales_target_${selectedMonth}.pdf`);
  };

  return (
    <div>
      <div className="pageTitle">Sales Man Target</div>

      <div className="flex justify-between items-center mb-4">
        <MonthPicker onDateChange={handleDateChange} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={downloadPDF}
          disabled={fetchingData}
          style={{ backgroundColor: "#4CAF50" }}
        >
          Download PDF
        </Button>
      </div>

      <TableContainer className="mt-5" component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4CAF50" }}>
            <TableRow>
              <TableCell style={{ color: "white" }}>ID</TableCell>
              <TableCell style={{ color: "white" }}>Salesman Name</TableCell>
              <TableCell style={{ color: "white" }}>Contract Target</TableCell>
              <TableCell style={{ color: "white" }}>Achieved Target</TableCell>
              <TableCell style={{ color: "white" }}>
                Achieved Target %{" "}
              </TableCell>
              <TableCell style={{ color: "white" }}>
                {" "}
                Reamaining Target{" "}
              </TableCell>
              <TableCell style={{ color: "white" }}> Income Target </TableCell>
              <TableCell style={{ color: "white" }}>
                {" "}
                Cash Sales{" "}
              </TableCell>
              <TableCell style={{ color: "white" }}> MTD Sales</TableCell>
              <TableCell style={{ color: "white" }}>View Visits</TableCell>
              <TableCell style={{ color: "white" }}>View Jobs</TableCell>
              <TableCell style={{ color: "white" }}>View Incomes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row?.emp_contract_targets[0]?.contract_target}
                    </TableCell>
                    <TableCell>
                      {row?.emp_contract_targets[0]?.achieved_target}
                    </TableCell>
                    <TableCell>
                      {row?.emp_contract_targets?.[0]?.achieved_target &&
                      row?.emp_contract_targets?.[0]?.base_target
                        ? (
                            (row.emp_contract_targets[0].achieved_target /
                              row.emp_contract_targets[0].base_target) *
                            100
                          ).toFixed(2)
                        : "0"}
                    </TableCell>

                    <TableCell>
                      {row?.emp_contract_targets[0]?.remaining_target}
                    </TableCell>
                    <TableCell>
                      {row?.employee_commissions[0]?.target}
                    </TableCell>
                    <TableCell>{row?.employee_commissions[0]?.sale}</TableCell>
                    <TableCell>{row?.completed_jobs_total}</TableCell>
                    <TableCell>
                      <Link
                        href={`/salesOfficer/viewVisits?id=${
                          row?.id
                        }&name=${encodeURIComponent(row?.name)}`}
                      >
                        View Visits
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/salesOfficer/viewJobs?id=${row?.id}`}>
                        View Jobs
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/salesOfficer/viewIncoms?id=${row?.id}`}>
                        View Incomes
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sales;
