import React, { useState } from "react";
import { Modal, Button, Box, Typography } from "@mui/material";

const AddChemicals = ({ openChemicals, handleCloseChemicals }) => {
  return (
    <div>
      <Modal
        openChemicals={openChemicals}
        onClose={handleCloseChemicals}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline:"none"
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Chemicals
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Here you can add your service details.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseChemicals}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddChemicals;
