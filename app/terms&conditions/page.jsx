"use client";

import React, { useState, useEffect } from "react";
import { useTermHook } from "./useTermHook";
import Loading from "../../components/generic/Loading";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import dynamic from "next/dynamic";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import withAuth from "@/utils/withAuth";

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Page = () => {
  const {
    fetchingData,
    brandsList,
    name,
    setName,
    assignStock,
    isEditing,
    setIsEditing,
    handleEditItem,
    currentItemId,
  } = useTermHook();

  // Make sure text is initialized with a non-empty value
  const [text, setText] = useState("<p>Add your text here...</p>");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // Handle text change with validation
  const handleTextChange = (content) => {
    // Ensure content is a string and not empty or just HTML tags
    if (content && content.trim() !== "") {
      setText(content);
      setError(null);
    } else {
      setText("");
      setError("The text field cannot be empty");
    }
  };

  const handleUpdateClick = (item) => {
    const itemText = handleEditItem(item);
    setText(itemText);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName("");
    setText("<p>Add your text here...</p>");
  };

  const viewList = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(brandsList) &&
            brandsList.map((item) => (
              <TableRow
                key={item.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: item.text }} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateClick(item)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleSave = async () => {
    // Validate text before submitting
    if (
      !text ||
      text.trim() === "" ||
      text === "<p></p>" ||
      text === "<p><br></p>"
    ) {
      setError("The text field is required and cannot be empty");
      return;
    }

    setLoadingSubmit(true);
    try {
      // Explicitly pass both name and text to your assign function
      await assignStock({
        name: name,
        text: text,
      });
      setText("<p>Add your text here...</p>"); // Reset text after successful save
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Failed to save");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <div className="pageTitle">Terms And Conditions</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>{viewList()}</div>
          <div>
            <div className="mt-5">
              <InputWithTitle
                title="Enter Name"
                placeholder="Enter Name"
                value={name}
                onChange={(value) => setName(value)}
              />
            </div>

            <div className="mt-5">
              <div className="text-sm font-medium mb-2">Enter Text</div>
              {typeof window !== "undefined" && (
                <ReactQuill
                  className="quill-editor"
                  theme="snow"
                  value={text}
                  onChange={handleTextChange}
                  modules={modules}
                  formats={formats}
                />
              )}
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
            <div className="mt-20 flex space-x-4">
              <GreenButton
                onClick={handleSave}
                title={
                  loadingSubmit ? "Saving..." : isEditing ? "Update" : "Save"
                }
                disabled={loadingSubmit || !text || text.trim() === ""}
                startIcon={
                  loadingSubmit ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              />

              {isEditing && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
