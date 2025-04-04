import React from "react";
import { Grid, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const QuoteServiceDates = ({ quote }) => {
  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    "&.Mui-checked": {
      color: "#38A73B",
    },
  }));

  // Helper function to format date as "Month Day, Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get the first quote_services object
  const quoteService = quote?.quote_services?.[0];

  // Get the quote_service_dates array
  const serviceDates = quoteService?.quote_service_dates || [];

  // Sort dates and get the first date
  const sortedDates = serviceDates.sort(
    (a, b) => new Date(a.service_date) - new Date(b.service_date)
  );
  const firstDate = new Date(sortedDates[0]?.service_date);

  // Filter dates for the first month only
  // const firstMonthDates = sortedDates.filter((dateObj) => {
  //   const currentDate = new Date(dateObj.service_date);
  //   return (
  //     currentDate.getMonth() === firstDate.getMonth() &&
  //     currentDate.getFullYear() === firstDate.getFullYear()
  //   );
  // });

  const getUniqueServiceDays = (quoteServiceDates) => {
    // Create a set to store unique day numbers
    const uniqueDays = new Set();

    // Iterate over each date object and add the day to the set
    quoteServiceDates.forEach((dateObj) => {
      const day = new Date(dateObj.service_date).getDate();
      uniqueDays.add(day);
    });

    // Convert the set back to an array and return it
    return [...uniqueDays];
  };

  const uniqueDays = getUniqueServiceDays(
    quote.quote_services[0].quote_service_dates
  );

  // Assuming formatDate is a function to format date correctly
  const firstMonthDates = uniqueDays.map((day) => {
    return { service_date: day }; // Just returning the day number
  });

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        padding: "16px",
      }}
    >
      <Typography variant="h6">Service Dates</Typography>
      <Grid container spacing={2}>
        {firstMonthDates.map((dateObj, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <FormControlLabel
              control={<CustomCheckbox checked={true} disabled={true} />}
              label={
                <Typography variant="body2" style={{ fontSize: "12px" }}>
                  {dateObj.service_date} of the month
                </Typography>
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default QuoteServiceDates;
