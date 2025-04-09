"use client";

import React, { useEffect, useState } from "react";
import tableStyles from "../../styles/upcomingJobsStyles.module.css";
import { purchaeOrder } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import { useRouter } from "next/navigation";
import {
  Skeleton,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import withAuth from "@/utils/withAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Page = () => {
  const api = new APICall();
  const [id, setID] = useState();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Modal state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [approvalQuantity, setApprovalQuantity] = useState("");

  // Loading states for buttons
  const [isApprovingDetail, setIsApprovingDetail] = useState(false);
  const [isRejectingDetail, setIsRejectingDetail] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getParamFromUrl(currentUrl, "id");

    if (urlId) {
      setID(urlId);
      getPurchase(urlId);
    }
  }, []);

  useEffect(() => {
    if (id) {
      getPurchase(id);
    }
  }, [startDate, endDate, id]);

  const getParamFromUrl = (url, param) => {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    return searchParams.get(param);
  };

  const getPurchase = async (currentId) => {
    if (!currentId) return;

    setFetchingData(true);
    const queryParams = [];

    if (startDate && endDate) {
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    } else {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      queryParams.push(`start_date=${currentDate}`);
      queryParams.push(`end_date=${currentDate}`);
    }

    try {
      const response = await api.getDataWithToken(
        `${purchaeOrder}/get/${currentId}`
      );
      setPurchaseOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching purchase order:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleApprove = async () => {
    setIsApprovingDetail(true);
    try {
      await api.postFormDataWithToken(`${purchaeOrder}/update/${id}`, {
        approve_order_detail_id: selectedDetailId,
        qty: approvalQuantity,
      });

      // Refresh the purchase order details
      getPurchase(id);

      // Close the modal
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error("Error approving purchase order:", error);
    } finally {
      setIsApprovingDetail(false);
    }
  };

  const handleReject = async () => {
    setIsRejectingDetail(true);
    try {
      await api.postFormDataWithToken(`${purchaeOrder}/update/${id}`, {
        approve_order_detail_id: selectedDetailId,
      });

      // Refresh the purchase order details
      getPurchase(id);

      // Close the modal
      setIsRejectModalOpen(false);
    } catch (error) {
      console.error("Error rejecting purchase order:", error);
    } finally {
      setIsRejectingDetail(false);
    }
  };

  // Function to download purchase order as PDF
  const downloadPDF = () => {
    if (!purchaseOrderDetails || !purchaseOrderDetails.details) return;

    setIsDownloadingPdf(true);

    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Purchase Order Details", 14, 20);

      // Add purchase order info
      doc.setFontSize(12);
      doc.text(`Date: ${format(new Date(), "yyyy-MM-dd")}`, 14, 36);

      // Create table data
      const tableColumn = [
        "Supplier",
        "Product",
        "Qty",
        "Price",
        "Sub Total",
        "VAT %",
        "Grand Total",
        "Status",
      ];

      const tableRows = [];

      purchaseOrderDetails.details.forEach((detail, index) => {
        const rowData = [
          detail.supplier.supplier_name,
          detail.product.product_name,
          `${detail.qty}`,
          detail.price,
          detail.sub_total,
          `${detail.vat_per}%`,
          detail.grand_total,
          detail.status,
        ];
        tableRows.push(rowData);
      });

      // Add table to document
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [46, 204, 113], // Changed from [41, 128, 185] (blue) to [46, 204, 113] (green)
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Increase supplier width from 10 to 25
          1: { cellWidth: 25 }, // Add product column width
          2: { cellWidth: 25 }, // Add quantity column width
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 15 }, // Reduce VAT column from 25 to 15
          6: { cellWidth: 20 }, // Increase Grand Total width from 15 to 20
          7: { cellWidth: 20 }, // Reduce Status column from 25 to 20
        },
      });

      // Calculate totals
      let totalAmount = 0;
      let totalVat = 0;
      let grandTotal = 0;

      purchaseOrderDetails.details.forEach((detail) => {
        totalAmount += parseFloat(detail.sub_total);
        totalVat += parseFloat(detail.vat_amt);
        grandTotal += parseFloat(detail.grand_total);
      });

      // Add summary
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 14, finalY);
      doc.text(`Total VAT: ${totalVat.toFixed(2)}`, 14, finalY + 6);
      doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 14, finalY + 12);

      // Download PDF
      doc.save(`PurchaseOrder-${id}.pdf`);
    } catch (error) {
      console.error("Error creating PDF:", error);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const ApproveModal = () => (
    <Modal
      open={isApproveModalOpen}
      onClose={() => setIsApproveModalOpen(false)}
      aria-labelledby="approve-modal-title"
      aria-describedby="approve-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="approve-modal-title" variant="h6" component="h2">
          Approve Purchase Order
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          type="number"
          value={approvalQuantity}
          onChange={(e) => setApprovalQuantity(e.target.value)}
          variant="outlined"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApprove}
            disabled={isApprovingDetail}
          >
            {isApprovingDetail ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm Approval"
            )}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsApproveModalOpen(false)}
            disabled={isApprovingDetail}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const RejectModal = () => (
    <Modal
      open={isRejectModalOpen}
      onClose={() => setIsRejectModalOpen(false)}
      aria-labelledby="reject-modal-title"
      aria-describedby="reject-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="reject-modal-title" variant="h6" component="h2">
          Reject Purchase Order
        </Typography>
        <Typography id="reject-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to reject this purchase order?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={isRejectingDetail}
          >
            {isRejectingDetail ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm Rejection"
            )}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsRejectModalOpen(false)}
            disabled={isRejectingDetail}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const ListTable = () => {
    if (!purchaseOrderDetails || !purchaseOrderDetails.details) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr No
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Supplier
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Product Name
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Quantity
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Price
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sub Total
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                VAT %
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Grand Total
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Status
              </th>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrderDetails.details.map((detail, index) => (
              <tr key={detail.id} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-5 px-4">{detail.supplier.supplier_name}</td>
                <td className="py-5 px-4">{detail.product.product_name}</td>
                <td className="py-5 px-4">{detail.qty}</td>
                <td className="py-5 px-4">{detail.price}</td>
                <td className="py-5 px-4">{detail.sub_total}</td>
                <td className="py-5 px-4">{detail.vat_per}%</td>
                <td className="py-5 px-4">{detail.grand_total}</td>
                <td className="py-5 px-4">{detail.status}</td>
                <td className="py-5 px-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={detail.status !== "pending"}
                      onClick={() => {
                        setSelectedDetailId(detail.id);
                        setIsApproveModalOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      disabled={detail.status !== "pending"}
                      onClick={() => {
                        setSelectedDetailId(detail.id);
                        setIsRejectModalOpen(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modals */}
        <ApproveModal />
        <RejectModal />
      </div>
    );
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <div
            style={{
              fontSize: "20px",
              fontFamily: "semibold",
            }}
          >
            Purchase Orders Details
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={downloadPDF}
            disabled={isDownloadingPdf || !purchaseOrderDetails}
            startIcon={isDownloadingPdf ? <CircularProgress size={20} /> : null}
          >
            {isDownloadingPdf ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {fetchingData ? (
            <div className={tableStyles.tableContainer}>
              <Skeleton animation="wave" height={300} />
            </div>
          ) : (
            <ListTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Page);
