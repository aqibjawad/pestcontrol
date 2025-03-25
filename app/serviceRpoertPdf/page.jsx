"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import ClientRecords from "./clientRecords";
import { Grid, Button } from "@mui/material";
import styles from "../../styles/viewQuote.module.css";
import APICall from "@/networkUtil/APICall";
import { job } from "@/networkUtil/Constants";
import Layout from "../../components/layout";
import html2pdf from "html2pdf.js";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const api = new APICall();
  const [id, setId] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setQuoteList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      getAllJobs(id);
    }
  }, [id]);

  const getAllJobs = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${job}/service_report/${id}`
      );
      setQuoteList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Cloudinary Upload Function
  const uploadToCloudinary = async () => {
    try {
      setUploadingToCloudinary(true);

      // Generate PDF from a specific container instead of entire body
      const element = document.getElementById("pdf-container");
      const opt = {
        margin: [1, 0.5, 1, 0.5], // top, right, bottom, left margins in inches
        filename: `invoice_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          scrollX: 0,
          scrollY: -window.scrollY,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
          before: ".page-break",
        },
        header: function (pageNum, pageCount) {
          const headerElement = document.querySelector(".pdf-header");
          return headerElement ? headerElement.innerHTML : "";
        },
        footer: function (pageNum, pageCount) {
          const footerElement = document.querySelector(".pdf-footer");

          // Replace the placeholder with actual page numbers
          if (footerElement) {
            const pageNumberDiv = footerElement.querySelector(
              "div[data-page-number]"
            );
            if (pageNumberDiv) {
              pageNumberDiv.textContent = `Page ${pageNum} of ${pageCount}`;
            }
            return footerElement.innerHTML;
          }
          return "";
        },
      };

      // Generate PDF
      const file = await html2pdf().set(opt).from(element).outputPdf("blob");

      // Prepare FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file, `invoice_${Date.now()}.pdf`);
      formData.append("upload_preset", "pestcontrol"); // Your Cloudinary preset

      // Upload to Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/df59vjsv5/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      console.log("Upload success:", data);
      alert("Invoice uploaded successfully!");
      return data.secure_url;
    } catch (error) {
      console.error("Error in uploadToCloudinary:", error);
      alert("Failed to upload invoice. Please try again.");
      throw error;
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  return ( 
    <div id="pdf-container">
      <Layout>
        <ClientDetails serviceReportList={serviceReportList} />
        <ClientRecords serviceReportList={serviceReportList} />

        <div className="flex">
          <div className="flex-grow"></div>

          <div>
            <div className="mt-10 contractTable">Clients Signature</div>
            <img
              style={{ height: "100px", width: "100px" }}
              src={serviceReportList?.signature_img}
            />
          </div>
        </div>
      </Layout>

      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
        >
          Print
        </button>

        <Button
          variant="contained"
          color="primary"
          onClick={uploadToCloudinary}
          disabled={uploadingToCloudinary}
          fullWidth
        >
          {uploadingToCloudinary
            ? "Uploading..."
            : "Upload Invoice to Cloudinary"}
        </Button>
      </div>

      <style jsx global>{`
        @media print {
          .print-button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
