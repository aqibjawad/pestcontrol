import React from "react";
import { Box, Grid } from "@mui/material";

const LayoutComponent = ({ children }) => {
  // A4 size in pixels (assuming 96 DPI)
  const a4Width = 750; // 210mm
  const a4Height = 1123; // 297mm

  return (
    <Box
      sx={{
        width: `${a4Width}px`,
        height: `${a4Height}px`,
        margin: "auto",
        position: "relative",
        border: "1px solid black",
      }}
    >
      <div sx={{ height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Center"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              marginTop:"1rem"
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
              marginRight:"2rem"
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
            maxHeight: "250px",
            objectFit: "contain",
            marginTop:"8.4rem"
          }}
        />
      </div>
    </Box>
  );
};

export default LayoutComponent;
