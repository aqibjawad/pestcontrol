"use client";

import React, { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { sendEmail } from "@/networkUtil/Constants";

const ServiceReportForm = () => {
  const api = new APICall();

  const [visitType, setVisitType] = useState("regular");
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);
  const router = useRouter();

  const handleVisitTypeChange = (type) => {
    setVisitType(type);
  };

  const uploadToCloudinary = async () => {
    try {
      setUploadingToCloudinary(true);

      // Generate PDF from a specific container
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

      // Dynamically import html2pdf
      const html2pdfInstance = await import("html2pdf.js");
      const html2pdf = html2pdfInstance.default || html2pdfInstance;

      // Generate PDF directly as blob for the email without saving locally
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf("blob");

      const pdfFile = new File([pdfBlob], filename, {
        type: "application/pdf",
      });

      // Prepare your data object for the API call
      // Replace this with your actual data structure needed for the API
      const data = new FormData();
      data.append("pdf", pdfFile);
      data.append("filename", filename);
      // Add any other fields you need to send

      // Make the API call
      // Replace 'api' and 'sendEmail' with your actual API call method and endpoint
      const response = await api.postFormDataWithToken(`${sendEmail}`, data);

      if (response.status !== "success") {
        throw new Error(`Upload failed: ${response.message}`);
      }

      alert("Service Report sent successfully!");
      router.back();
      return response;
    } catch (error) {
      console.error("Error in uploadToCloudinary:", error);
      alert("Failed to upload service report. Please try again.");
      throw error;
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        id="pdf-container"
        className="border border-black mt-8 mx-auto"
        style={{
          width: "794px", // Standard A4 width (210mm at 96 DPI)
          border: "1px solid black",
          padding: "1rem",
        }}
      >
        <div className="p-4 border-b space-y-6">
          {/* Top Header with SERVICE REPORT and cities */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center w-full">
              <div className="bg-black text-white font-bold px-4 py-1 rounded">
                SERVICE REPORT
              </div>
              <div className="flex gap-4 mt-2">
                {["Dubai", "Sharjah", "Ajman"].map((city) => (
                  <div className="flex items-center gap-1" key={city}>
                    <span>{city}</span>
                    <div className="w-4 h-4 border border-black rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* No. and Date */}
            <div className="text-sm text-left space-y-1">
              <div>
                <span className="font-semibold">No.</span>
              </div>
              <div>
                <span className="font-semibold">Date:</span>
                <span className="inline-block ml-2 border-b border-black w-24"></span>
              </div>
            </div>
          </div>

          {/* Logo & Municipality section */}
          <div className="flex justify-between items-start">
            {/* Left: Logo & Municipality */}
            <div className="flex gap-8">
              <div>
                <img
                  src="/Logo Sharjah Ajman UAE.png"
                  style={{ width: "200px", height: "100px" }}
                  alt="Logo"
                />
              </div>
              <div>
                <img
                  src="/approved_by_logo.svg"
                  style={{ width: "200px", height: "100px" }}
                  alt="Approved By Logo"
                />
              </div>
            </div>

            {/* Right: Client Info */}
            <div className="text-sm space-y-2">
              <div>
                <span className="font-semibold">Client Name:</span>
                <span className="border-b border-black inline-block w-40 ml-2"></span>
              </div>
              <div>
                <span className="font-semibold">Facility Covered:</span>
                <span className="border-b border-black inline-block w-32 ml-2"></span>
              </div>
              <div>
                <span className="font-semibold">Address:</span>
                <span className="border-b border-black inline-block w-48 ml-2"></span>
              </div>
              <div>
                <span className="font-semibold">Contact No:</span>
                <span className="border-b border-black inline-block w-40 ml-2"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Type */}
        <div className="mb-2 p-2 overflow-x-auto">
          <div className="font-bold mb-1 whitespace-nowrap text-xs">
            Type of Visits:
          </div>
          <div className="flex flex-nowrap items-center gap-1">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("regular")}
            >
              <span className="mr-1 text-xs">Regular Treatment (Contract)</span>
              {visitType === "regular" ? (
                <CheckSquare size={12} className="text-gray-700" />
              ) : (
                <Square size={12} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("inspection")}
            >
              <span className="mr-1 text-xs">Inspection Visit (Contract)</span>
              {visitType === "inspection" ? (
                <CheckSquare size={12} className="text-gray-700" />
              ) : (
                <Square size={12} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("complainContract")}
            >
              <span className="mr-1 text-xs">Complain (Contract)</span>
              {visitType === "complainContract" ? (
                <CheckSquare size={12} className="text-gray-700" />
              ) : (
                <Square size={12} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("oneTime")}
            >
              <span className="mr-1 text-xs">One Time</span>
              {visitType === "oneTime" ? (
                <CheckSquare size={12} className="text-gray-700" />
              ) : (
                <Square size={12} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("complainOTT")}
            >
              <span className="mr-1 text-xs">Complain (OTT)</span>
              {visitType === "complainOTT" ? (
                <CheckSquare size={12} className="text-gray-700" />
              ) : (
                <Square size={12} className="text-gray-700" />
              )}
            </div>
            <div className="flex items-center">
              <span className="mr-1 text-xs">Time In___ Time out___</span>
            </div>
          </div>
        </div>

        {/* First table - reduced row height */}
        <table className="border-collapse border border-gray-800 w-full">
          <thead>
            <tr>
              <th className="border border-gray-800 p-1 w-1/4 text-center font-bold text-sm">
                Inspected Areas
                <br />
                (Premises Covered)
              </th>
              <th className="border border-gray-800 p-1 w-1/4 text-center font-bold text-sm">
                Pests Found
              </th>
              <th className="border border-gray-800 p-1 w-1/4 text-center font-bold text-sm">
                Infestation
                <br />
                Level
              </th>
              <th className="border border-gray-800 p-1 w-1/5 text-center font-bold text-sm">
                Report Details & Follow Up Details
              </th>
              <th className="border border-gray-800 p-1 w-1/5 text-center font-bold text-sm">
                Special Recommendations
              </th>
            </tr>
          </thead>
          <tbody>
            {/* First row - reduced height */}
            <tr>
              <td className="border border-gray-800 p-1 h-20" />
              <td className="border border-gray-800 p-1" />
              <td className="border border-gray-800 p-1">
                <div className="flex items-center mb-1">
                  <span className="w-16 text-xs">Low</span>
                  <input type="checkbox" className="ml-1" />
                </div>
                <div className="flex items-center mb-1">
                  <span className="w-16 text-xs">Medium</span>
                  <input type="checkbox" className="ml-1" />
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-xs">High</span>
                  <input type="checkbox" className="ml-1" />
                </div>
              </td>
              <td className="border border-gray-800 p-1" rowSpan="2">
                <div className="p-1 text-xs">Special Recommendations:</div>
              </td>
              <td className="border border-gray-800 p-1" rowSpan="2"></td>
            </tr>

            {/* Second row - reduced height */}
            <tr>
              <td className="border border-gray-800 p-1 h-20" />
              <td className="border border-gray-800 p-1" />
              <td className="border border-gray-800 p-1">
                <div className="flex items-center mb-1">
                  <span className="w-16 text-xs">Low</span>
                  <input type="checkbox" className="ml-1" />
                </div>
                <div className="flex items-center mb-1">
                  <span className="w-16 text-xs">Medium</span>
                  <input type="checkbox" className="ml-1" />
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-xs">High</span>
                  <input type="checkbox" className="ml-1" />
                </div>
              </td>
            </tr>

            {/* Main Infested Areas row - reduced height */}
            <tr>
              <td className="border border-gray-800 p-1 h-12 font-bold text-center text-sm">
                Main Infested Areas
              </td>
              <td className="border border-gray-800 p-1" colSpan="4" />
            </tr>
          </tbody>
        </table>

        {/* Second table - reduced row height */}
        <div className="mt-2">
          <table className="border-collapse border border-gray-800 w-full">
            <thead>
              <tr>
                <th className="border border-gray-800 p-1 text-center font-bold text-sm">
                  Premises Served For:
                </th>
                <th className="border border-gray-800 p-1 text-center font-bold text-sm">
                  Types of Treatment
                </th>
                <th className="border border-gray-800 p-1 text-center font-bold text-sm">
                  Chemical & Material Used
                </th>
                <th className="border border-gray-800 p-1 text-center font-bold text-sm">
                  Dose
                </th>
                <th className="border border-gray-800 p-1 text-center font-bold text-sm">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-1 align-top">
                  <div className="grid grid-cols-2 gap-x-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Roache</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Mosquito</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Fruit Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Bedbug</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Store Insect</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Ants</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Drain Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Rats</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>House Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Birds</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Termite</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Lizards</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Snakes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Others</span>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-800 p-1 align-top">
                  <div className="grid grid-cols-2 gap-x-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Spray T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Gel T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Fogging</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Mist</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Fumigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>ULV</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Mechanical T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Dust</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Termite T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Birds Control</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 border border-gray-800 mr-1"></div>
                      <span>Other:</span>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-800 p-1 align-top"></td>
                <td className="border border-gray-800 p-1 align-top"></td>
                <td className="border border-gray-800 p-1 align-top"></td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-1" colSpan="2">
                  <div className="font-bold text-xs">
                    Recommendations and Remarks:
                  </div>
                  <div className="text-xs mt-1">
                    <p className="m-0">
                      Keep the Gel in place and avoid washing with water in the
                      treated areas.
                    </p>
                    <p className="m-0">
                      Keep the APC Product and discard for at least 4 hours.
                    </p>
                    <p className="m-0">
                      Maintain a regular cleaning for the facility and specially
                      for the infected areas.
                    </p>
                    <p className="m-0">
                      Close any gaps and do the needed maintenance jobs
                      eliminate the nesting of pests and entering of RATS.
                    </p>
                    <p className="m-0">
                      Follow the recommendations and directions given by the
                      team to minimize the infestation or prevent future pests
                      problems.
                    </p>
                  </div>
                </td>
                <td
                  className="border border-gray-800 p-1 align-top"
                  colSpan="3"
                >
                  <div className="grid grid-cols-3">
                    <div className="col-span-2 pr-2">
                      <div className="font-bold text-xs">Client Signature</div>
                      <div className="h-12"></div>
                    </div>
                    <div className="border-l border-gray-800 pl-2">
                      <div className="font-bold text-center text-xs">
                        Accurate pest control services LLC
                      </div>
                      <div className="font-bold text-center mt-1 text-xs">
                        Supervisor Name & Signature
                      </div>
                      <div className="h-6"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add a button to trigger the PDF generation and upload */}
      <button
        className="bg-blue-600 text-white py-2 px-6 rounded mt-6 hover:bg-blue-700 transition-colors"
        onClick={uploadToCloudinary}
        disabled={uploadingToCloudinary}
      >
        {uploadingToCloudinary ? "Processing..." : "Generate & Send Report"}
      </button>
    </div>
  );
};

export default ServiceReportForm;
