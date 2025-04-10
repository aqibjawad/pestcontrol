import React from "react";
import { Box, Grid } from "@mui/material";

const LayoutComponent = ({ children, branchId }) => {
  const a4Width = 750; // 210mm
  const a4Height = 1050; // 297mm

  console.log("branch Id", branchId);

  // Handle default case to prevent errors when branchId is null/undefined
  const getImageSrc = () => {
    switch (branchId) {
      case 9:
        return "/UAE Patti-01.png";
      case 7:
        return "/Sharjah Patti-01.png";
      case 8:
        return "/Ajman Patti-01.png";
      default:
        return null; // Return null when branchId is not valid
    }
  };

  const footerImageSrc = getImageSrc();

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
      {/* Background watermark */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/watermark.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: "none", // Makes it non-interactive
          marginLeft: "5rem",
          marginRight: "5rem",
        }}
      />

      <div style={{ height: "100%", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            width: "100%",
            padding: "1rem",
            marginTop:"1rem"
          }}
        >
          {/* Right logo (new) */}
          <img
            src="/logo.jpeg"
            alt="Right Logo"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />

          {/* Left logo */}
          <img
            src="/approved_by_logo.png"
            alt="Left Logo"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Main content area */}
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
              alt="Left Sidebar"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                marginLeft: "1rem",
                marginTop: "15rem",
              }}
            />
          </div>

          {/* Main content */}
          <div
            style={{
              position: "absolute",
              marginLeft: "5rem",
              marginTop: "2rem",
              marginRight: "2rem",
              width: "calc(100% - 7rem)", // Ensure content doesn't overflow
            }}
          >
            {children}
          </div>
        </Grid>

        {/* Footer image - only render if branchId is valid and image is available */}
        {footerImageSrc && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
              width: "100%",
            }}
          >
            <img
              src={footerImageSrc}
              alt={`Branch ${branchId} Image`}
              style={{
                maxWidth: "100%",
                objectFit: "contain",
                marginTop: "7.5rem",
              }}
            />
          </div>
        )}
      </div>
    </Box>
  );
};

export default LayoutComponent;
