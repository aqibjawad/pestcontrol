"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import ClientRecords from "./clientRecords";
import { Grid, Button } from "@mui/material";
import styles from "../../styles/viewQuote.module.css";
import APICall from "@/networkUtil/APICall";
import { job, sendEmail } from "@/networkUtil/Constants";
import Layout2 from "../../components/layout2";
import html2pdf from "html2pdf.js";

const invoiceData = {
  companyDetails: {
    name: "Accurate Pest Control Services LLC",
    address: "Office 12, Building # Greece K-12, International City Dubai",
    email: "accuratepestcontrolcl.ae",
    phone: "+971 52 449 6173",
  },
};

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

  // console.log(serviceReportList?.job?.quote?.branch);

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
      const filename = `invoice_${Date.now()}.pdf`;
      const opt = {
        filename: filename,
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

      await html2pdf().set(opt).from(element).save();

      // Generate PDF as blob and convert to File object
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });

      const data = {
        user_id: serviceReportList?.job?.user?.id,
        subject: "Invoice PDF",
        file: pdfFile,
        html: `
        <h1> ${serviceReportList?.job?.user?.name} </h1>
        <h1> Invoice Id: ${serviceReportList?.job?.service_invoice?.id} </h1>
        <a href="" > View Service Report </a>
        <footer style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">        
          <div style="margin-top: 15px; font-size: 0.9em; color: #333;">
            <h4> Accurate Pest Control Services LLC </h4>
            <p style="margin: 5px 0;"> Office 12, Building # Greece K-12, International City Dubai </p>
            <p style="margin: 5px 0;">
              Email: accuratepestcontrolcl.ae | Phone: +971 52 449 6173
            </p>
          </div>
        </footer>
        `,
      };

      // Make the API call
      const response = await api.postFormDataWithToken(`${sendEmail}`, data);

      if (response.status !== "success") {
        throw new Error(`Upload failed: ${response.message}`);
      }
      alert("Invoice send successfully!");

      return response;
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
      <Layout2 branchId={serviceReportList?.job?.quote?.branch?.id}>
        <ClientDetails serviceReportList={serviceReportList} /> <hr />
        <ClientRecords serviceReportList={serviceReportList} />

        <div className="flex">
          <div className="flex-grow"></div>

          <div>
            <div className="mt-5 contractTable">Clients Signature</div>
            <img
              style={{ height: "100px", width: "100%", objectFit:"contain" }}
              src={serviceReportList?.signature_img}
            />
          </div>
        </div>
      </Layout2>

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
          {uploadingToCloudinary ? "Uploading..." : "Send Email"}
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
