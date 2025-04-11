"use client";

import React, { useState, useEffect } from "react";
import ClientDetails from "./clientDetails";
import ClientRecords from "./clientRecords";
import { Grid, Button, Typography, CircularProgress } from "@mui/material";
import styles from "../../styles/viewQuote.module.css";
import APICall from "@/networkUtil/APICall";
import { job, sendEmail } from "@/networkUtil/Constants";
import Layout2 from "../../components/layout2";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Import html2pdf dynamically
const Html2PdfWrapper = dynamic(
  () =>
    import("html2pdf.js").then((mod) => ({
      default: mod.default || mod,
    })),
  { ssr: false }
);

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
  const router = useRouter();

  const [id, setId] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [serviceReportList, setQuoteList] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  // New useEffect to automatically send email when data is loaded
  useEffect(() => {
    if (serviceReportList && !loadingDetails && !emailSent) {
      // Only run once when data is loaded
      handleAutoSendEmail();
    }
  }, [serviceReportList, loadingDetails, emailSent]);

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

  // Auto send email function
  const handleAutoSendEmail = async () => {
    try {
      await uploadToCloudinary();
      setEmailSent(true);
    } catch (error) {
      console.error("Error in auto sending email:", error);
    }
  };

  // Cloudinary Upload Function
  const uploadToCloudinary = async () => {
    try {
      setUploadingToCloudinary(true);

      // Generate PDF from a specific container instead of entire body
      const element = document.getElementById("pdf-container");
      const filename = `servicereport_${Date.now()}.pdf`;

      // Setup options for PDF generation
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
      };

      // Use the library properly by importing the actual html2pdf module
      const html2pdfInstance = await import("html2pdf.js");
      const html2pdf = html2pdfInstance.default || html2pdfInstance;

      // await html2pdf().from(element).set(opt).save();

      // Generate PDF directly as blob for the email without saving locally
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });

      const data = {
        user_id: serviceReportList?.job?.user?.id,
        subject: "Service Report",
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
      alert("Service Report sent successfully!");
      router.back("/");
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
    <>
      {/* Loading overlay that shows when uploading to Cloudinary */}
      {uploadingToCloudinary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <CircularProgress size={40} />
            <Typography variant="h6" className="mt-4">
              Preparing invoice and sending email...
            </Typography>
            <Typography variant="body2" className="mt-2">
              Please do not close this window
            </Typography>
          </div>
        </div>
      )}

      <div id="pdf-container">
        <Layout2 branchId={serviceReportList?.job?.quote?.branch?.id}>
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "-5rem",
              color: "#32A92E",
            }}
          >
            Service Report
          </div>
          <ClientDetails serviceReportList={serviceReportList} /> <hr />
          <ClientRecords serviceReportList={serviceReportList} />
          <div className="flex">
            <div className="flex-grow"></div>

            <div>
              <div className="mt-5 contractTable">Clients Signature</div>
              <img
                style={{ height: "100px", width: "100%", objectFit: "contain" }}
                src={serviceReportList?.signature_img}
              />
            </div>
          </div>
          <div
            style={{
              fontSize: "10px",
              marginTop: "2rem",
              color: "#555",
              marginTop: "10rem",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "12px" }}>
              Recommendations
            </div>
            <p>
              • Avoid washing the treated area or removing the gel. <br /> •
              Keep GPC-treated area closed for 4+ hrs. <br /> • Maintain
              cleanliness, especially in infested zones. <br /> • Seal gaps and
              fix maintenance issues to stop pest/rats nesting. <br /> • Follow
              our team’s advice to reduce or prevent future infestations.
            </p>
          </div>
        </Layout2>

        {/* <div className="fixed bottom-4 right-4 flex flex-col space-y-2 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
          >
            Print
          </button>
        </div> */}

        <style jsx global>{`
          @media print {
            .print-button {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Page;
