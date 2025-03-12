"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Button
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import YearPicker from "../../../components/yearPicker";
import Link from "next/link";
import APICall from "@/networkUtil/APICall";
import { getAllEmpoyesUrl } from "@/networkUtil/Constants";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const YearSale = () => {
  const api = new APICall();

  const [salesData, setSalesData] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [companyLogo, setCompanyLogo] = useState("/logo.jpeg"); // Update this with your logo path

  // Initialize with current year instead of month
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const handleDateChange = (dates) => {
    if (!dates || !dates.startDate) return;
    // Extract only the year from the date
    const year = dates.startDate.slice(0, 4);
    setSelectedYear(year);
  };

  const getAllEmployees = async () => {
    setFetchingData(true);
    try {
      // Updated API call to pass only the year
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_man/get/${selectedYear}`
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
  }, [selectedYear]);

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
        </TableRow>
      ));
  };

  // Function to handle PDF generation with correct logo aspect ratio
  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = `YTD Sales Report - ${selectedYear}`;
    
    // Add company logo with proper aspect ratio
    const img = new Image();
    img.src = "/logo.jpeg"; // Update with your actual logo path
    
    img.onload = function() {
      // Calculate aspect ratio to avoid stretching
      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;
      
      // Add logo with correct proportions
      doc.addImage(img, 'PNG', 15, 10, imgWidth, imgHeight);
      
      // Add company name
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ACCURATE", 60, 20);
      doc.setFontSize(14);
      doc.text("PEST CONTROL SERVICES LLC", 60, 28);
      
      // Add title with year
      doc.setFontSize(16);
      doc.text(title, 15, imgHeight + 20);
      
      // Add current date
      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${date}`, 15, imgHeight + 30);
      
      // Convert table to PDF
      doc.autoTable({
        startY: imgHeight + 35,
        head: [['ID', 'Sales Man Name', 'YTD Sales']],
        body: salesData.map((row, index) => [
          index + 1,
          row.name,
          row.completed_jobs_total
        ]),
        theme: 'grid',
        headStyles: { fillColor: [76, 175, 80] }
      });
      
      // Save PDF
      doc.save(`accurate_ytd_sales_${selectedYear}.pdf`);
    };
    
    // Handle potential error
    img.onerror = function() {
      console.error("Error loading logo image");
      // Generate PDF without logo
      generatePDFWithoutLogo(doc, title);
    };
  };
  
  // Backup function if logo can't be loaded
  const generatePDFWithoutLogo = (doc, title) => {
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 15, 50);
    
    doc.autoTable({
      startY: 60,
      head: [['ID', 'Sales Man Name', 'YTD Sales']],
      body: salesData.map((row, index) => [
        index + 1,
        row.name,
        row.completed_jobs_total
      ]),
      theme: 'grid',
      headStyles: { fillColor: [76, 175, 80] }
    });
    
    doc.save(`accurate_ytd_sales_${selectedYear}.pdf`);
  };

  return (
    <div>
      <div className="pageTitle"> YTD Sales </div>
      
      <div className="flex justify-between items-center mb-4">
        <YearPicker onDateChange={handleDateChange} />
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
              <TableCell style={{ color: "white" }}>Sales Man Name</TableCell>
              <TableCell style={{ color: "white" }}> YTD Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData
              ? renderSkeletonRows()
              : salesData?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row?.completed_jobs_total}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default YearSale;