import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import APICall from "@/networkUtil/APICall";
import { contract, services } from "@/networkUtil/Constants";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/dropDown";
import CalendarComponent from "./calander";
import Swal from "sweetalert2";

const AddService = ({ quote, open, onClose, onServiceAdded, quoteId }) => {
  console.log("add service", quoteId);

  const api = new APICall();

  // Add service states
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [availableServices, setAvailableServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState(null);
  const [addServiceType, setAddServiceType] = useState("");
  const [addNoOfServices, setAddNoOfServices] = useState("");
  const [addRate, setAddRate] = useState("");
  const [isAddNoOfServicesDisabled, setIsAddNoOfServicesDisabled] =
    useState(false);
  const [addServiceDates, setAddServiceDates] = useState([]);
  const [isAddingService, setIsAddingService] = useState(false);
  // Add remaining months state
  const [remainingMonths, setRemainingMonths] = useState(0);

  // Time selection states
  const [selectedHour, setSelectedHour] = useState("02");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedAmPm, setSelectedAmPm] = useState("PM");

  // Generate hour, minute options
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];

  // Calculate remaining months when component mounts
  useEffect(() => {
    calculateRemainingMonths();
  }, [quoteId]);

  // Function to calculate remaining months
  const calculateRemainingMonths = () => {
    if (
      !quoteId ||
      !quoteId.quote_services ||
      quoteId.quote_services.length === 0
    ) {
      // If no quote data available, use the full duration
      setRemainingMonths(quoteId?.duration_in_months || 0);
      return;
    }

    try {
      // Find the latest service date across all services
      let latestDate = null;

      quoteId.quote_services.forEach((service) => {
        if (
          service.quote_service_dates &&
          service.quote_service_dates.length > 0
        ) {
          service.quote_service_dates.forEach((dateObj) => {
            const serviceDate = new Date(dateObj.service_date);
            if (!latestDate || serviceDate > latestDate) {
              latestDate = serviceDate;
            }
          });
        }
      });

      if (!latestDate) {
        // If no dates found, use the full duration
        setRemainingMonths(quoteId?.duration_in_months || 0);
        return;
      }

      const today = new Date();

      // Calculate months difference
      let months = (latestDate.getFullYear() - today.getFullYear()) * 12;
      months += latestDate.getMonth() - today.getMonth();

      // Include current month in the count (add 1)
      months += 1;

      // Ensure we don't go below 0
      setRemainingMonths(Math.max(0, months));
    } catch (error) {
      console.error("Error calculating remaining months:", error);
      // Fallback to using the full contract duration
      setRemainingMonths(quoteId?.duration_in_months || 0);
    }
  };

  // Fetch available services for add modal
  useEffect(() => {
    const fetchServices = async () => {
      if (!open) return;

      setIsLoadingServices(true);
      setServiceError(null);

      try {
        console.log("Fetching services from:", services);
        const response = await api.getDataWithToken(`${services}`);
        console.log("Services API response:", response);

        // Direct access to the data property in the response
        if (response && response.data) {
          console.log("Services data:", response.data);
          setAvailableServices(response.data);
        } else {
          setServiceError("Failed to load services: No data in response");
          console.error("No data in response:", response);
        }
      } catch (error) {
        console.error("Error fetching available services:", error);
        setServiceError(
          "Failed to load services: " + (error.message || "Network error")
        );
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (open) {
      fetchServices();
      setSelectedServiceId("");
      setAddServiceType("");
      setAddNoOfServices("");
      setAddRate("");
      setAddServiceDates([]);
      setSelectedHour("02");
      setSelectedMinute("30");
      setSelectedAmPm("PM");
      // Recalculate remaining months when opening the modal
      calculateRemainingMonths();
    }
  }, [open]);

  // Handle service type change
  useEffect(() => {
    if (addServiceType === "Quarterly") {
      // Calculate the number of services for quarterly based on remaining months
      const quarterlyServices = Math.ceil(remainingMonths / 3);
      setAddNoOfServices(quarterlyServices.toString());
      setIsAddNoOfServicesDisabled(true);
    } else if (addServiceType === "Monthly") {
      // Empty the no. of services field for monthly
      setAddNoOfServices("");
      setIsAddNoOfServicesDisabled(false);
    }
  }, [addServiceType, remainingMonths]);

  // Convert 12-hour format to 24-hour format for API
  const convertTo24HourFormat = (hour, minute, ampm) => {
    let hourNum = parseInt(hour);

    // Convert to 24-hour format if PM
    if (ampm === "PM" && hourNum < 12) {
      hourNum += 12;
    }
    // Handle 12 AM case (should be 00)
    else if (ampm === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, "0")}:${minute}`;
  };

  const handleServiceChange = (serviceId) => {
    setSelectedServiceId(serviceId);
  };

  const handleAddServiceSave = async () => {
    // Validate inputs
    if (!selectedServiceId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a service.",
      });
      return;
    }

    if (!addServiceType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a service type.",
      });
      return;
    }

    if (!addNoOfServices || isNaN(parseInt(addNoOfServices))) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid number of services.",
      });
      return;
    }

    if (!addRate || isNaN(parseFloat(addRate))) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid rate.",
      });
      return;
    }

    if (!addServiceDates || addServiceDates.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select at least one service date.",
      });
      return;
    }

    try {
      setIsAddingService(true);

      // Convert time to 24-hour format
      const timeIn24HourFormat = convertTo24HourFormat(
        selectedHour,
        selectedMinute,
        selectedAmPm
      );

      const data = {
        quote_id: quoteId.id,
        new_services: [
          {
            service_id: parseInt(selectedServiceId),
            job_type: addServiceType.toLowerCase(),
            rate: parseFloat(addRate),
            no_of_jobs: parseInt(addNoOfServices),
            dates: addServiceDates.map((date) => {
              // Format date as required by the API and include the selected time
              const d = new Date(date);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const day = String(d.getDate()).padStart(2, "0");
              return `${year}-${month}-${day} ${timeIn24HourFormat}:00`;
            }),
          },
        ],
      };

      const response = await api.postDataToken(`${contract}/update`, data);

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service added successfully!",
        });
        onClose();

        // Call the callback function to inform parent component
        if (typeof onServiceAdded === "function") {
          onServiceAdded();
        }
      } else {
        throw new Error(
          response.message || "Duplicate service detected. Each service must be unique."
        );
      }
    } catch (error) {
      console.error("Error adding service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Unknown error occurred",
      });
    } finally {
      setIsAddingService(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Service</DialogTitle>
      <DialogContent>
        <div className="flex gap-4 mb-4">
          <InputWithTitle
            title="Remaining Months"
            value={`${remainingMonths} months`}
            disabled={true}
            type="text"
          />
        </div>
        {/* Service Selection as Checkboxes */}
        <div className="mb-4 mt-2">
          {isLoadingServices ? (
            <div className="flex justify-center items-center p-4">
              <CircularProgress size={24} />
              <span className="ml-2">Loading services...</span>
            </div>
          ) : serviceError ? (
            <div className="p-4 bg-red-50 text-red-700 rounded">
              <Typography>{serviceError}</Typography>
            </div>
          ) : availableServices.length === 0 ? (
            <div className="p-4 bg-gray-100 text-center rounded">
              <Typography>No services available</Typography>
            </div>
          ) : (
            <>
              <Typography variant="subtitle1" className="font-medium mb-2">
                Select Service
              </Typography>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-2 border rounded cursor-pointer ${
                      selectedServiceId === service.id.toString()
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleServiceChange(service.id.toString())}
                  >
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedServiceId === service.id.toString()}
                        onChange={() => {}}
                        size="small"
                      />
                      <div className="ml-2">
                        <div className="text-gray-800">{service.pest_name}</div>
                        <div className="text-xs text-gray-500">
                          {service.service_title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Duration Info */}
        <div className="flex gap-4 mb-4">
          {/* Job Type */}
          <div style={{ width: "600px" }}>
            <Dropdown
              title="Service Type"
              options={["Quarterly", "Monthly"]}
              value={addServiceType}
              onChange={(value) => setAddServiceType(value)}
            />
          </div>

          <InputWithTitle
            title="No. of Services"
            value={addNoOfServices}
            onChange={setAddNoOfServices}
            type="text"
            disabled={isAddNoOfServicesDisabled}
          />

          <InputWithTitle
            title="Rate"
            value={addRate}
            onChange={setAddRate}
            type="text"
          />
        </div>

        {/* Time selection with AM/PM */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <p className="mr-2 font-medium">Service Time:</p>

            {/* Hour Selector */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <Select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                {hours.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <span className="mx-1">:</span>

            {/* Minute Selector */}
            <FormControl size="small" style={{ minWidth: 80 }}>
              <Select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
              >
                {minutes.map((minute) => (
                  <MenuItem key={minute} value={minute}>
                    {minute}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* AM/PM Selector */}
            <FormControl size="small" style={{ minWidth: 80, marginLeft: 8 }}>
              <Select
                value={selectedAmPm}
                onChange={(e) => setSelectedAmPm(e.target.value)}
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>

            {/* Display selected time */}
            <Box ml={2} display="flex" alignItems="center">
              <span className="text-gray-600">
                ({selectedHour}:{selectedMinute} {selectedAmPm})
              </span>
            </Box>
          </div>
        </div>

        {/* Date selection */}
        <div className="mt-4">
          {addServiceType ? (
            <CalendarComponent
              initialDates={addServiceDates || []}
              onDateChange={(dates) => {
                setAddServiceDates(dates);
                console.log("Selected dates for new service:", dates);
              }}
              serviceType={addServiceType}
              remainingMonths={remainingMonths}
              isDateSelectable={(date) => {
                return date >= new Date();
              }}
            />
          ) : (
            <div className="p-4 bg-gray-100 text-center rounded">
              Please select a Service Type first to enable date selection
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleAddServiceSave}
          color="primary"
          disabled={isAddingService || !addServiceType || !selectedServiceId}
          startIcon={isAddingService ? <CircularProgress size={20} /> : null}
        >
          {isAddingService ? "Adding..." : "Add Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddService;
