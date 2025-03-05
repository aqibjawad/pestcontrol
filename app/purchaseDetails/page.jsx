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

const Page = () => {
  const api = new APICall();
  const [id, setID] = useState();
  const router = new useRouter();
  const [fetchingData, setFetchingData] = useState(true);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
            {isApprovingDetail ? <CircularProgress size={24} /> : "Confirm Approval"}
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
            {isRejectingDetail ? <CircularProgress size={24} /> : "Confirm Rejection"}
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
                VAT Amount
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
                <td className="py-5 px-4">
                  {detail.qty} {detail.product.unit}
                </td>
                <td className="py-5 px-4">{detail.price}</td>
                <td className="py-5 px-4">{detail.sub_total}</td>
                <td className="py-5 px-4">{detail.vat_per}%</td>
                <td className="py-5 px-4">{detail.vat_amt}</td>
                <td className="py-5 px-4">{detail.grand_total}</td>
                <td className="py-5 px-4">{detail.status}</td>
                <td className="py-5 px-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      disabled={detail.status !== 'pending'}
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
                      disabled={detail.status !== 'pending'}
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
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Purchase Orders Details
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