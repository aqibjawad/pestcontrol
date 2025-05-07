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
          orientation: "portrait", // Changed to portrait for single page
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
      const data = {
        user_id: 22,
        subject: "Service Report",
        file: pdfFile,
        html: `
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

      // Replace 'api' and 'sendEmail' with your actual API call method and endpoint
      const response = await api.postFormDataWithToken(`${sendEmail}`, data);

      if (response.status !== "success") {
        throw new Error(`Upload failed: ${response.message}`);
      }

      alert("Service Report sent successfully!");
      // router.back();
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
        className="border border-black mt-4 mx-auto"
        style={{
          width: "816px", // Standard Letter portrait width (8.5 inches at 96 DPI)
          border: "1px solid black",
          padding: "0.5rem",
        }}
      >
        <div className="p-1 border-b space-y-2">
          {/* Top Header with SERVICE REPORT and cities */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center w-full">
              <div className="bg-black text-white font-bold px-3 py-0.5 rounded text-sm">
                SERVICE REPORT
              </div>
              <div className="flex gap-3 mt-1">
                {["Dubai", "Sharjah", "Ajman"].map((city) => (
                  <div className="flex items-center gap-1" key={city}>
                    <span className="text-xs">{city}</span>
                    <div className="w-3 h-3 border border-black rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* No. and Date */}
            <div className="text-xs text-left space-y-0.5">
              <div>
                <span className="font-semibold">No.</span>
              </div>
              <div>
                <span className="font-semibold">Date:</span>
                <span className="inline-block ml-1 border-b border-black w-20"></span>
              </div>
            </div>
          </div>

          {/* Logo & Municipality section */}
          <div className="flex justify-between items-start">
            {/* Left: Logo & Municipality */}
            <div className="flex gap-4">
              <div>
                <img
                  src="/Logo Sharjah Ajman UAE.png"
                  style={{ width: "150px", height: "70px" }}
                  alt="Logo"
                />
              </div>
              <div>
                <img
                  src="/approved_by_logo.svg"
                  style={{ width: "150px", height: "70px" }}
                  alt="Approved By Logo"
                />
              </div>
            </div>

            {/* Right: Client Info */}
            <div className="text-xs space-y-1">
              <div>
                <span className="font-semibold">Client Name:</span>
                <span className="border-b border-black inline-block w-36 ml-1"></span>
              </div>
              <div>
                <span className="font-semibold">Facility Covered:</span>
                <span className="border-b border-black inline-block w-28 ml-1"></span>
              </div>
              <div>
                <span className="font-semibold">Address:</span>
                <span className="border-b border-black inline-block w-40 ml-1"></span>
              </div>
              <div>
                <span className="font-semibold">Contact No:</span>
                <span className="border-b border-black inline-block w-36 ml-1"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Type */}
        <div className="mb-1 p-1 overflow-x-auto">
          <div className="font-bold whitespace-nowrap text-xs mb-0.5">
            Type of Visits:
          </div>
          <div className="flex flex-nowrap items-center gap-2 text-xs">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("regular")}
            >
              <span className="mr-0.5 text-xs">
                Regular Treatment (Contract)
              </span>
              {visitType === "regular" ? (
                <CheckSquare size={10} className="text-gray-700" />
              ) : (
                <Square size={10} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("inspection")}
            >
              <span className="mr-0.5 text-xs">
                Inspection Visit (Contract)
              </span>
              {visitType === "inspection" ? (
                <CheckSquare size={10} className="text-gray-700" />
              ) : (
                <Square size={10} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("complainContract")}
            >
              <span className="mr-0.5 text-xs">Complain (Contract)</span>
              {visitType === "complainContract" ? (
                <CheckSquare size={10} className="text-gray-700" />
              ) : (
                <Square size={10} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("oneTime")}
            >
              <span className="mr-0.5 text-xs">One Time</span>
              {visitType === "oneTime" ? (
                <CheckSquare size={10} className="text-gray-700" />
              ) : (
                <Square size={10} className="text-gray-700" />
              )}
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleVisitTypeChange("complainOTT")}
            >
              <span className="mr-0.5 text-xs">Complain (OTT)</span>
              {visitType === "complainOTT" ? (
                <CheckSquare size={10} className="text-gray-700" />
              ) : (
                <Square size={10} className="text-gray-700" />
              )}
            </div>
            <div className="flex items-center">
              <span className="text-xs">Time In___ Time out___</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          {/* Left column - First table */}
          <div className="w-1/2">
            <table className="border-collapse border border-gray-800 w-full text-xs">
              <thead>
                <tr>
                  <th className="border border-gray-800 p-0.5 w-1/4 text-center font-bold text-xs">
                    Inspected Areas
                    <br />
                    (Premises Covered)
                  </th>
                  <th className="border border-gray-800 p-0.5 w-1/4 text-center font-bold text-xs">
                    Pests Found
                  </th>
                  <th className="border border-gray-800 p-0.5 w-1/4 text-center font-bold text-xs">
                    Infestation
                    <br />
                    Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* First row - reduced height */}
                <tr>
                  <td className="border border-gray-800 p-0.5 h-10" />
                  <td className="border border-gray-800 p-0.5" />
                  <td className="border border-gray-800 p-0.5">
                    <div className="flex items-center mb-0.5">
                      <span className="w-12 text-xs">Low</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                    <div className="flex items-center mb-0.5">
                      <span className="w-12 text-xs">Medium</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                    <div className="flex items-center">
                      <span className="w-12 text-xs">High</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                  </td>
                </tr>

                {/* Second row - reduced height */}
                <tr>
                  <td className="border border-gray-800 p-0.5 h-10" />
                  <td className="border border-gray-800 p-0.5" />
                  <td className="border border-gray-800 p-0.5">
                    <div className="flex items-center mb-0.5">
                      <span className="w-12 text-xs">Low</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                    <div className="flex items-center mb-0.5">
                      <span className="w-12 text-xs">Medium</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                    <div className="flex items-center">
                      <span className="w-12 text-xs">High</span>
                      <input type="checkbox" className="ml-0.5 scale-75" />
                    </div>
                  </td>
                </tr>

                {/* Main Infested Areas row - reduced height */}
                <tr>
                  <td className="border border-gray-800 p-0.5 h-8 font-bold text-center text-xs">
                    Main Infested Areas
                  </td>
                  <td className="border border-gray-800 p-0.5" colSpan="2" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right column - Report details */}
          <div className="w-1/2">
            <table className="border-collapse border border-gray-800 w-full h-full text-xs">
              <thead>
                <tr>
                  <th className="border border-gray-800 p-0.5 w-1/2 text-center font-bold text-xs">
                    Report Details & Follow Up Details
                  </th>
                  <th className="border border-gray-800 p-0.5 w-1/2 text-center font-bold text-xs">
                    Special Recommendations
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-0.5 align-top">
                    <div className="p-0.5 text-xs">
                      Special Recommendations:
                    </div>
                  </td>
                  <td className="border border-gray-800 p-0.5 align-top"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Second table - reduced row height */}
        <div className="mt-1">
          <table className="border-collapse border border-gray-800 w-full text-xs">
            <thead>
              <tr>
                <th className="border border-gray-800 p-0.5 text-center font-bold text-xs">
                  Premises Served For:
                </th>
                <th className="border border-gray-800 p-0.5 text-center font-bold text-xs">
                  Types of Treatment
                </th>
                <th className="border border-gray-800 p-0.5 text-center font-bold text-xs">
                  Chemical & Material Used
                </th>
                <th className="border border-gray-800 p-0.5 text-center font-bold text-xs">
                  Dose
                </th>
                <th className="border border-gray-800 p-0.5 text-center font-bold text-xs">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-0.5 align-top">
                  <div className="grid grid-cols-3 gap-0.5 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Roache</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Mosquito</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Fruit Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Bedbug</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Store Insect</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Ants</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Drain Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Rats</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">House Flies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Birds</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Termite</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Lizards</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Snakes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Others</span>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-800 p-0.5 align-top">
                  <div className="grid grid-cols-2 gap-0.5 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Spray T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Gel T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Fogging</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Mist</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Fumigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">ULV</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Mechanical T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Dust</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Termite T</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Birds Control</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 border border-gray-800 mr-0.5"></div>
                      <span className="text-xs">Other:</span>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-800 p-0.5 align-top"></td>
                <td className="border border-gray-800 p-0.5 align-top"></td>
                <td className="border border-gray-800 p-0.5 align-top"></td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-0.5" colSpan="5">
                  <div className="flex">
                    <div className="w-1/2 pr-1">
                      <div className="font-bold text-xs">
                        Recommendations and Remarks:
                      </div>
                      <div className="text-xs mt-0.5 text-xs space-y-0.5">
                        <p className="m-0">
                          Keep the Gel in place and avoid washing with water in
                          the treated areas.
                        </p>
                        <p className="m-0">
                          Keep the APC Product and discard for at least 4 hours.
                        </p>
                        <p className="m-0">
                          Maintain a regular cleaning for the facility and
                          specially for the infected areas.
                        </p>
                        <p className="m-0">
                          Close any gaps and do the needed maintenance jobs
                          eliminate the nesting of pests and entering of RATS.
                        </p>
                        <p className="m-0">
                          Follow the recommendations and directions given by the
                          team to minimize the infestation or prevent future
                          pests problems.
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2 pl-1 border-l border-gray-800">
                      <div className="grid grid-cols-3">
                        <div className="col-span-2 pr-1">
                          <div className="font-bold text-xs">
                            Client Signature
                          </div>
                          <div className="h-8"></div>
                        </div>
                        <div className="border-l border-gray-800 pl-1">
                          <div className="font-bold text-center text-xs">
                            Accurate pest control services LLC
                          </div>
                          <div className="font-bold text-center mt-0.5 text-xs">
                            Supervisor Name & Signature
                          </div>
                          <div className="h-4"></div>
                        </div>
                      </div>
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
        className="bg-blue-600 text-white py-2 px-6 rounded mt-4 hover:bg-blue-700 transition-colors"
        onClick={uploadToCloudinary}
        disabled={uploadingToCloudinary}
      >
        {uploadingToCloudinary ? "Processing..." : "Generate & Send Report"}
      </button>
    </div>
  );
};

export default ServiceReportForm;
