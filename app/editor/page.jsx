"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const Page = () => {
  const editorRef = useRef(null);

  const logContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent(); // Retrieve the editor content
      console.log("Editor Content:", content); // Log the content
    }
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent(); // Retrieve the editor content

      // Prepare payload
      const payload = {
        content: content,
      };

      console.log("Payload:", payload); // Log the payload for debugging

      // Send payload to the backend
      fetch("/api/submit-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to submit content");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from backend:", data); // Log the backend response
          alert("Content submitted successfully!");
        })
        .catch((error) => {
          console.error("Submission error:", error);
          alert("Failed to submit content!");
        });
    }
  };

  return (
    <div>
      <Editor
        apiKey="zpa6jhahb7wr51wcc4yrbt91xeuizav1kudmrtpziohibpz4"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>Add your content here...</p>"
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "image imagetools",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | link image",
          automatic_uploads: true, // Automatically upload images
          images_upload_url: "/api/upload-image", // Backend API endpoint
          file_picker_types: "image",
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = () => {
              const file = input.files[0];
              const formData = new FormData();
              formData.append("file", file);

              // Send file to the backend
              fetch("/api/upload-image", {
                method: "POST",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  // Use the URL returned by the backend
                  cb(data.location); // Assuming `data.location` is the uploaded image's URL
                })
                .catch((err) => {
                  console.error(err);
                  alert("Failed to upload image!");
                });
            };
            input.click();
          },
        }}
      />
      <button
        onClick={logContent}
        style={{ marginTop: "10px", marginRight: "10px" }}
      >
        Log Content
      </button>
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit
      </button>
    </div>
  );
};

export default Page;
