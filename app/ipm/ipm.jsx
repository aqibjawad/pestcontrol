"use client";

import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const Ipm = ({ onImageSelect, availableImages, onImagesChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setDescription("");
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentImage(null);
    setDescription("");
  };

  const handleAddToTable = () => {
    if (currentImage && description) {
      onImageSelect({ ...currentImage, description });
      onImagesChange(
        availableImages.filter((img) => img.id !== currentImage.id)
      );
      handleDialogClose();
    }
  };

  return (
    <div className="p-5">
      <Grid container spacing={2} justifyContent="center" className="mb-8">
        {availableImages.map((image) => (
          <Grid
            item
            key={image.id}
            xs="auto"
            onClick={() => handleImageClick(image)}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardMedia
                component="img"
                width="100"
                height="100"
                image={image.src}
                alt="Selectable image"
                className="w-32 h-32 object-cover"
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Image Description</DialogTitle>
        <DialogContent>
          {currentImage && (
            <div className="space-y-4">
              <img
                src={currentImage.src}
                alt="Selected"
                className="w-full max-w-xs mx-auto my-4"
              />
              <TextField
                autoFocus
                margin="dense"
                label="Description"
                fullWidth
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleAddToTable}
            disabled={!description}
            variant="contained"
            color="primary"
          >
            Add to Table
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Ipm;
