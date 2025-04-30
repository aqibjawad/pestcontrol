import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import CalendarComponent from "./calender.component";
import Swal from "sweetalert2";
import APICall from "@/networkUtil/APICall";
import { quotation } from "@/networkUtil/Constants";
import CustomTimePicker from "./customTimePicker";
import {
  addMonths,
  format,
  parse,
  startOfMonth,
  setDate,
  addWeeks,
  addDays,
  getDate,
  setHours,
  setMinutes,
  parseISO,
  getMonth,
  getYear,
} from "date-fns";

const DateTimeSelectionModal = ({
  open,
  onClose,
  initialDates,
  quoteData,
  onSave,
}) => {
  const api = new APICall();

  // Get services data
  const services = quoteData?.quote_services || [];
  const serviceCount = services.length;

  const [totalRequiredDates, setTotalRequiredDates] = useState(0);

  // Common state variables
  const [trn, setTrn] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [isFoodWatchAccount, setIsFoodWatchAccount] = useState(false);
  const [foodWatchStatus, setFoodWatchStatus] = useState("unlinked");
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalServices, setTotalServices] = useState(0);
  const [durationMonths, setDurationMonths] = useState(0);

  // Multiple service states - each service will have its own state
  const [servicesData, setServicesData] = useState([]);

  // Initialize service data
  useEffect(() => {
    if (quoteData?.quote_services?.length > 0) {
      const duration = quoteData.duration_in_months;
      setDurationMonths(duration);

      // Calculate total required dates
      const totalRequired = quoteData.quote_services.reduce(
        (total, service) => {
          return total + service.no_of_services;
        },
        0
      );
      setTotalRequiredDates(totalRequired);

      // Initialize data for each service
      const initialServiceData = quoteData.quote_services.map((service) => {
        const isCustomJob = service.job_type === "custom";

        // Calculate services per month - UPDATED LOGIC
        const servicesPerMonth = Math.floor(service.no_of_services / duration);

        return {
          id: service.id.toString(),
          title: service.service?.service_title || `Service ${service.id}`,
          jobType: service.job_type,
          isCustomJob: isCustomJob,
          noOfServices: service.no_of_services,
          servicesPerMonth: servicesPerMonth, // Store the calculated value
          selectedDates: [],
          generatedDates: [],
          selectedTime: "09:00",
          isValidSelection: true,
          isValidTotalDates: false,
          errorMessage: "",
          useSameAsAbove: false,
          weeklySelection: {
            week1: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week2: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week3: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week4: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
          },
          monthlyDateCounts: {},
        };
      });

      setServicesData(initialServiceData);
    }
  }, [quoteData]);

  // Handlers for common fields
  const handleTrnChange = (e) => {
    setTrn(e.target.value);
  };

  const handleLicenseNoChange = (e) => {
    setLicenseNo(e.target.value);
  };

  const handleFoodWatchLink = () => {
    setFoodWatchStatus("linked");
    setIsFoodWatchAccount(true);
  };

  const handleFoodWatchUnlink = () => {
    setFoodWatchStatus("unlinked");
    setIsFoodWatchAccount(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);

    // Reset generated dates for all services when changing tabs
    setServicesData((prevData) =>
      prevData.map((service) => ({
        ...service,
        generatedDates: [],
        monthlyDateCounts: {},
        isValidSelection: true,
        isValidTotalDates: false,
        errorMessage: "",
        useSameAsAbove: false, // Reset same as above checkbox
      }))
    );
  };

  // Helper functions
  const countDatesPerMonth = (dates) => {
    const counts = {};
    dates.forEach((date) => {
      const dateObj = parseISO(date);
      const monthKey = `${getYear(dateObj)}-${getMonth(dateObj) + 1}`;
      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });
    return counts;
  };

  const validateMonthlyDates = (dates, serviceIndex) => {
    if (!dates.length) return true;

    const service = servicesData[serviceIndex];
    const servicesPerMonth = service.servicesPerMonth;
    const monthCounts = countDatesPerMonth(dates);

    // Update monthly date counts for this service
    setServicesData((prevData) => {
      const updatedData = [...prevData];
      updatedData[serviceIndex] = {
        ...updatedData[serviceIndex],
        monthlyDateCounts: monthCounts,
      };
      return updatedData;
    });

    const isMonthlyValid = Object.values(monthCounts).every(
      (count) => count <= servicesPerMonth
    );

    if (tabIndex === 0) {
      setServicesData((prevData) => {
        const updatedData = [...prevData];
        updatedData[serviceIndex] = {
          ...updatedData[serviceIndex],
          isValidSelection: isMonthlyValid,
        };
        return updatedData;
      });
    } else {
      setServicesData((prevData) => {
        const updatedData = [...prevData];
        updatedData[serviceIndex] = {
          ...updatedData[serviceIndex],
          isValidSelection: true,
        };
        return updatedData;
      });
      if (!isMonthlyValid) {
        return false;
      }
    }

    return true;
  };

  const generateDatesForDuration = (dates, timeString, serviceIndex) => {
    if (dates.length === 0) return [];

    try {
      const allDates = [];
      const [hours, minutes] = timeString.split(":").map(Number);

      const selectedDaysOfMonth = dates.map((date) => {
        const dateObj = new Date(date);
        return dateObj.getDate();
      });

      const firstDate = new Date(dates[0]);
      const startMonth = firstDate.getMonth();
      const startYear = firstDate.getFullYear();

      for (let monthOffset = 0; monthOffset < durationMonths; monthOffset++) {
        selectedDaysOfMonth.forEach((dayOfMonth) => {
          let newDate = new Date(
            startYear,
            startMonth + monthOffset,
            dayOfMonth
          );
          newDate = setHours(newDate, hours);
          newDate = setMinutes(newDate, minutes);
          allDates.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        });
      }

      return allDates.sort();
    } catch (error) {
      console.error("Error generating dates:", error);
      return [];
    }
  };

  const generateDatesWithInterval = (dates, timeString, serviceIndex) => {
    if (!dates?.length || !durationMonths) return [];

    try {
      const allDates = [];
      const [hours, minutes] = timeString.split(":").map(Number);

      dates.forEach((date) => {
        const baseDate = new Date(date);
        const intervals = Math.floor(durationMonths / 3);

        for (let i = 0; i < intervals; i++) {
          let newDate = addMonths(baseDate, i * 3);
          newDate = setHours(newDate, hours);
          newDate = setMinutes(newDate, minutes);
          allDates.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        }
      });

      return allDates.sort();
    } catch (error) {
      console.error("Error generating interval dates:", error);
      return [];
    }
  };

  const generateWeeklyDates = (timeString, weekSelection, serviceIndex) => {
    const selectedDays = [];
    const now = new Date();
    const monthStart = startOfMonth(now);
    const dayMap = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0 };
    const [hours, minutes] = timeString.split(":").map(Number);

    const baseDates = [];
    Object.entries(weekSelection).forEach(([week, days], weekIndex) => {
      Object.entries(days).forEach(([day, isSelected]) => {
        if (isSelected) {
          const dayNumber = dayMap[day];
          let targetDate = addWeeks(monthStart, weekIndex);

          while (targetDate.getDay() !== dayNumber) {
            targetDate = addDays(targetDate, 1);
          }

          targetDate = setHours(targetDate, hours);
          targetDate = setMinutes(targetDate, minutes);
          baseDates.push(targetDate);
        }
      });
    });

    if (baseDates.length > 0 && durationMonths) {
      for (let monthOffset = 0; monthOffset < durationMonths; monthOffset++) {
        baseDates.forEach((baseDate) => {
          const newDate = addMonths(baseDate, monthOffset);
          selectedDays.push(format(newDate, "yyyy-MM-dd HH:mm:ss"));
        });
      }
    }

    return selectedDays.sort();
  };

  // Service-specific handlers
  const handleDateChange = (dates, serviceIndex) => {
    console.log(`Selected dates for service ${serviceIndex}:`, dates);
    const service = servicesData[serviceIndex];

    if (service.isCustomJob) {
      const intervalDates = generateDatesWithInterval(
        dates,
        service.selectedTime,
        serviceIndex
      );
      console.log(
        `Generated interval dates for service ${serviceIndex}:`,
        intervalDates
      );

      if (validateMonthlyDates(intervalDates, serviceIndex)) {
        setServicesData((prevData) => {
          const updatedData = [...prevData];
          updatedData[serviceIndex] = {
            ...updatedData[serviceIndex],
            selectedDates: dates,
            generatedDates: intervalDates,
          };
          return updatedData;
        });
      }
    } else {
      const regularDates = generateDatesForDuration(
        dates,
        service.selectedTime,
        serviceIndex
      );
      if (validateMonthlyDates(regularDates, serviceIndex)) {
        setServicesData((prevData) => {
          const updatedData = [...prevData];
          updatedData[serviceIndex] = {
            ...updatedData[serviceIndex],
            selectedDates: dates,
            generatedDates: regularDates,
            isValidTotalDates: dates.length === service.noOfServices,
          };
          return updatedData;
        });
      }
    }
  };

  const handleTimeChange = (event, serviceIndex) => {
    const newTime = event.target.value;

    setServicesData((prevData) => {
      const updatedData = [...prevData];
      updatedData[serviceIndex] = {
        ...updatedData[serviceIndex],
        selectedTime: newTime,
      };

      // Regenerate dates with new time
      if (
        tabIndex === 0 &&
        updatedData[serviceIndex].selectedDates.length > 0
      ) {
        const service = updatedData[serviceIndex];
        const newDates = service.isCustomJob
          ? generateDatesWithInterval(
              service.selectedDates,
              newTime,
              serviceIndex
            )
          : generateDatesForDuration(
              service.selectedDates,
              newTime,
              serviceIndex
            );

        validateMonthlyDates(newDates, serviceIndex, service.noOfServices);
        updatedData[serviceIndex].generatedDates = newDates;
      } else if (tabIndex === 1) {
        const service = updatedData[serviceIndex];
        const dates = generateWeeklyDates(
          newTime,
          service.weeklySelection,
          serviceIndex
        );
        validateMonthlyDates(dates, serviceIndex, service.noOfServices);
        updatedData[serviceIndex].generatedDates = dates;
      }

      return updatedData;
    });
  };

  const handleWeekDayChange = (week, day, serviceIndex) => {
    const service = servicesData[serviceIndex];
    const servicesPerMonth = service.servicesPerMonth;

    // Calculate how many checkboxes are currently selected
    const currentSelectedCount = Object.values(service.weeklySelection).reduce(
      (count, weekDays) => {
        return count + Object.values(weekDays).filter(Boolean).length;
      },
      0
    );

    // Check if trying to select a new checkbox
    const isSelecting = !service.weeklySelection[week][day];

    // If selecting and already at max allowed per month, prevent selection
    if (isSelecting && currentSelectedCount >= servicesPerMonth) {
      // Show error message
      setServicesData((prevData) => {
        const updatedData = [...prevData];
        updatedData[serviceIndex] = {
          ...updatedData[serviceIndex],
          errorMessage: `You can only select ${servicesPerMonth} days per month`,
        };
        return updatedData;
      });
      return;
    }

    // Clear error message if it exists
    if (service.errorMessage) {
      setServicesData((prevData) => {
        const updatedData = [...prevData];
        updatedData[serviceIndex] = {
          ...updatedData[serviceIndex],
          errorMessage: "",
        };
        return updatedData;
      });
    }

    // Toggle the checkbox state
    setServicesData((prevData) => {
      const updatedData = [...prevData];
      updatedData[serviceIndex] = {
        ...updatedData[serviceIndex],
        weeklySelection: {
          ...updatedData[serviceIndex].weeklySelection,
          [week]: {
            ...updatedData[serviceIndex].weeklySelection[week],
            [day]: !updatedData[serviceIndex].weeklySelection[week][day],
          },
        },
      };

      // Generate new dates based on updated weekly selection
      const newGeneratedDates = generateWeeklyDates(
        updatedData[serviceIndex].selectedTime,
        updatedData[serviceIndex].weeklySelection,
        serviceIndex
      );

      // Update generated dates and validation status
      updatedData[serviceIndex].generatedDates = newGeneratedDates;
      updatedData[serviceIndex].isValidTotalDates =
        newGeneratedDates.length === updatedData[serviceIndex].noOfServices;

      // Validate monthly distribution
      validateMonthlyDates(newGeneratedDates, serviceIndex);

      return updatedData;
    });
  };

  // Handler for "Same as above dates" checkbox
  const handleSameAsAboveChange = (event, serviceIndex) => {
    const isChecked = event.target.checked;

    if (isChecked && serviceIndex > 0) {
      // Get previous service data
      const previousService = servicesData[serviceIndex - 1];
      const currentService = servicesData[serviceIndex];

      // Check if job types and services per month are same
      const sameJobType = previousService.jobType === currentService.jobType;
      const sameServiceCount =
        previousService.noOfServices === currentService.noOfServices;

      // Only allow "Same as above" if both conditions match
      if (sameJobType && sameServiceCount) {
        setServicesData((prevData) => {
          const updatedData = [...prevData];

          if (tabIndex === 0) {
            // Copy dates from previous service for date-wise selection
            updatedData[serviceIndex] = {
              ...currentService,
              selectedDates: [...previousService.selectedDates],
              generatedDates: [...previousService.generatedDates], // Directly copy the generated dates
              selectedTime: previousService.selectedTime,
              useSameAsAbove: true,
              isValidTotalDates: previousService.isValidTotalDates,
              isValidSelection: previousService.isValidSelection,
              monthlyDateCounts: { ...previousService.monthlyDateCounts }, // Copy monthly date counts too
            };
          } else {
            // Copy weekly selection from previous service for day-wise selection
            updatedData[serviceIndex] = {
              ...currentService,
              weeklySelection: JSON.parse(
                JSON.stringify(previousService.weeklySelection)
              ),
              generatedDates: [...previousService.generatedDates], // Directly copy generated dates
              selectedTime: previousService.selectedTime,
              useSameAsAbove: true,
              isValidTotalDates: previousService.isValidTotalDates,
              isValidSelection: previousService.isValidSelection,
              monthlyDateCounts: { ...previousService.monthlyDateCounts }, // Copy monthly date counts too
            };
          }

          return updatedData;
        });
      } else {
        // Show an error message if conditions don't match
        Swal.fire({
          icon: "warning",
          title: "Cannot use same dates",
          text: "You can only use 'Same as above' when job type and number of services match.",
        });

        // Reset the checkbox
        event.target.checked = false;
      }
    } else {
      // Reset the service data when unchecking
      setServicesData((prevData) => {
        const updatedData = [...prevData];
        updatedData[serviceIndex] = {
          ...updatedData[serviceIndex],
          selectedDates: [],
          generatedDates: [],
          isValidTotalDates: false,
          useSameAsAbove: false,
          weeklySelection: {
            week1: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week2: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week3: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
            week4: {
              mon: false,
              tue: false,
              wed: false,
              thu: false,
              fri: false,
              sat: false,
              sun: false,
            },
          },
        };
        return updatedData;
      });
    }
  };

  const renderWeekSelection = (weekNum, serviceIndex) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const weekKey = `week${weekNum}`;
    const service = servicesData[serviceIndex];
    const isDisabled = service?.useSameAsAbove || false;

    return (
      <div className="mb-4 p-4 border rounded">
        <h3 className="mb-2 font-medium">Week {weekNum}</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <FormControlLabel
              key={`${serviceIndex}-${weekKey}-${day}`}
              control={
                <Checkbox
                  checked={service?.weeklySelection[weekKey][day] || false}
                  onChange={() =>
                    handleWeekDayChange(weekKey, day, serviceIndex)
                  }
                  disabled={isDisabled}
                  size="small"
                />
              }
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              className="m-0"
            />
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all required services have dates
    const allServicesValid = servicesData.every((service, index) => {
      // If using same as above, skip validation for this service since we're using dates from previous service
      if (service.useSameAsAbove && index > 0) {
        return true;
      }

      // For custom jobs, only one date is required
      if (service.isCustomJob) {
        return (
          service.generatedDates.length > 0 &&
          service.selectedDates.length === 1
        );
      }

      // For regular jobs in date-wise selection
      if (tabIndex === 0) {
        return service.generatedDates.length > 0;
      }

      // For day-wise selection
      return service.generatedDates.length > 0 && service.isValidTotalDates;
    });

    if (!allServicesValid) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select valid dates for all services.",
      });
      setLoading(false);
      return;
    }

    // Prepare data for API
    const quoteServices = servicesData.map((service) => ({
      quote_service_id: service.id,
      dates: service.generatedDates,
    }));

    const dataToSend = {
      trn: trn,
      license_no: licenseNo,
      is_food_watch_account: isFoodWatchAccount,
      quote_services: quoteServices,
    };

    try {
      const response = await api.postDataToken(
        `${quotation}/move/contract/${quoteData.id}`,
        dataToSend
      );

      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Contract has been created successfully!",
        });
        onClose();
        window.location.reload();
      } else {
        throw new Error(response.error?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.message || "Failed to process the request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSelectedDates = () => {
    return servicesData.reduce((total, service) => {
      return total + service.selectedDates.length;
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Dates and Time for Services</DialogTitle>

      <DialogContent>
        <div className="mb-4 mt-4">
          <TextField
            type="text"
            label="TRN"
            value={trn}
            onChange={handleTrnChange}
            className="mr-4"
          />

          <TextField
            type="text"
            label="License No"
            value={licenseNo}
            onChange={handleLicenseNoChange}
            className="ml-4"
          />

          <div className="mt-4 mb-4">
            <label className="block font-bold mb-2">Food Watch Account</label>
            <div className="space-x-4">
              <Button
                variant="contained"
                onClick={handleFoodWatchLink}
                style={{
                  backgroundColor:
                    foodWatchStatus === "linked" ? "#4CAF50" : "#D3D3D3",
                  color: "white",
                }}
              >
                Link
              </Button>
              <Button
                variant="contained"
                onClick={handleFoodWatchUnlink}
                style={{
                  backgroundColor:
                    foodWatchStatus === "unlinked" ? "#4CAF50" : "#D3D3D3",
                  color: "white",
                }}
              >
                Unlink
              </Button>
            </div>
          </div>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            className="mb-4"
          >
            <Tab label="Date Wise" />
            <Tab label="Day Wise" />
          </Tabs>

          {/* Render separate calendar/selection for each service */}
          {servicesData.map((service, index) => (
            <Box key={`service-${index}`} className="mb-6">
              <Divider className="my-4" />
              <Typography variant="h6" className="font-bold mb-3">
                Service {index + 1}: {service.title}
              </Typography>

              {index > 0 &&
                servicesData[index].jobType ===
                  servicesData[index - 1].jobType &&
                servicesData[index].noOfServices ===
                  servicesData[index - 1].noOfServices && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={service.useSameAsAbove || false}
                        onChange={(e) => handleSameAsAboveChange(e, index)}
                      />
                    }
                    label="Same as above dates"
                    className="mb-2 block"
                  />
                )}

              <div className="mb-4">
                <div className="text-sm text-gray-700 mb-1">Select Time</div>
                <CustomTimePicker
                  initialTime={`${service.selectedTime} PM`}
                  onChange={handleTimeChange}
                  serviceIndex={index}
                  disabled={service.useSameAsAbove}
                />
              </div>

              <Typography variant="body2" className="mb-2">
                {service.isCustomJob
                  ? "1 service per quarter"
                  : `Maximum ${service.noOfServices} services in total`}
              </Typography>

              {tabIndex === 0 && (
                <div className="mt-3">
                  <Typography variant="body2" className="mb-2">
                    {service.isCustomJob
                      ? "1 service per quarter"
                      : `Maximum ${service.servicesPerMonth} services per month, ${service.noOfServices} services in total`}
                  </Typography>

                  {!service.useSameAsAbove ? (
                    <CalendarComponent
                      initialDates={service.selectedDates}
                      onDateChange={(dates) => handleDateChange(dates, index)}
                    />
                  ) : (
                    <div className="p-4 border rounded bg-gray-100">
                      <Typography variant="body2">
                        Using the same dates as Service {index}
                      </Typography>
                      {service.selectedDates.length > 0 && (
                        <ul className="mt-2">
                          {service.selectedDates.map((date, i) => (
                            <li key={i}>
                              {new Date(date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tabIndex === 1 && (
                <div className="mt-4">
                  <Typography variant="body2" className="mb-2 text-blue-600">
                    {service.isCustomJob
                      ? "Please select 1 date"
                      : `Please select ${service.servicesPerMonth} dates per month, ${service.noOfServices} dates in total`}
                  </Typography>
                  {renderWeekSelection(1, index)}
                  {renderWeekSelection(2, index)}
                  {renderWeekSelection(3, index)}
                  {renderWeekSelection(4, index)}
                </div>
              )}

              {service.errorMessage && (
                <Typography color="error" className="mt-2">
                  {service.errorMessage}
                </Typography>
              )}
            </Box>
          ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={
            loading ||
            // Check if any service doesn't have enough dates selected
            servicesData.some((service) => {
              // Skip validation for services using "Same as above"
              if (service.useSameAsAbove) return false;

              // For custom jobs (quarterly service)
              if (service.isCustomJob) {
                return service.selectedDates.length !== 1;
              }

              // For date-wise selection (tabIndex === 0)
              if (tabIndex === 0) {
                // Check if total generated dates match required number of services
                return service.generatedDates.length !== service.noOfServices;
              }
              // For day-wise selection (tabIndex === 1)
              else {
                // Count selected days per week
                const selectedDaysCount = Object.values(
                  service.weeklySelection
                ).reduce((count, weekDays) => {
                  return count + Object.values(weekDays).filter(Boolean).length;
                }, 0);

                // Each selected day appears once per month for the duration
                // So total dates should be selectedDaysCount * durationMonths
                const totalProjectedDates = selectedDaysCount * durationMonths;
                return totalProjectedDates !== service.noOfServices;
              }
            })
          }
        >
          {loading ? <CircularProgress size={24} /> : "Save Dates"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateTimeSelectionModal;
