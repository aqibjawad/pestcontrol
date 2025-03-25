import React from "react";

const uploadToCloudinary = () => {
  const file = generatePDFFile();
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pestcontrol"); // Your preset name

  return fetch("https://api.cloudinary.com/v1_1/df59vjsv5/auto/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Upload success:", data);
      return data.secure_url;
    })
    .catch((error) => {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    });
};

export default uploadToCloudinary;
