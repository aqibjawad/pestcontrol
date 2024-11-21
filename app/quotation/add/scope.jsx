import React, { useState } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import styles from "../../../styles/quotes.module.css";

const Scope = ({ selectedServices }) => {
  const [isScopeVisible, setIsScopeVisible] = useState(true); // Set initial state to true

  const handleEnable = () => {
    setIsScopeVisible(true);
  };

  const handleDisable = () => {
    setIsScopeVisible(false);
  };

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h6" className={styles.scopeHead}>
            Scope of Work
          </Typography>
        </Grid>

        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDisable}
                style={{
                  backgroundColor: isScopeVisible ? "white" : "green",
                  color: isScopeVisible ? "black" : "white",
                }}
                className={styles.disableButton}
              >
                Disable
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleEnable}
                style={{
                  backgroundColor: isScopeVisible ? "green" : "white",
                  color: isScopeVisible ? "white" : "black",
                }}
                className={styles.enableButton}
              >
                Enable
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {isScopeVisible && (
        <Box sx={{ flexGrow: 1 }}>
          <Grid className="mt-3" container spacing={3}>
            {selectedServices.length === 0 ? (
              <Grid item xs={12}>
                <Typography color="textSecondary">
                  No services selected
                </Typography>
              </Grid>
            ) : (
              selectedServices.map((service, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={6}
                  key={`${service.pest_name}-${index}`}
                >
                  <Box
                    p={2}
                    border={1}
                    borderRadius={2}
                    borderColor="divider"
                    height="100%"
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {service.pest_name}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                      Service Title:
                    </Typography>
                    <Typography>{service.service_title}</Typography>

                    <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                      Terms and Conditions:
                    </Typography>
                    <Box
                      sx={{
                        pl: 2, // Add padding if needed
                        "& ul": { paddingLeft: "20px" }, // Ensure list indenting
                        "& ol": { paddingLeft: "20px" }, // For ordered lists
                        "& li": { marginBottom: "8px" }, // Add spacing between list items
                        "& a": { color: "blue", textDecoration: "underline" }, // Styling links
                      }}
                      dangerouslySetInnerHTML={{
                        __html: service.term_and_conditions,
                      }}
                    />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Scope;
