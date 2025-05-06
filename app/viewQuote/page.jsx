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
  TableSortLabel,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DateFilters from "@/components/generic/DateFilters";
import { format } from "date-fns";
import InputWithTitle from "@/components/generic/InputWithTitle";
import withAuth from "@/utils/withAuth";
import DateSelectionModal from "./DateSelectionModal";
import ContractCancelModal from "./cancelquoete";
import Swal from "sweetalert2";

// Import icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmailIcon from "@mui/icons-material/Email";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

const Quotation = () => {
  const router = useRouter();
  const api = new APICall();

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [quoteList, setQuoteList] = useState([]);
  const [allQuoteList, setAllQuoteList] = useState([]);
  const [isApproving, setIsApproving] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [anchorEl, setAnchorEl] = useState({}); // For menu management

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [currentQuoteId, setCurrentQuoteId] = useState(null);
  const [selectedQuoteData, setSelectedQuoteData] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [savedDates, setSavedDates] = useState([]);

  // Menu handlers
  const handleMenuOpen = (event, id) => {
    setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
  };

  const handleMenuClose = (id) => {
    setAnchorEl({ ...anchorEl, [id]: null });
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleApprove = (id) => {
    setCurrentQuoteId(id);

    // Find the selected quote with all its details including services
    const selectedQuote = quoteList.find((quote) => quote.id === id);
    setSelectedQuoteData(selectedQuote);

    // Check for duplicate services
    const hasDuplicateServices = checkForDuplicateServices(selectedQuote);

    if (hasDuplicateServices) {
      // Show warning using Swal
      Swal.fire({
        title: "Warning!",
        text: "Quote contains same service more than one time, please set appropriate quantities.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      // Now selectedQuoteData will contain quote_services array which we can access in the modal
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDates([]);
    setSelectedJobType("");
    setCurrentQuoteId(null);
  };

  const handleDateSelectionComplete = async () => {
    if (!currentQuoteId) return;

    setIsApproving((prev) => ({ ...prev, [currentQuoteId]: true }));
    try {
      await api.getDataWithToken(
        `${quotation}/move/contract/${currentQuoteId}`,
        {
          dates: selectedDates,
          jobType: selectedJobType,
        }
      );

      const updateQuotes = (prevList) =>
        prevList.map((quote) =>
          quote.id === currentQuoteId ? { ...quote, is_contracted: 1 } : quote
        );
      setQuoteList(updateQuotes);
      setAllQuoteList(updateQuotes);
      handleModalClose();
      router.push("/contracts");
    } catch (error) {
      console.error("Error approving quote:", error);
    } finally {
      setIsApproving((prev) => ({ ...prev, [currentQuoteId]: false }));
    }
  };

  const getAllQuotes = async () => {
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
      const [quotesResponse] = await Promise.all([
        api.getDataWithToken(`${quotation}/all?${queryParams.join("&")}`),
      ]);
      const mergedData = quotesResponse?.data || [];
      setQuoteList(mergedData);
      setAllQuoteList(mergedData);
    } catch (error) {
      console.error("Error fetching quotes and contacts:", error);
      setQuoteList([]);
      setAllQuoteList([]);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getAllQuotes();
  }, [startDate, endDate]);

  const getNestedValue = (obj, path) => {
    try {
      return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
    } catch (error) {
      return "";
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);

    const sortedQuotes = [...quoteList].sort((a, b) => {
      const aValue = getNestedValue(a, property);
      const bValue = getNestedValue(b, property);

      if (aValue < bValue) return newOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setQuoteList(sortedQuotes);
  };

  const handleCancel = (id) => {
    const selectedQuote = quoteList.find((quote) => quote.id === id);
    setSelectedQuoteData(selectedQuote);
    setIsCancelModalOpen(true);
  };

  // Email sending handler
  const handleSendEmail = async (id) => {
    try {
      const selectedQuote = quoteList.find((quote) => quote.id === id);
      // Call the API to send email
      const response = await api.getDataWithToken(
        `${quotation}/pdf/email/send/${id}`
      );

      Swal.fire({
        title: "Email Sent!",
        text: `Quote details sent to ${
          selectedQuote?.user?.client?.firm_name || "client"
        }`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to send email. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const sortLabelStyles = {
    "& .MuiTableSortLabel-icon": {
      opacity: 1, // Make arrows always visible
      width: "20px", // Slightly larger arrows
      height: "20px",
    },
  };

  const checkForDuplicateServices = (quoteData) => {
    if (!quoteData?.quote_services || quoteData.quote_services.length === 0) {
      return false;
    }

    const serviceIds = {};
    for (const service of quoteData.quote_services) {
      if (serviceIds[service.service_id]) {
        return true; // Found duplicate service_id
      }
      serviceIds[service.service_id] = true;
    }
    return false;
  };

  const listServiceTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={() => handleRequestSort("id")}
                  sx={sortLabelStyles}
                >
                  Sr No
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "user.name"}
                  direction={orderBy === "user.name" ? order : "asc"}
                  onClick={() => handleRequestSort("user.name")}
                  sx={sortLabelStyles}
                >
                  Firm Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "tag"}
                  direction={orderBy === "tag" ? order : "asc"}
                  onClick={() => handleRequestSort("tag")}
                  sx={sortLabelStyles}
                >
                  Tag
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "billing_method"}
                  direction={orderBy === "billing_method" ? order : "asc"}
                  onClick={() => handleRequestSort("billing_method")}
                  sx={sortLabelStyles}
                >
                  Billing Method
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "quote_title"}
                  direction={orderBy === "quote_title" ? order : "asc"}
                  onClick={() => handleRequestSort("quote_title")}
                  sx={sortLabelStyles}
                >
                  Quote Title
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                Treatment Method Name
              </TableCell>
              <TableCell className="contractHeader">Services</TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "is_contracted"}
                  direction={orderBy === "is_contracted" ? order : "asc"}
                  onClick={() => handleRequestSort("is_contracted")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">
                <TableSortLabel
                  active={orderBy === "sub_total"}
                  direction={orderBy === "sub_total" ? order : "asc"}
                  onClick={() => handleRequestSort("sub_total")}
                  sx={sortLabelStyles}
                >
                  Grand Total
                </TableSortLabel>
              </TableCell>
              <TableCell className="contractHeader">Actions</TableCell>
              <TableCell className="contractHeader">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchingData ? (
              <TableRow>
                <TableCell colSpan={11} style={{ textAlign: "center" }}>
                  {[...Array(5)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="text"
                      width="80%"
                      height={40}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : (
              quoteList.map((row, index) => (
                <TableRow key={row?.id || index}>
                  <TableCell className="contractTable">{index + 1}</TableCell>
                  <TableCell className="contractTable">
                    {row?.user?.client?.firm_name || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    <div className="approvedContrant">{row?.tag || "N/A"}</div>
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.billing_method || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.quote_title || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.treatment_methods
                      ?.map((method) => method?.name)
                      ?.filter(Boolean)
                      ?.join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.quote_services
                      ?.map((service) => service?.service?.service_title)
                      ?.filter(Boolean)
                      ?.join(", ") || "N/A"}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.contract_cancel_reason ? (
                      <div className="text-red-600">Contract Cancel</div>
                    ) : row?.is_contracted === 0 ? (
                      <div className="pendingContract">Pending</div>
                    ) : (
                      <div className="approvedContract">Approved</div>
                    )}
                  </TableCell>
                  <TableCell className="contractTable">
                    {row?.grand_total || 0}
                  </TableCell>

                  {/* Actions Menu Column */}
                  <TableCell className="contractTable">
                    <div className="flex items-center justify-center">
                      <IconButton
                        aria-label="more actions"
                        aria-controls={`actions-menu-${row.id}`}
                        aria-haspopup="true"
                        onClick={(e) => handleMenuOpen(e, row.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`actions-menu-${row.id}`}
                        anchorEl={anchorEl[row.id]}
                        keepMounted
                        open={Boolean(anchorEl[row.id])}
                        onClose={() => handleMenuClose(row.id)}
                      >
                        {/* View Details option */}
                        <MenuItem
                          onClick={() => {
                            handleMenuClose(row.id);
                            router.push(`/quotePdf?id=${row?.id}`);
                          }}
                        >
                          <VisibilityIcon fontSize="small" className="mr-2" />
                          View Details
                        </MenuItem>

                        {/* Download PDF option */}
                        {row?.pdf_url && (
                          <MenuItem
                            onClick={() => {
                              handleMenuClose(row.id);
                              window.open(row.pdf_url, "_blank");
                            }}
                          >
                            <DownloadIcon fontSize="small" className="mr-2" />
                            Download PDF
                          </MenuItem>
                        )}

                        {row?.contract_cancel_reason === null && (
                          <>
                            {/* Send Email option - only for pending status */}
                            {row?.is_contracted === 0 && (
                              <MenuItem
                                onClick={() => {
                                  handleMenuClose(row.id);
                                  handleSendEmail(row.id);
                                }}
                              >
                                <EmailIcon fontSize="small" className="mr-2" />
                                Send Email
                              </MenuItem>
                            )}

                            {/* Only show Approve and Cancel for pending quotes */}
                            {row?.is_contracted === 0 && (
                              <>
                                <Divider />
                                <MenuItem
                                  onClick={() => {
                                    handleMenuClose(row.id);
                                    handleApprove(row.id);
                                  }}
                                  disabled={isApproving[row.id]}
                                >
                                  <ThumbUpIcon
                                    fontSize="small"
                                    className="mr-2"
                                  />
                                  {isApproving[row.id]
                                    ? "Approving..."
                                    : "Approve"}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    handleMenuClose(row.id);
                                    handleCancel(row.id);
                                  }}
                                  disabled={isApproving[row.id]}
                                >
                                  <CancelIcon
                                    fontSize="small"
                                    className="mr-2"
                                  />
                                  {isApproving[row.id]
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </MenuItem>
                              </>
                            )}
                          </>
                        )}
                      </Menu>
                    </div>
                  </TableCell>

                  {/* Edit Column */}
                  <TableCell className="contractTable">
                    {row?.contract_cancel_reason ? (
                      <div className="text-red-600">Contract Cancel</div>
                    ) : row?.is_contracted === 0 ? (
                      <Link href={`/quoteEdit?id=${row?.id}`}>
                        <IconButton color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    ) : (
                      <IconButton
                        disabled
                        className="text-gray-400 cursor-not-allowed"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  useEffect(() => {
    if (filterValue !== "") {
      const filteredData = allQuoteList.filter(
        (item) =>
          (item?.tag || "").toLowerCase().includes(filterValue.toLowerCase()) ||
          (item?.user?.name || "")
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
      setQuoteList(filteredData);
    } else {
      setQuoteList(allQuoteList);
    }
  }, [filterValue, allQuoteList]);

  const handleSaveDates = (dates) => {
    setSavedDates(dates);
  };

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "-4rem" }}
        >
          Quotations
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div>
            <InputWithTitle
              placeholder="Filter By Name, Tag"
              title={"Filter by Tag, Name"}
              onChange={setFilterValue}
            />
          </div>
          <div
            style={{
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
              padding: "12px 16px",
              marginTop: "35px",
              borderRadius: "10px",
            }}
          >
            <DateFilters onDateChange={handleDateChange} />
          </div>
          <div
            style={{
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
              padding: "12px 16px",
              marginTop: "35px",
              borderRadius: "10px",
            }}
          >
            <Link href="/quotation">Add Quote</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      <DateSelectionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDates={savedDates}
        onSave={handleSaveDates}
        quoteData={selectedQuoteData}
      />

      <ContractCancelModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        quoteData={selectedQuoteData}
      />
    </div>
  );
};

export default withAuth(Quotation);
