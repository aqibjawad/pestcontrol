import React from "react";
import { Box, Grid } from "@mui/material";

const LayoutComponent = ({ children }) => {
  const a4Width = 750; // 210mm
  const a4Height = 1050; // 297mm

  return (
    <Box
      sx={{
        width: `${a4Width}px`,
        height: `${a4Height}px`,
        margin: "auto",
        position: "relative",
        // border: "1px solid black",
      }}
    >
      <div sx={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative", // Added for absolute positioning of right image
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
          
          {/* New image added to the right side of the logo */}
          <img
            src="/approved_by_logo.svg" // Replace with your actual image path
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
            marginTop: "7rem",
          }}
        />
      </div>
    </Box>
  );
};

export default LayoutComponent;