import React from "react";
import { Box, Grid } from "@mui/material";

const LayoutComponent = ({ children }) => {
  return (
    <Box
      sx={{
        marginLeft: "-0.5rem",
        marginTop: "-1rem",
        marginRight: "5rem",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div sx={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Center"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "contain",
              marginTop: "1rem",
            }}
          />

          <img
            src="/approved_by_logo.svg"
            alt="Right Logo"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "contain",
              marginTop: "1rem",
              position: "absolute",
              right: "0",
            }}
          />
        </div>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <div
            style={{
              height: "auto",
              width: "100px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/invoice_asset1.png"
              alt="Right"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                marginLeft: "1rem",
                marginTop: "15rem",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              marginLeft: "5rem",
              marginTop: "2rem",
              marginRight: "2rem",
            }}
          >
            {children}
          </div>
        </Grid>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="/compl_footer.png"
          alt="Center"
          style={{
            maxWidth: "100%",
            objectFit: "contain",
            marginTop: "12rem", // Reduced from 9rem to 2rem
          }}
        />
      </div>
    </Box>
  );
};

export default LayoutComponent;
